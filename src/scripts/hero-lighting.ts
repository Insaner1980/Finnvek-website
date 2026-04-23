import {
  AmbientLight,
  DirectionalLight,
  PMREMGenerator,
  type Scene,
  type WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface HeroLights {
  ambient: AmbientLight;
  key: DirectionalLight;
  rim: DirectionalLight;
  pmrem: PMREMGenerator;
}

export function setupLights(scene: Scene, renderer: WebGLRenderer): HeroLights {
  const ambient = new AmbientLight(0xffffff, 0.15);
  scene.add(ambient);

  const key = new DirectionalLight(0xffffff, 1.2);
  key.position.set(-5, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 30;
  key.shadow.bias = -0.001;
  scene.add(key);

  const rim = new DirectionalLight(0x88ccff, 0.5);
  rim.position.set(0, 3, -8);
  scene.add(rim);

  const pmrem = new PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  return { ambient, key, rim, pmrem };
}
