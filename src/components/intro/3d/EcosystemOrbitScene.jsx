import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 3D Neural Constellation Hub Scene — "Everything Connected"
 * - Central glowing intelligence hub with pulsing concentric shockwave rings
 * - 7 feature node spheres arranged in orbital constellation
 * - Visible glowing neural synaptic connection lines from hub to every node
 * - Traveling data packets (photon sparks) flowing along each connection
 * - Inter-node cross-links forming a true interconnected mesh
 * - Smooth slow rotation, mouse parallax, and interactive drag
 */
export default function EcosystemOrbitScene({ className = 'w-full h-full' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ─────────────────────────────────────────────────────────────
    // 1. LIGHTING
    // ─────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x081338, 3.5));

    const coreGlow = new THREE.PointLight(0x38bdf8, 6.0, 12);
    coreGlow.position.set(0, 0.4, 0);
    scene.add(coreGlow);

    const accentLight = new THREE.PointLight(0x818cf8, 3.0, 10);
    accentLight.position.set(3, 2, 2);
    scene.add(accentLight);

    const fillLight = new THREE.PointLight(0x6366f1, 2.5, 9);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    // ─────────────────────────────────────────────────────────────
    // 2. GROUNDED PEDESTAL
    // ─────────────────────────────────────────────────────────────
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -0.6;
    mainGroup.add(pedestalGroup);

    const baseGeo = new THREE.CylinderGeometry(2.2, 2.35, 0.08, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x050a1b,
      roughness: 0.2,
      metalness: 0.92,
    });
    pedestalGroup.add(new THREE.Mesh(baseGeo, baseMat));

    [
      { r: 2.3, c: 0x38bdf8, o: 0.3 },
      { r: 1.8, c: 0x6366f1, o: 0.35 },
      { r: 1.3, c: 0x818cf8, o: 0.4 },
    ].forEach((fr) => {
      const geo = new THREE.RingGeometry(fr.r - 0.015, fr.r, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: fr.c,
        transparent: true,
        opacity: fr.o,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.05;
      pedestalGroup.add(ring);
    });

    // ─────────────────────────────────────────────────────────────
    // 3. CENTRAL INTELLIGENCE HUB
    // ─────────────────────────────────────────────────────────────
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 0.2, 0);
    mainGroup.add(hubGroup);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0a1638,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.9,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    hubGroup.add(coreSphere);

    // Primary cage
    const cage1Geo = new THREE.IcosahedronGeometry(0.5, 1);
    const cage1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const cage1 = new THREE.Mesh(cage1Geo, cage1Mat);
    hubGroup.add(cage1);

    // Secondary cage
    const cage2Geo = new THREE.OctahedronGeometry(0.65, 0);
    const cage2Mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const cage2 = new THREE.Mesh(cage2Geo, cage2Mat);
    hubGroup.add(cage2);

    // Pulsing concentric shockwave rings from center
    const pulseRings = [];
    for (let i = 0; i < 3; i++) {
      const prGeo = new THREE.RingGeometry(0.1, 0.13, 48);
      const prMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const pr = new THREE.Mesh(prGeo, prMat);
      pr.rotation.x = Math.PI / 2;
      pr.position.y = 0.2;
      hubGroup.add(pr);
      pulseRings.push({ mesh: pr, phase: i * (Math.PI * 2 / 3) });
    }

    // ─────────────────────────────────────────────────────────────
    // 4. 7 CONSTELLATION FEATURE NODES
    // ─────────────────────────────────────────────────────────────
    const nodeData = [
      { label: 'Ask', color: 0x60a5fa, angleOffset: 0 },
      { label: 'Insights', color: 0xc084fc, angleOffset: Math.PI * 2 / 7 },
      { label: 'Compare', color: 0x22d3ee, angleOffset: Math.PI * 4 / 7 },
      { label: 'Notes', color: 0x818cf8, angleOffset: Math.PI * 6 / 7 },
      { label: 'Sections', color: 0x2dd4bf, angleOffset: Math.PI * 8 / 7 },
      { label: 'Cards', color: 0x38bdf8, angleOffset: Math.PI * 10 / 7 },
      { label: 'Docs', color: 0x34d399, angleOffset: Math.PI * 12 / 7 },
    ];

    const orbitRadius = 1.9;
    const nodeHeight = 0.35;

    const featureNodes = nodeData.map((nd) => {
      const group = new THREE.Group();

      // Node sphere
      const sphereGeo = new THREE.SphereGeometry(0.12, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: nd.color,
        emissive: nd.color,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.7,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Outer halo ring
      const haloGeo = new THREE.RingGeometry(0.16, 0.19, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nd.color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      group.add(halo);

      mainGroup.add(group);

      return { group, data: nd, sphere, halo };
    });

    // ─────────────────────────────────────────────────────────────
    // 5. NEURAL SYNAPTIC CONNECTIONS (HUB → EACH NODE)
    // ─────────────────────────────────────────────────────────────
    const connections = featureNodes.map((fn, idx) => {
      // Connection line
      const lineGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(6); // 2 points × 3
      lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: fn.data.color,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      mainGroup.add(line);

      // Traveling data packet
      const packetGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      mainGroup.add(packet);

      return { line, lineGeo, packet, progress: (idx * 0.14) % 1.0 };
    });

    // ─────────────────────────────────────────────────────────────
    // 6. CROSS-LINKS BETWEEN ADJACENT NODES (MESH NETWORK)
    // ─────────────────────────────────────────────────────────────
    const crossLinks = [];
    for (let i = 0; i < nodeData.length; i++) {
      const j = (i + 1) % nodeData.length;
      const clGeo = new THREE.BufferGeometry();
      const clPositions = new Float32Array(6);
      clGeo.setAttribute('position', new THREE.BufferAttribute(clPositions, 3));
      const clMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15,
      });
      const clLine = new THREE.Line(clGeo, clMat);
      mainGroup.add(clLine);
      crossLinks.push({ line: clLine, geo: clGeo, from: i, to: j });
    }

    // ─────────────────────────────────────────────────────────────
    // 7. AMBIENT PARTICLES
    // ─────────────────────────────────────────────────────────────
    const particleCount = 70;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pOriginals = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 5.5;
      const y = -0.4 + Math.random() * 2.2;
      const z = (Math.random() - 0.5) * 5.5;
      pPositions[i * 3] = x;
      pPositions[i * 3 + 1] = y;
      pPositions[i * 3 + 2] = z;
      pOriginals.push({ x, y, z, speed: 0.15 + Math.random() * 0.35 });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.022,
      transparent: true,
      opacity: 0.4,
    });
    mainGroup.add(new THREE.Points(pGeo, pMat));

    // ─────────────────────────────────────────────────────────────
    // 8. INTERACTION
    // ─────────────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let dragVelocity = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      mouseX = (cx / rect.width) * 2 - 1;
      mouseY = -(cy / rect.height) * 2 + 1;

      if (isDragging) {
        dragVelocity = (cx - prevPointerX) * 0.005;
        mainGroup.rotation.y += dragVelocity;
        prevPointerX = cx;
      }
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      prevPointerX = e.clientX - container.getBoundingClientRect().left;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // ─────────────────────────────────────────────────────────────
    // 9. ANIMATION LOOP
    // ─────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId;
    const hubPos = new THREE.Vector3(0, 0.2, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth idle rotation + inertia
      if (!isDragging) {
        dragVelocity *= 0.95;
        mainGroup.rotation.y += 0.0025 + dragVelocity;
      }

      // Camera parallax
      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (1.2 - mouseY * 0.18 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.1, 0);

      // Hub core animation
      cage1.rotation.x = t * 0.12;
      cage1.rotation.y = t * 0.18;
      cage2.rotation.x = -t * 0.1;
      cage2.rotation.z = t * 0.14;

      const corePulse = 1.0 + Math.sin(t * 0.8) * 0.03;
      coreSphere.scale.set(corePulse, corePulse, corePulse);

      // Pulsing shockwave rings expanding outward from center
      pulseRings.forEach((pr) => {
        const cycle = ((t * 0.4 + pr.phase) % (Math.PI * 2)) / (Math.PI * 2);
        const scale = 1.0 + cycle * 12;
        pr.mesh.scale.set(scale, scale, 1);
        pr.mesh.material.opacity = 0.5 * (1.0 - cycle);
      });

      // Position feature nodes in constellation orbit
      const nodePositions = [];
      featureNodes.forEach((fn, idx) => {
        const angle = fn.data.angleOffset + t * 0.08;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        const y = nodeHeight + Math.sin(t * 0.5 + idx * 0.9) * 0.06;

        fn.group.position.set(x, y, z);
        fn.halo.lookAt(camera.position);
        nodePositions.push(new THREE.Vector3(x, y, z));

        // Gentle halo breathing
        const haloScale = 1.0 + Math.sin(t * 0.7 + idx) * 0.08;
        fn.halo.scale.set(haloScale, haloScale, 1);
      });

      // Update connection lines & data packets
      connections.forEach((conn, idx) => {
        const nodePos = nodePositions[idx];

        // Update line endpoints
        const posAttr = conn.lineGeo.attributes.position;
        posAttr.array[0] = hubPos.x;
        posAttr.array[1] = hubPos.y;
        posAttr.array[2] = hubPos.z;
        posAttr.array[3] = nodePos.x;
        posAttr.array[4] = nodePos.y;
        posAttr.array[5] = nodePos.z;
        posAttr.needsUpdate = true;

        // Traveling data packet
        conn.progress = (conn.progress + 0.003) % 1.0;
        conn.packet.position.lerpVectors(hubPos, nodePos, conn.progress);
      });

      // Update cross-links between adjacent nodes
      crossLinks.forEach((cl) => {
        const fromPos = nodePositions[cl.from];
        const toPos = nodePositions[cl.to];
        const posAttr = cl.geo.attributes.position;
        posAttr.array[0] = fromPos.x;
        posAttr.array[1] = fromPos.y;
        posAttr.array[2] = fromPos.z;
        posAttr.array[3] = toPos.x;
        posAttr.array[4] = toPos.y;
        posAttr.array[5] = toPos.z;
        posAttr.needsUpdate = true;
      });

      // Subtle particle drift
      const pArr = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const orig = pOriginals[i];
        pArr[i * 3 + 1] = orig.y + Math.sin(t * orig.speed + i) * 0.03;
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ─────────────────────────────────────────────────────────────
    // RESIZE
    // ─────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click and drag to rotate"
    />
  );
}
