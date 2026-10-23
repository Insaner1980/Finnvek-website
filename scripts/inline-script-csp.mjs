import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

// Only explicitly trusted, build-time inline scripts receive a hash.
// Keep their exact bytes and execution order; Astro handles bundled scripts.
export function hashInlineScripts(html) {
  const nodes = [parse(html, { sourceCodeLocationInfo: true })];
  const hashes = new Set();
  let policyNode, head, redirect;
  while (nodes.length) {
    const node = nodes.pop();
    nodes.push(...(node.childNodes ?? []));
    const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (node.tagName === "head") head = node;
    if (node.tagName === "meta" && attrs["http-equiv"]?.toLowerCase() === "refresh") redirect = true;
    if (node.tagName === "meta" && attrs["http-equiv"]?.toLowerCase() === "content-security-policy") {
      policyNode = node;
    }
    if (node.tagName === "script" && "data-csp-hash" in attrs) {
      if ("src" in attrs) throw new Error("data-csp-hash requires an inline script");
      const code = node.childNodes.map((child) => child.value ?? "").join("");
      hashes.add(`'sha256-${createHash("sha256").update(code).digest("base64")}'`);
    }
  }
  if (!policyNode) {
    if (!redirect || !head || hashes.size) throw new Error("Pages require Astro security.csp");
    // Astro's static redirect documents bypass layout rendering.
      const offset = head.sourceCodeLocation?.startTag.endOffset ?? head.childNodes[0].sourceCodeLocation.startOffset;
    const meta = '<meta http-equiv="content-security-policy" content="default-src \'none\'; script-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'">';
    return html.slice(0, offset) + meta + html.slice(offset);
  }
  const policy = policyNode.attrs.find(({ name }) => name === "content").value;
  const directives = policy.split(";").map((directive) => directive.trim()).filter(Boolean);
  const scriptIndex = directives.findIndex((directive) => directive.startsWith("script-src "));
  if (scriptIndex < 0 || /'unsafe-inline'|'unsafe-eval'/.test(directives[scriptIndex])) {
    throw new Error("Inline script hashes require a restrictive script-src");
  }
  directives[scriptIndex] = [...new Set([...directives[scriptIndex].split(/\s+/), ...hashes])].join(" ");
  const value = directives.join("; ").replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const { startOffset, endOffset } = policyNode.sourceCodeLocation.attrs.content;
  const { startOffset: metaStart, endOffset: metaEnd } = policyNode.sourceCodeLocation;
  const meta = html.slice(metaStart, startOffset) + `content="${value}"` + html.slice(endOffset, metaEnd);
  // A meta CSP only protects content after it. Put it before every resource.
  const headEnd = head.sourceCodeLocation?.startTag.endOffset ?? head.childNodes[0].sourceCodeLocation.startOffset;
  return html.slice(0, headEnd) + meta + html.slice(headEnd, metaStart) + html.slice(metaEnd);
}

export default function inlineScriptCsp() {
  return {
    name: "inline-script-csp",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const root = fileURLToPath(dir);
        for (const file of await readdir(root, { recursive: true })) {
          if (!file.endsWith(".html")) continue;
          const path = join(root, file);
          const html = await readFile(path, "utf8");
          const secured = hashInlineScripts(html);
          if (secured !== html) await writeFile(path, secured);
        }
      },
    },
  };
}
