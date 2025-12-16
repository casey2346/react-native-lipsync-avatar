import * as THREE from 'three';

export type LipsyncTarget = {
  mesh: THREE.Mesh;
  influenceIndex: number;
};

export function findFirstMorphTargetMesh(root: THREE.Object3D): LipsyncTarget | null {
  let found: LipsyncTarget | null = null;

  root.traverse((obj) => {
    if (found) return;
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    const dict = (mesh as any).morphTargetDictionary as Record<string, number> | undefined;
    const influences = (mesh as any).morphTargetInfluences as number[] | undefined;

    if (!dict || !influences || influences.length === 0) return;

    const idx = getMouthInfluenceIndex(dict);
    if (idx != null) found = { mesh, influenceIndex: idx };
  });

  return found;
}

function getMouthInfluenceIndex(dict: Record<string, number>): number | null {
  const candidates = [
    'jawOpen',
    'JawOpen',
    'mouthOpen',
    'MouthOpen',
    'viseme_aa',
    'viseme_AA',
    'AA',
    'aah',
    'Aah',
  ];

  for (const name of candidates) {
    if (name in dict) return dict[name];
  }

  const keys = Object.keys(dict);
  const fuzzy = keys.find((k) => /mouth|jaw|viseme/i.test(k));
  if (fuzzy) return dict[fuzzy];

  return keys.length ? dict[keys[0]] : null;
}

export class SimpleAudioLipsync {
  private target: LipsyncTarget | null = null;
  private smoothing = 0.18;
  private current = 0;

  attach(root: THREE.Object3D) {
    this.target = findFirstMorphTargetMesh(root);
  }

  update(volume: number) {
    if (!this.target) return;

    const v = clamp(volume * 1.6, 0, 1);
    this.current = this.current + (v - this.current) * this.smoothing;

    const influences = (this.target.mesh as any).morphTargetInfluences as number[] | undefined;
    if (!influences) return;

    influences[this.target.influenceIndex] = this.current;
  }

  reset() {
    this.current = 0;
    if (!this.target) return;
    const influences = (this.target.mesh as any).morphTargetInfluences as number[] | undefined;
    if (influences) influences[this.target.influenceIndex] = 0;
  }
}

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}
