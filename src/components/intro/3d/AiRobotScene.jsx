import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 3D Cyber Drone & AI Assistant Scene
 * - Elevated cybernetic pedestal with dual neon rings and floor laser glow
 * - Obsidian & chrome metallic floating AI Drone sphere
 * - Dynamic glowing cyan digital visor with eye expressions that follow cursor gaze
 * - Levitating orbital halo ring & ear rings with micro-particles
 */
export default function AiRobotScene({ className = 'w-full h-full' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.4);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ─────────────────────────────────────────────────────────────
    // LIGHTING
    // ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x060c22, 2.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4.5, 8);
    cyanLight.position.set(0, 0.9, 1.5);
    scene.add(cyanLight);

    const topLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    topLight.position.set(2, 4, 3);
    scene.add(topLight);

    const purpleBack = new THREE.PointLight(0xa855f7, 3, 7);
    purpleBack.position.set(-2, 1.2, -2);
    scene.add(purpleBack);

    // ─────────────────────────────────────────────────────────────
    // 1. ELEVATED CYBER PEDESTAL
    // ─────────────────────────────────────────────────────────────
    const baseGeo = new THREE.CylinderGeometry(1.3, 1.45, 0.12, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x050a1b,
      roughness: 0.2,
      metalness: 0.9,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.75;
    mainGroup.add(base);

    // Outer Neon Glow Ring
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.032, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -0.72;
    mainGroup.add(ring1);

    // Inner Glowing Ring
    const ring2Geo = new THREE.TorusGeometry(0.95, 0.025, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.71;
    mainGroup.add(ring2);

    // ─────────────────────────────────────────────────────────────
    // 2. AI DRONE HEAD & DIGITAL VISOR
    // ─────────────────────────────────────────────────────────────
    const robotGroup = new THREE.Group();
    robotGroup.position.set(0, 0.12, 0);
    mainGroup.add(robotGroup);

    // Obsidian Metallic Outer Shell
    const headGeo = new THREE.SphereGeometry(0.76, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0a142c,
      roughness: 0.1,
      metalness: 0.9,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    robotGroup.add(head);

    // Glossy Visor Screen
    const visorGeo = new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.1);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.05,
      metalness: 0.98,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2.3;
    visor.position.set(0, 0.06, 0.09);
    robotGroup.add(visor);

    // Glowing Cyan Visor Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const leftEyeGeo = new THREE.CapsuleGeometry(0.085, 0.16, 8, 16);
    const leftEye = new THREE.Mesh(leftEyeGeo, eyeMat);
    leftEye.rotation.z = Math.PI / 2;
    leftEye.position.set(-0.25, 0.13, 0.68);
    robotGroup.add(leftEye);

    const rightEyeGeo = new THREE.CapsuleGeometry(0.085, 0.16, 8, 16);
    const rightEye = new THREE.Mesh(rightEyeGeo, eyeMat);
    rightEye.rotation.z = Math.PI / 2;
    rightEye.position.set(0.25, 0.13, 0.68);
    robotGroup.add(rightEye);

    // Side Ear Pods with Glowing Rings
    const earGeo = new THREE.TorusGeometry(0.2, 0.04, 16, 32);
    const earMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.85,
    });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.rotation.y = Math.PI / 2;
    leftEar.position.set(-0.8, 0.06, 0);
    robotGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.rotation.y = Math.PI / 2;
    rightEar.position.set(0.8, 0.06, 0);
    robotGroup.add(rightEar);

    // Top Levitating Halo Ring
    const haloGeo = new THREE.TorusGeometry(0.55, 0.024, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.85,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2.3;
    halo.position.set(0, 0.98, 0);
    robotGroup.add(halo);

    // ─────────────────────────────────────────────────────────────
    // 3. AMBIENT PARTICLES
    // ─────────────────────────────────────────────────────────────
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.5;
      particlePositions[i * 3 + 1] = -0.6 + Math.random() * 2.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // ─────────────────────────────────────────────────────────────
    // INTERACTION & ANIMATION LOOP
    // ─────────────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = (clientX / rect.width) * 2 - 1;
      mouseY = -(clientY / rect.height) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove);

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
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Fluid gaze tracking (Head turns toward mouse cursor smoothly)
      const targetLookY = mouseX * 0.55;
      const targetLookX = -mouseY * 0.3;
      robotGroup.rotation.y += (targetLookY - robotGroup.rotation.y) * 0.09;
      robotGroup.rotation.x += (targetLookX - robotGroup.rotation.x) * 0.09;

      // Levitation floating bobbing
      robotGroup.position.y = 0.12 + Math.sin(elapsedTime * 2.4) * 0.07;

      // Halo spin & floating
      halo.rotation.z = elapsedTime * 0.9;
      halo.position.y = 0.98 + Math.sin(elapsedTime * 3.2) * 0.04;

      // Eye blink & emote cycle
      const blinkCycle = elapsedTime % 4.8;
      if (blinkCycle > 4.65) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
      } else {
        leftEye.scale.y = 1;
        rightEye.scale.y = 1;
      }

      // Pedestal rings spin
      ring1.rotation.z = elapsedTime * 0.5;
      ring2.rotation.z = -elapsedTime * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
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
      className={`relative select-none pointer-events-none ${className}`}
    />
  );
}
