'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ANIMATION_CONFIG } from '@/config/animation';

interface CodeTreeSceneProps {
  onIntroReady?: () => void;
  isExiting?: boolean;
}

interface CellData {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
  lum: number;
}

const CODE_CHARS = [
  'A', '9', 'X', '{', '}', '1', '7', '<', '>', '0',
  'F', 'λ', '::', 'fn', '#', '0x', 'B', '4', '8', 'Y',
  'void', 'var', '&&', '||', '*', '~', 'C', 'K', 'M', 'Q'
];

/**
 * Creates a canvas texture for a specific character with an outer square frame border.
 */
function createCharTexture(char: string, borderColor = 'rgba(255,255,255,0.85)', textColor = '#FFFFFF'): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Clear
  ctx.clearRect(0, 0, size, size);

  // Background cell fill (subtle translucency)
  ctx.fillStyle = 'rgba(15, 18, 22, 0.45)';
  const pad = 6;
  const cornerRadius = 8;

  ctx.beginPath();
  ctx.roundRect(pad, pad, size - pad * 2, size - pad * 2, cornerRadius);
  ctx.fill();

  // Outer border line matching image -1
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Monospace character text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 54px "JetBrains Mono", "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, size / 2, size / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export const CodeTreeScene: React.FC<CodeTreeSceneProps> = ({ onIntroReady, isExiting }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const sceneRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    flowerGroup: THREE.Group | null;
    cellMeshes: {
      mesh: THREE.Mesh;
      initialPos: THREE.Vector3;
      initialRot: THREE.Euler;
      speed: number;
      charIndex: number;
    }[];
    textures: THREE.CanvasTexture[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    flowerGroup: null,
    cellMeshes: [],
    textures: [],
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRefs.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      ANIMATION_CONFIG.intro.cameraFov,
      width / height,
      0.1,
      100
    );
    camera.position.set(0, 0, ANIMATION_CONFIG.intro.cameraZ);
    sceneRefs.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    sceneRefs.current.renderer = renderer;

    // 2. Pre-generate Textures for Alphabet/Numbers/Code symbols
    const textures: THREE.CanvasTexture[] = CODE_CHARS.map((char) =>
      createCharTexture(char)
    );
    sceneRefs.current.textures = textures;

    // 3. Flower/Code Tree Group (centered in lower viewport with negative space above)
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(0, -0.35, 0); // emerging from lower viewport with negative space above
    scene.add(flowerGroup);
    sceneRefs.current.flowerGroup = flowerGroup;

    // Subtle central bloom point light
    const centerLight = new THREE.PointLight(0xffb703, 2.5, 6);
    centerLight.position.set(0, 0.4, 0.5);
    flowerGroup.add(centerLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // 4. Load Cells Data and Create Individual 3D Rotating Code Tiles
    let isDisposed = false;

    fetch('/assets/reference/flower_cells.json')
      .then((res) => res.json())
      .then((cells: CellData[]) => {
        if (isDisposed) return;

        const tileGeo = new THREE.PlaneGeometry(0.12, 0.12);
        const cellMeshes: typeof sceneRefs.current.cellMeshes = [];

        cells.forEach((cell, i) => {
          const charIdx = i % textures.length;
          const tex = textures[charIdx];

          // Use the exact color from image -1
          const color = new THREE.Color(cell.r / 255, cell.g / 255, cell.b / 255);

          // Give brighter elements subtle glow factor
          const isLuminous = cell.lum > 180;
          const mat = new THREE.MeshBasicMaterial({
            map: tex,
            color: color,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            depthWrite: false,
          });

          const mesh = new THREE.Mesh(tileGeo, mat);

          // Position matching the organic botanical sculpture
          // Offset Y slightly downwards so stem anchors near bottom
          const posX = cell.x * ANIMATION_CONFIG.intro.cellSpreadScale;
          const posY = cell.y * ANIMATION_CONFIG.intro.cellSpreadScale;
          const posZ = cell.z * 1.2;

          mesh.position.set(posX, posY, posZ);

          // Slight random initial rotation in elements
          mesh.rotation.z = (Math.random() - 0.5) * 0.15;
          mesh.rotation.y = (Math.random() - 0.5) * 0.2;

          flowerGroup.add(mesh);

          cellMeshes.push({
            mesh,
            initialPos: new THREE.Vector3(posX, posY, posZ),
            initialRot: mesh.rotation.clone(),
            speed: 0.8 + Math.random() * 1.2,
            charIndex: charIdx,
          });
        });

        sceneRefs.current.cellMeshes = cellMeshes;

        // 5. Entrance Animation (assembly & blossom)
        const entranceTL = gsap.timeline({
          delay: 0.15,
          onComplete: () => {
            if (onIntroReady) {
              onIntroReady();
            }
          },
        });

        // Group rises upwards
        flowerGroup.position.y = -1.6;
        flowerGroup.scale.set(0.65, 0.65, 0.65);

        entranceTL.to(
          flowerGroup.position,
          {
            y: -0.28,
            duration: ANIMATION_CONFIG.intro.entranceDuration,
            ease: 'power3.out',
          },
          0
        );

        entranceTL.to(
          flowerGroup.scale,
          {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: ANIMATION_CONFIG.intro.entranceDuration,
            ease: 'power3.out',
          },
          0
        );

        // Staggered fade in & rotation assembly for individual code tiles
        cellMeshes.forEach((item, idx) => {
          const mat = item.mesh.material as THREE.MeshBasicMaterial;
          const delay = (item.initialPos.y + 1.5) * 0.25 + Math.random() * 0.2;

          entranceTL.to(
            mat,
            {
              opacity: item.mesh.userData.isDim ? 0.65 : 0.98,
              duration: 1.2,
              ease: 'power2.out',
            },
            delay
          );

          item.mesh.position.y -= 0.4;
          entranceTL.to(
            item.mesh.position,
            {
              y: item.initialPos.y,
              duration: 1.4,
              ease: 'back.out(1.2)',
            },
            delay
          );
        });
      })
      .catch((err) => {
        console.warn('Cells load note:', err);
      });

    // 6. Interactive Mouse & Gyro Rotation
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = nx * ANIMATION_CONFIG.intro.mouseParallaxStrength * 4.0;
      targetRotX = -ny * ANIMATION_CONFIG.intro.mouseParallaxStrength * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !sceneRefs.current.renderer || !sceneRefs.current.camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      sceneRefs.current.camera.aspect = w / h;
      sceneRefs.current.camera.updateProjectionMatrix();
      sceneRefs.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop with 3D Rotation in elements
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let charCycleTimer = 0;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth mouse lerp
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      // CONTINUOUS 3D ROTATION:
      // The entire code tree rotates smoothly around the Y-axis and oscillates in X/Z
      if (flowerGroup) {
        flowerGroup.rotation.y = elapsedTime * ANIMATION_CONFIG.intro.rotationSpeedY * 4.0 + currentRotY;
        flowerGroup.rotation.x = Math.sin(elapsedTime * 0.6) * 0.06 + currentRotX;
        flowerGroup.rotation.z = Math.cos(elapsedTime * 0.4) * 0.03;
      }

      // ROTATION IN INDIVIDUAL ELEMENTS:
      // Each tile has independent micro-rotations, depth breathing waves, and subtle orientation wobble
      const cellMeshes = sceneRefs.current.cellMeshes;
      const totalCells = cellMeshes.length;

      for (let i = 0; i < totalCells; i++) {
        const item = cellMeshes[i];
        const mesh = item.mesh;

        // Individual tile rotation in X, Y, Z
        const phase = elapsedTime * item.speed + i * 0.12;
        mesh.rotation.y = item.initialRot.y + Math.sin(phase) * 0.28;
        mesh.rotation.x = item.initialRot.x + Math.cos(phase * 0.8) * 0.18;
        mesh.rotation.z = item.initialRot.z + Math.sin(phase * 0.5) * 0.12;

        // 3D undulating wave in Z space
        const wave = Math.sin(elapsedTime * 1.8 + item.initialPos.x * 2.5 + item.initialPos.y * 2.0) * 0.04;
        mesh.position.z = item.initialPos.z + wave;
      }

      // Dynamic Character Ticking / Matrix Code Cycle:
      charCycleTimer += 0.016;
      if (charCycleTimer > 0.12 && totalCells > 0) {
        charCycleTimer = 0;
        // Randomly pick a few cells to tick/cycle their character texture
        const tickCount = Math.floor(totalCells * 0.04);
        for (let k = 0; k < tickCount; k++) {
          const randIdx = Math.floor(Math.random() * totalCells);
          const item = cellMeshes[randIdx];
          const nextCharIdx = (item.charIndex + 1) % textures.length;
          item.charIndex = nextCharIdx;
          (item.mesh.material as THREE.MeshBasicMaterial).map = textures[nextCharIdx];
          (item.mesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sceneRefs.current.cellMeshes.forEach((item) => {
        item.mesh.geometry.dispose();
        (item.mesh.material as THREE.Material).dispose();
      });

      textures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [onIntroReady]);

  // Handle 3D Warp Fly-Through Exit Transition on "Let's Explore" Click
  useEffect(() => {
    if (isExiting && sceneRefs.current.flowerGroup && sceneRefs.current.camera) {
      const group = sceneRefs.current.flowerGroup;
      const camera = sceneRefs.current.camera;
      const cellMeshes = sceneRefs.current.cellMeshes;

      // 1. Camera Dolly-Zoom Warp: Push forward through z=0 with FOV expansion
      gsap.to(camera.position, {
        z: -0.4,
        duration: 1.1,
        ease: 'power3.in',
      });

      // Dynamic FOV expansion creates the 3D perspective warp tunnel illusion
      const fovObj = { fov: camera.fov };
      gsap.to(fovObj, {
        fov: 78,
        duration: 1.0,
        ease: 'power2.in',
        onUpdate: () => {
          camera.fov = fovObj.fov;
          camera.updateProjectionMatrix();
        },
      });

      // 2. Group spins and stretches into hyperspace
      gsap.to(group.rotation, {
        y: group.rotation.y + 2.8,
        z: group.rotation.z + 0.6,
        duration: 1.1,
        ease: 'power2.in',
      });

      // 3. Individual tiles explode outwards and fly past camera
      cellMeshes.forEach((item, idx) => {
        const mesh = item.mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;

        // Disperse radially past viewer
        const dirX = item.initialPos.x * (2.8 + Math.random() * 2.5);
        const dirY = item.initialPos.y * (2.8 + Math.random() * 2.5);
        const flyZ = item.initialPos.z + 5.5 + Math.random() * 4.0;

        gsap.to(mesh.position, {
          x: dirX,
          y: dirY,
          z: flyZ,
          duration: 1.0 + Math.random() * 0.2,
          ease: 'power3.in',
        });

        // Tumble wildly on all axes
        gsap.to(mesh.rotation, {
          x: mesh.rotation.x + (Math.random() - 0.5) * 6,
          y: mesh.rotation.y + Math.PI * 3,
          z: mesh.rotation.z + (Math.random() - 0.5) * 4,
          duration: 1.0,
          ease: 'power2.in',
        });

        // Fade out right as they pass the camera plane
        gsap.to(mat, {
          opacity: 0,
          duration: 0.9,
          delay: 0.15 + Math.random() * 0.1,
          ease: 'power2.in',
        });
      });
    }
  }, [isExiting]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
};
