import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 3D Understanding Engine Scene
 * - Glowing dark cybernetic core with holographic interior
 * - Rotating orbital rings in 3D space with orbiting node labels
 * - Elliptical glowing floor pedestal with concentric rings
 * - Real-time mouse parallax, inertia, and particle emission
 */
export default function EngineHeroScene({ className = 'w-full h-full' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 440;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.6);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ─────────────────────────────────────────────────────────────
    // 1. LIGHTING
    // ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x081338, 3.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f0ff, 8.0, 12);
    cyanPointLight.position.set(0, 0.3, 1.4);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 6.0, 10);
    purplePointLight.position.set(2.2, 1.8, 0.8);
    scene.add(purplePointLight);

    const blueFloorLight = new THREE.PointLight(0x38bdf8, 5.0, 9);
    blueFloorLight.position.set(-2.0, -1.2, 1.0);
    scene.add(blueFloorLight);

    // ─────────────────────────────────────────────────────────────
    // 2. GLOWING FLOOR ELLIPTICAL PEDESTAL
    // ─────────────────────────────────────────────────────────────
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -1.2;
    mainGroup.add(pedestalGroup);

    const floorRings = [
      { radius: 2.4, color: 0x00f0ff, opacity: 0.4 },
      { radius: 1.9, color: 0x3b82f6, opacity: 0.5 },
      { radius: 1.4, color: 0x8b5cf6, opacity: 0.65 },
    ];

    floorRings.forEach((fr) => {
      const ringGeo = new THREE.RingGeometry(fr.radius - 0.02, fr.radius, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: fr.color,
        transparent: true,
        opacity: fr.opacity,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      pedestalGroup.add(ring);
    });

    // ─────────────────────────────────────────────────────────────
    // 3. CENTRAL UNDERSTANDING ENGINE CORE
    // ─────────────────────────────────────────────────────────────
    const coreGroup = new THREE.Group();
    mainGroup.add(coreGroup);

    // Inner glowing sphere nucleus
    const innerNucleusGeo = new THREE.SphereGeometry(0.62, 32, 32);
    const innerNucleusMat = new THREE.MeshStandardMaterial({
      color: 0x040b24,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.85,
      roughness: 0.12,
      metalness: 0.88,
    });
    const innerNucleus = new THREE.Mesh(innerNucleusGeo, innerNucleusMat);
    coreGroup.add(innerNucleus);

    // Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(0.82, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cage);

    // ─────────────────────────────────────────────────────────────
    // 4. 3D ORBITAL RINGS & SATELLITES
    // ─────────────────────────────────────────────────────────────
    const orbitalGroup = new THREE.Group();
    mainGroup.add(orbitalGroup);

    const orbitAngles = [
      { radius: 1.85, tiltX: 0.35, tiltY: 0.45, color: 0x00f0ff, speed: 0.45 },
      { radius: 2.1, tiltX: -0.4, tiltY: -0.35, color: 0x8b5cf6, speed: -0.38 },
      { radius: 2.35, tiltX: 0.25, tiltY: -0.55, color: 0x38bdf8, speed: 0.32 },
    ];

    const ringMeshes = [];
    orbitAngles.forEach((orb) => {
      const ringGeo = new THREE.TorusGeometry(orb.radius, 0.014, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: orb.color,
        transparent: true,
        opacity: 0.45,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = orb.tiltX * Math.PI;
      ring.rotation.y = orb.tiltY * Math.PI;
      orbitalGroup.add(ring);
      ringMeshes.push({ mesh: ring, orb });
    });

    // 7 Satellite Node Spheres that glow
    const satelliteNodes = [
      { label: 'Clauses', angle: 0.2, radius: 1.9, color: 0x38bdf8, y: 0.8 },
      { label: 'Risks', angle: 1.1, radius: 2.1, color: 0xec4899, y: 0.35 },
      { label: 'Dates', angle: 2.2, radius: 1.85, color: 0xa855f7, y: -0.45 },
      { label: 'Entities', angle: 3.14, radius: 2.0, color: 0x3b82f6, y: -0.8 },
      { label: 'Sections', angle: 4.0, radius: 2.2, color: 0x06b6d4, y: -0.35 },
      { label: 'Topics', angle: 4.9, radius: 1.9, color: 0x6366f1, y: 0.25 },
      { label: 'Financial Data', angle: 5.7, radius: 2.05, color: 0x22d3ee, y: 0.7 },
    ];

    const satelliteMeshes = [];
    satelliteNodes.forEach((node) => {
      const nodeGroup = new THREE.Group();

      const sphereGeo = new THREE.SphereGeometry(0.075, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: node.color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphere);

      // Glow halo around node
      const haloGeo = new THREE.RingGeometry(0.09, 0.13, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      nodeGroup.add(halo);

      mainGroup.add(nodeGroup);
      satelliteMeshes.push({ group: nodeGroup, data: node });
    });

    // ─────────────────────────────────────────────────────────────
    // 5. AMBIENT PARTICLES
    // ─────────────────────────────────────────────────────────────
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // ─────────────────────────────────────────────────────────────
    // 6. INTERACTION & ANIMATION LOOP
    // ─────────────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let dragVelocity = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = (clientX / rect.width) * 2 - 1;
      mouseY = -(clientY / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - previousPointerX;
        dragVelocity = deltaX * 0.007;
        mainGroup.rotation.y += dragVelocity;
        previousPointerX = clientX;
      }
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      const rect = container.getBoundingClientRect();
      previousPointerX = e.clientX - rect.left;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation & inertia
      if (!isDragging) {
        dragVelocity *= 0.94;
        mainGroup.rotation.y += 0.0035 + dragVelocity;
      }

      // Parallax camera tilt
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.06;
      camera.position.y += (0.5 - mouseY * 0.28 - camera.position.y) * 0.06;
      camera.lookAt(0, 0.05, 0);

      // Core rotation & pulse
      coreGroup.rotation.y = elapsedTime * 0.35;
      cage.rotation.x = elapsedTime * 0.28;
      cage.rotation.z = elapsedTime * 0.18;
      const pulse = 1 + Math.sin(elapsedTime * 3.2) * 0.06;
      innerNucleus.scale.set(pulse, pulse, pulse);

      // Orbital rings rotation
      ringMeshes.forEach((rm) => {
        rm.mesh.rotation.z = elapsedTime * rm.orb.speed;
      });

      // Update orbiting satellite nodes
      satelliteMeshes.forEach((item) => {
        const angle = item.data.angle + elapsedTime * 0.5;
        const x = Math.cos(angle) * item.data.radius;
        const z = Math.sin(angle) * item.data.radius;
        const y = item.data.y + Math.sin(elapsedTime * 2.2 + item.data.angle) * 0.1;

        item.group.position.set(x, y, z);
        item.group.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click and drag to rotate the Understanding Engine"
    />
  );
}
