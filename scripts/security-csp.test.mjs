import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { parse } from "parse5";

test("built pages allow their own scripts without allowing arbitrary inline JavaScript", () => {
  const files = readdirSync("dist", { recursive: true }).filter((file) => file.endsWith(".html"));
  assert.ok(files.length > 0, "Run npm run build first");
  let protectedPages = 0;
  for (const file of files) {
    const nodes = [parse(readFileSync(join("dist", file), "utf8"), { sourceCodeLocationInfo: true })];
    const scripts = [];
    let policy, policyOffset, redirect;
    while (nodes.length) {
      const node = nodes.pop();
      nodes.push(...(node.childNodes ?? []));
      const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
      assert.ok(!Object.keys(attrs).some((name) => /^on\w+$/.test(name)), `${file}: inline event handler`);
      if (node.tagName === "meta" && attrs["http-equiv"]?.toLowerCase() === "content-security-policy") {
        policy = attrs.content;
        policyOffset = node.sourceCodeLocation.endOffset;
      }
      if (node.tagName === "meta" && attrs["http-equiv"]?.toLowerCase() === "refresh") redirect = true;
      if (node.tagName === "script" && (!attrs.type || /^(module|text\/javascript|application\/javascript)$/.test(attrs.type))) scripts.push({ node, attrs });
    }
    assert.ok(policy, `${file}: missing CSP`);
    protectedPages++;
    assert.match(policy, redirect ? /default-src '(self|none)'/ : /default-src 'self'/, file);
    const scriptPolicy = policy.split(";").find((value) => value.trim().startsWith("script-src "));
    assert.ok(scriptPolicy, file);
    assert.doesNotMatch(scriptPolicy, /unsafe-inline|unsafe-eval|data:|blob:|\*/, file);
    for (const { node, attrs } of scripts) {
      assert.ok(node.sourceCodeLocation.startOffset >= policyOffset, `${file}: script before CSP`);
      if (attrs.src) {
        if (/^https?:/.test(attrs.src)) assert.ok(scriptPolicy.includes(new URL(attrs.src).origin), `${file}: blocked external script`);
        else assert.ok(!/^(data:|blob:|\/\/)/.test(attrs.src), `${file}: unexpected script source`);
      } else {
        const code = node.childNodes.map((child) => child.value ?? "").join("");
        const hash = createHash("sha256").update(code).digest("base64");
        assert.ok(scriptPolicy.includes(`'sha256-${hash}'`), `${file}: blocked inline script`);
      }
    }
  }
  console.log(`CSP verified: ${protectedPages}/${files.length} HTML documents`);
  const headers = readFileSync("dist/_headers", "utf8");
  const cacheRules = new Map();
  let route;
  for (const line of headers.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (line.startsWith("/")) route = line.trim();
    const cache = line.match(/^\s+Cache-Control:\s*(.+)$/i);
    if (cache) cacheRules.set(route, cache[1]);
  }
  assert.equal(cacheRules.get("/*"), "no-transform", "Assets must not inherit forced revalidation");
  for (const route of ["/", "/privacy", "/privacy/", "/404.html"]) {
    assert.equal(cacheRules.get(route), "public, must-revalidate, max-age=0", `${route}: HTML freshness`);
  }
  assert.equal(cacheRules.size, 5, "Cache overrides must remain limited to HTML routes");
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Permissions-Policy: .*camera=\(\).*microphone=\(\)/);
  for (const line of headers.split(/\r?\n/)) assert.ok(line.length <= 2000, "Cloudflare header line limit");
});

test("built pages allow style attributes independently of stylesheet hashes", () => {
  const files = readdirSync("dist", { recursive: true }).filter((file) => file.endsWith(".html"));
  let revealMatteFound = false;
  for (const file of files) {
    const nodes = [parse(readFileSync(join("dist", file), "utf8"))];
    let policy;
    let hasStyleAttributes = false;
    while (nodes.length) {
      const node = nodes.pop();
      nodes.push(...(node.childNodes ?? []));
      const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
      if (attrs["http-equiv"]?.toLowerCase() === "content-security-policy") policy = attrs.content;
      if ("style" in attrs) hasStyleAttributes = true;
      if (attrs.style?.includes("--reveal-matte")) revealMatteFound = true;
    }
    if (hasStyleAttributes) {
      const attributePolicy = policy?.split(";").find((value) => value.trim().startsWith("style-src-attr "));
      assert.equal(attributePolicy?.trim(), "style-src-attr 'unsafe-inline'", `${file}: blocked style attributes`);
    }
  }
  assert.ok(revealMatteFound, "The home page reveal style must be covered");
});

if (existsSync("scripts/inline-script-csp.mjs")) {
  test("only explicitly marked scripts are hashed and the document body stays unchanged", async () => {
    const { hashInlineScripts } = await import("./inline-script-csp.mjs");
    const head = '<head><meta http-equiv="content-security-policy" content="script-src \'self\'; style-src \'self\'"></head>';
    const trusted = "window.example = '<x>';\n";
    const body = `<body><script data-csp-hash>${trusted}</script><script>window.untrusted = true;</script></body>`;
    const result = hashInlineScripts(head + body);
    assert.ok(result.endsWith(body));
    assert.ok(result.includes(createHash("sha256").update(trusted).digest("base64")));
    assert.ok(!result.includes(createHash("sha256").update("window.untrusted = true;").digest("base64")));
    assert.equal(hashInlineScripts(result), result, "hashing is idempotent");
    assert.throws(() => hashInlineScripts(body), /security.csp/);
    const redirect = '<!doctype html><meta http-equiv="refresh" content="0;url=/tools/"><title>Redirect</title>';
    assert.match(hashInlineScripts(redirect), /default-src 'none'; script-src 'none'/);
  });
}
