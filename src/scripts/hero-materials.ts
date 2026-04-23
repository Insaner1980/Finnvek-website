import { DoubleSide, MeshStandardMaterial } from 'three';

export function createLetterMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.4,
    metalness: 0.0,
    envMapIntensity: 0.6,
    side: DoubleSide,
    transparent: true,
    opacity: 0,
  });
}

export function createPlatformMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.4,
    metalness: 0.0,
    envMapIntensity: 0.6,
    transparent: true,
    opacity: 0,
  });
}

export function createDotMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: 0x24d4c2,
    emissive: 0x24d4c2,
    emissiveIntensity: 0,
    roughness: 0.2,
    metalness: 0.0,
  });
}
