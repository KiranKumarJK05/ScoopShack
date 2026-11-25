import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

type TrioPresetId = 'classic' | 'berry' | 'fudge';

interface TrioPreset {
  id: TrioPresetId;
  label: string;
  scoopColors: [number, number, number];
  drizzleColor: number;
}

const TRIO_PRESETS: TrioPreset[] = [
  {
    id: 'classic',
    label: 'Classic Trio',
    scoopColors: [0xf7eed8, 0xe87b8d, 0x4b2a1e],
    drizzleColor: 0x3b1f14,
  },
  {
    id: 'berry',
    label: 'Alphonso Berry',
    scoopColors: [0xf5be4f, 0xe86f82, 0xf7eed8],
    drizzleColor: 0xc93b55,
  },
  {
    id: 'fudge',
    label: 'Belgian Fudge',
    scoopColors: [0x593424, 0x7a9e7e, 0x3b2318],
    drizzleColor: 0x26120b,
  },
];

function createWaffleTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#d7a467';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle baked biscuit gradient variation
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, 'rgba(255, 232, 195, 0.25)');
  grad.addColorStop(1, 'rgba(138, 86, 38, 0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Crisp diamond waffle grid
  ctx.strokeStyle = '#9d6431';
  ctx.lineWidth = 6;
  const step = 42;
  for (let i = -512; i < 1024; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 512);
    ctx.lineTo(i + 512, 0);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(250, 224, 184, 0.45)';
  ctx.lineWidth = 2;
  for (let i = -512; i < 1024; i += step) {
    ctx.beginPath();
    ctx.moveTo(i + 3, 0);
    ctx.lineTo(i + 515, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createCreamTexture(
  baseHex: string,
  fleckHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  // Soft artisanal churn swirls and vanilla flecks
  for (let i = 0; i < 240; i++) {
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 43758.5453) % 1;
    const px = Math.abs(x) * 256;
    const py = Math.abs(y) * 256;
    const r = 0.7 + (i % 3) * 0.45;
    ctx.fillStyle = fleckHex;
    ctx.globalAlpha = i % 4 === 0 ? 0.45 : 0.2;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createWaferStripeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e7c391';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#4a291b';
  for (let i = -256; i < 512; i += 48) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 18, 0);
    ctx.lineTo(i + 274, 256);
    ctx.lineTo(i + 256, 256);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
  grad.addColorStop(0, 'rgba(59, 35, 24, 0.32)');
  grad.addColorStop(0.5, 'rgba(59, 35, 24, 0.11)');
  grad.addColorStop(1, 'rgba(59, 35, 24, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function IceCreamHero3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [preset, setPreset] = useState<TrioPresetId>('classic');
  const targetColorsRef = useRef({
    s1: new THREE.Color(TRIO_PRESETS[0].scoopColors[0]),
    s2: new THREE.Color(TRIO_PRESETS[0].scoopColors[1]),
    s3: new THREE.Color(TRIO_PRESETS[0].scoopColors[2]),
    drizzle: new THREE.Color(TRIO_PRESETS[0].drizzleColor),
  });

  useEffect(() => {
    const selected = TRIO_PRESETS.find((p) => p.id === preset) ?? TRIO_PRESETS[0];
    targetColorsRef.current.s1.setHex(selected.scoopColors[0]);
    targetColorsRef.current.s2.setHex(selected.scoopColors[1]);
    targetColorsRef.current.s3.setHex(selected.scoopColors[2]);
    targetColorsRef.current.drizzle.setHex(selected.drizzleColor);
  }, [preset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4ede0);
    scene.fog = new THREE.Fog(0xf4ede0, 9.5, 19);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    const updateCameraFraming = (w: number, h: number) => {
      const aspect = w / Math.max(h, 1);
      camera.aspect = aspect;
      // Keep the entire pedestal-to-cherry silhouette framed with generous margin on desktop and mobile
      const dist = aspect < 0.95 ? 7.35 / Math.max(aspect, 0.72) : 7.35;
      camera.position.set(0.24, 2.28, Math.min(dist, 9.4));
      camera.lookAt(0, 1.78, 0);
      camera.updateProjectionMatrix();
    };
    updateCameraFraming(width, height);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Luxury 3-point + softbox studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0xfffaf2, 0xcabaa5, 1.05);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    keyLight.position.set(4.0, 6.8, 4.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.radius = 4;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -2.6;
    keyLight.shadow.camera.right = 2.6;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -1.2;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfdf8f0, 0.75);
    fillLight.position.set(-4.2, 3.6, 3.4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe4efe5, 1.05);
    rimLight.position.set(-3.8, 4.2, -4.4);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xfff6ea, 3.4, 3.2, 4.5);
      softbox.position.set(3.4, 3.2, 3.2);
      softbox.lookAt(0, 1.9, 0);
      scene.add(softbox);
    }

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const disposables: Array<{ dispose: () => void }> = [envTex];

    const track = <T extends { dispose: () => void }>(res: T): T => {
      disposables.push(res);
      return res;
    };

    const waffleTex = track(createWaffleTexture(maxAnisotropy));
    const creamTex = track(createCreamTexture('#ffffff', '#3b2318', maxAnisotropy));
    const waferTex = track(createWaferStripeTexture(maxAnisotropy));
    const shadowTex = track(createContactShadowTexture());

    // Soft radial contact shadow + subtle cast shadow receiver plane on studio floor
    const shadowPlaneGeo = track(new THREE.PlaneGeometry(3.4, 3.4));
    const shadowPlaneMat = track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    );
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.002;
    scene.add(shadowPlane);

    const stageFloorGeo = track(new THREE.PlaneGeometry(7.0, 7.0));
    const stageFloorMat = track(
      new THREE.ShadowMaterial({
        color: 0x3b2318,
        opacity: 0.14,
      }),
    );
    const stageFloor = new THREE.Mesh(stageFloorGeo, stageFloorMat);
    stageFloor.rotation.x = -Math.PI / 2;
    stageFloor.position.y = 0.005;
    stageFloor.receiveShadow = true;
    scene.add(stageFloor);

    // Root cone sculpture group pivoted at bottom-center (y = 0)
    const sculpture = new THREE.Group();
    const baseYaw = -0.24;
    sculpture.rotation.y = baseYaw;
    scene.add(sculpture);

    // 1. Ceramic Tasting Pedestal Base (LatheGeometry — grounded cleanly on floor)
    const standPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.76, 0.0),
      new THREE.Vector2(0.76, 0.06),
      new THREE.Vector2(0.62, 0.1),
      new THREE.Vector2(0.24, 0.14),
      new THREE.Vector2(0.2, 0.28),
      new THREE.Vector2(0.56, 0.34),
      new THREE.Vector2(0.58, 0.4),
      new THREE.Vector2(0.32, 0.4),
      new THREE.Vector2(0.3, 0.28),
      new THREE.Vector2(0.0, 0.28),
    ];
    const standGeo = track(new THREE.LatheGeometry(standPoints, 48));
    const standMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xfffdf9,
        roughness: 0.24,
        metalness: 0.04,
        clearcoat: 0.45,
        clearcoatRoughness: 0.22,
      }),
    );
    const standMesh = new THREE.Mesh(standGeo, standMat);
    standMesh.castShadow = true;
    standMesh.receiveShadow = true;
    sculpture.add(standMesh);

    // 2. Brushed Brass Collar Ring
    const collarGeo = track(new THREE.TorusGeometry(0.56, 0.024, 16, 48));
    const collarMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xc9a35b,
        roughness: 0.22,
        metalness: 0.88,
      }),
    );
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 0.37;
    sculpture.add(collarMesh);

    // Cone assembly (poised cleanly inside tasting stand with gentle luxury float)
    const coneAssembly = new THREE.Group();
    const baseFloatY = 0.34;
    coneAssembly.position.y = baseFloatY;
    sculpture.add(coneAssembly);

    // 3. Waffle Cone (inverted cone)
    const coneGeo = track(new THREE.ConeGeometry(0.54, 1.55, 48, 1, false));
    const coneMat = track(
      new THREE.MeshStandardMaterial({
        map: waffleTex,
        roughness: 0.72,
        metalness: 0.02,
      }),
    );
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.rotation.x = Math.PI;
    coneMesh.position.y = 0.78;
    coneMesh.castShadow = true;
    coneMesh.receiveShadow = true;
    coneAssembly.add(coneMesh);

    // 4. Sage Paper Cone Sleeve
    const sleeveGeo = track(new THREE.CylinderGeometry(0.41, 0.19, 0.74, 40, 1, true));
    const sleeveMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x5f8264,
        roughness: 0.85,
        metalness: 0.0,
        side: THREE.DoubleSide,
      }),
    );
    const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeveMesh.position.y = 0.65;
    sleeveMesh.castShadow = true;
    coneAssembly.add(sleeveMesh);

    // 5. Three Artisan Ice Cream Scoops + Scalloped Skirt Ruffles (subtle frosty sheen)
    const createScoopMaterial = (hex: number, roughness: number) =>
      track(
        new THREE.MeshPhysicalMaterial({
          color: hex,
          map: creamTex,
          roughness,
          metalness: 0.02,
          clearcoat: 0.14,
          clearcoatRoughness: 0.55,
          sheen: 0.25,
          sheenRoughness: 0.72,
          sheenColor: new THREE.Color(0xfffaf2),
        }),
      );

    const scoop1Mat = createScoopMaterial(TRIO_PRESETS[0].scoopColors[0], 0.42);
    const scoop2Mat = createScoopMaterial(TRIO_PRESETS[0].scoopColors[1], 0.38);
    const scoop3Mat = createScoopMaterial(TRIO_PRESETS[0].scoopColors[2], 0.36);

    const buildScoop = (radius: number, yPos: number, mat: THREE.MeshPhysicalMaterial) => {
      const group = new THREE.Group();
      group.position.y = yPos;

      const sphereGeo = track(new THREE.SphereGeometry(radius, 40, 32));
      const mainScoop = new THREE.Mesh(sphereGeo, mat);
      mainScoop.scale.set(1.04, 0.94, 1.04);
      mainScoop.castShadow = true;
      mainScoop.receiveShadow = true;
      group.add(mainScoop);

      // Scalloped scoop skirt puffs for realistic scooped silhouette
      const puffGeo = track(new THREE.SphereGeometry(radius * 0.25, 16, 14));
      const puffCount = 12;
      for (let i = 0; i < puffCount; i++) {
        const angle = (i / puffCount) * Math.PI * 2;
        const puff = new THREE.Mesh(puffGeo, mat);
        const rOffset = radius * 0.84;
        puff.position.set(
          Math.cos(angle) * rOffset,
          -radius * 0.42 + (i % 2 === 0 ? 0.02 : -0.02),
          Math.sin(angle) * rOffset,
        );
        puff.scale.set(1.1, 0.72, 1.1);
        puff.castShadow = true;
        group.add(puff);
      }
      return group;
    };

    const scoop1 = buildScoop(0.52, 1.66, scoop1Mat);
    const scoop2 = buildScoop(0.45, 2.26, scoop2Mat);
    const scoop3 = buildScoop(0.38, 2.78, scoop3Mat);
    coneAssembly.add(scoop1, scoop2, scoop3);

    // 6. Glossy Sauce Drizzle Spiral over Top Scoop
    const drizzlePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const angle = t * Math.PI * 4.5;
      const r = 0.04 + t * 0.34;
      const y = 3.16 - t * t * 0.42;
      drizzlePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    const drizzleCurve = new THREE.CatmullRomCurve3(drizzlePoints);
    const drizzleGeo = track(new THREE.TubeGeometry(drizzleCurve, 64, 0.026, 12, false));
    const drizzleMat = track(
      new THREE.MeshPhysicalMaterial({
        color: TRIO_PRESETS[0].drizzleColor,
        roughness: 0.14,
        metalness: 0.05,
        clearcoat: 0.92,
        clearcoatRoughness: 0.09,
      }),
    );
    const drizzleMesh = new THREE.Mesh(drizzleGeo, drizzleMat);
    drizzleMesh.castShadow = true;
    coneAssembly.add(drizzleMesh);

    // 7. Rolled Wafer Biscuit Stick
    const waferGeo = track(new THREE.CylinderGeometry(0.055, 0.055, 0.95, 24));
    const waferMat = track(
      new THREE.MeshStandardMaterial({
        map: waferTex,
        roughness: 0.65,
        metalness: 0.02,
      }),
    );
    const waferMesh = new THREE.Mesh(waferGeo, waferMat);
    waferMesh.position.set(0.28, 3.12, -0.08);
    waferMesh.rotation.set(0.18, 0.2, -0.48);
    waferMesh.castShadow = true;
    coneAssembly.add(waferMesh);

    // 8. Fresh Cherry Crown + Stem + Mint Leaf
    const cherryGroup = new THREE.Group();
    cherryGroup.position.set(-0.04, 3.21, 0.06);
    const cherryGeo = track(new THREE.SphereGeometry(0.11, 24, 20));
    const cherryMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xb91c3b,
        roughness: 0.16,
        metalness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
      }),
    );
    const cherryMesh = new THREE.Mesh(cherryGeo, cherryMat);
    cherryMesh.castShadow = true;
    cherryGroup.add(cherryMesh);

    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.09, 0),
      new THREE.Vector3(0.03, 0.24, 0.02),
      new THREE.Vector3(0.1, 0.34, -0.02),
    ]);
    const stemGeo = track(new THREE.TubeGeometry(stemCurve, 16, 0.01, 8, false));
    const stemMat = track(new THREE.MeshStandardMaterial({ color: 0x4b6e4f, roughness: 0.6 }));
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    cherryGroup.add(stemMesh);

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.11, 0.09, 0.22, 0.02);
    leafShape.quadraticCurveTo(0.11, -0.07, 0, 0);
    const leafGeo = track(
      new THREE.ExtrudeGeometry(leafShape, {
        depth: 0.012,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005,
        bevelSegments: 2,
      }),
    );
    const leafMat = track(new THREE.MeshStandardMaterial({ color: 0x5f8264, roughness: 0.52 }));
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.position.set(-0.14, -0.04, 0.06);
    leafMesh.rotation.set(-0.4, 0.3, 0.45);
    cherryGroup.add(leafMesh);
    coneAssembly.add(cherryGroup);

    // 9. Instanced Sprinkles across the scoops
    const sprinkleGeo = track(new THREE.CapsuleGeometry(0.015, 0.055, 6, 8));
    const sprinkleMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.32,
        metalness: 0.05,
      }),
    );
    const sprinkleCount = 36;
    const sprinkles = new THREE.InstancedMesh(sprinkleGeo, sprinkleMat, sprinkleCount);
    const dummy = new THREE.Object3D();
    const palette = [
      new THREE.Color(0xd9546b),
      new THREE.Color(0x5f8264),
      new THREE.Color(0xf5be4f),
      new THREE.Color(0xfffdf9),
      new THREE.Color(0x3b2318),
    ];

    for (let i = 0; i < sprinkleCount; i++) {
      const layer = i % 3;
      const centerY = layer === 0 ? 1.66 : layer === 1 ? 2.26 : 2.78;
      const rBase = layer === 0 ? 0.51 : layer === 1 ? 0.44 : 0.37;
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const phi = 0.25 + ((i * 0.19) % 0.85);

      dummy.position.set(
        Math.sin(phi) * Math.cos(theta) * rBase,
        centerY + Math.cos(phi) * rBase * 0.86,
        Math.sin(phi) * Math.sin(theta) * rBase,
      );
      dummy.rotation.set(i * 0.7, i * 1.1, i * 0.4);
      const s = 0.85 + (i % 4) * 0.12;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      sprinkles.setMatrixAt(i, dummy.matrix);
      sprinkles.setColorAt(i, palette[i % palette.length]);
    }
    sprinkles.instanceMatrix.needsUpdate = true;
    if (sprinkles.instanceColor) sprinkles.instanceColor.needsUpdate = true;
    sprinkles.computeBoundingSphere();
    coneAssembly.add(sprinkles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Subtle pointer tilt inspection that gently springs back to showcase pose
    let isDragging = false;
    let prevX = 0;
    let dragOffsetY = 0;
    let currentDragOffsetY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      dragOffsetY = THREE.MathUtils.clamp(dragOffsetY + dx * 0.0065, -0.55, 0.55);
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // ResizeObserver for crisp responsive framing on desktop & mobile
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      updateCameraFraming(w, h);
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Render loop with Software WebGL pacing
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        dragOffsetY = THREE.MathUtils.damp(dragOffsetY, 0, 2.8, delta);
      }
      currentDragOffsetY = THREE.MathUtils.damp(currentDragOffsetY, dragOffsetY, 7.5, delta);

      if (!prefersReducedMotion) {
        // Gentle up-and-down floating motion for the cone & scoops
        const floatWave = Math.sin(elapsed * 1.15);
        coneAssembly.position.y = baseFloatY + floatWave * 0.036;

        // Very slow, subtle side-to-side luxury showcase sway (no continuous 360 spin)
        const subtleYaw = Math.sin(elapsed * 0.58) * 0.14;
        const subtleRoll = Math.sin(elapsed * 0.48) * 0.026;
        const subtlePitch = Math.cos(elapsed * 0.42) * 0.016;

        sculpture.rotation.y = baseYaw + subtleYaw + currentDragOffsetY;
        coneAssembly.rotation.z = subtleRoll;
        coneAssembly.rotation.x = subtlePitch;

        // Breathe contact shadow slightly with vertical float height
        const shadowScale = 1.0 - floatWave * 0.035;
        shadowPlane.scale.set(shadowScale, shadowScale, 1);
        shadowPlaneMat.opacity = 0.88 - floatWave * 0.08;
      } else {
        sculpture.rotation.y = baseYaw + currentDragOffsetY;
        coneAssembly.position.y = baseFloatY;
        coneAssembly.rotation.z = 0;
        coneAssembly.rotation.x = 0;
      }

      // Smoothly damp scoop colors on preset change
      const colorDamp = 1 - Math.exp(-7 * delta);
      scoop1Mat.color.lerp(targetColorsRef.current.s1, colorDamp);
      scoop2Mat.color.lerp(targetColorsRef.current.s2, colorDamp);
      scoop3Mat.color.lerp(targetColorsRef.current.s3, colorDamp);
      drizzleMat.color.lerp(targetColorsRef.current.drizzle, colorDamp);

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-full min-h-[440px] rounded-2xl overflow-hidden border border-[#E8DFD1] bg-[#F4EDE0]">
      <div
        ref={mountRef}
        aria-label="Interactive 3D triple-scoop ice cream cone luxury showcase. Drag gently to tilt."
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Compact bottom control dock inside 3D stage (no backdrop-blur over WebGL) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-full bg-[#FFFDF9]/95 border border-[#E8DFD1] shadow-sm">
        {TRIO_PRESETS.map((item) => {
          const active = preset === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPreset(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#3B2318] text-[#FAF6EE]'
                  : 'text-[#7A6357] hover:text-[#3B2318]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
