import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 3D Open Cyber Codex & Document Knowledge Scanner
 * - True 3D Procedural Open Book / Document Tome (Zero raster images)
 * - Two angled 3D frosted document wings with crisp rendered typography
 * - Smooth vertical scanning laser plane simulating real-time document AI ingestion
 * - Floating 3D note bookmark tags and structured neural connection threads
 * - Calm, elegant, intellectual physics (Zero disco lights)
 */
export default function KnowledgeCoreScene({
  activeNode = 0,
  className = 'w-full h-full',
}) {
  const mountRef = useRef(null);
  const activeNodeRef = useRef(activeNode);

  useEffect(() => {
    activeNodeRef.current = activeNode;
  }, [activeNode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─────────────────────────────────────────────────────────────
    // 1. THREE.JS SCENE & CAMERA
    // ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    let width = container.clientWidth || 1200;
    let height = container.clientHeight || 750;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ─────────────────────────────────────────────────────────────
    // 2. ELEGANT EDITORIAL LIGHTING
    // ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0a1638, 4.0);
    scene.add(ambientLight);

    const topSunLight = new THREE.DirectionalLight(0xdbeafe, 2.5);
    topSunLight.position.set(1, 4, 3);
    scene.add(topSunLight);

    const softCyanPoint = new THREE.PointLight(0x38bdf8, 4.0, 10);
    softCyanPoint.position.set(0, 0.8, 1.8);
    scene.add(softCyanPoint);

    const softPurplePoint = new THREE.PointLight(0x818cf8, 3.0, 9);
    softPurplePoint.position.set(-2, -1, 1.2);
    scene.add(softPurplePoint);

    // ─────────────────────────────────────────────────────────────
    // 3. GROUNDED 3D PEDESTAL RINGS
    // ─────────────────────────────────────────────────────────────
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -1.35;
    mainGroup.add(pedestalGroup);

    const pedestalRings = [
      { radius: 2.2, color: 0x38bdf8, opacity: 0.3 },
      { radius: 1.7, color: 0x818cf8, opacity: 0.4 },
      { radius: 1.2, color: 0x0ea5e9, opacity: 0.5 },
    ];

    pedestalRings.forEach((pr) => {
      const ringGeo = new THREE.RingGeometry(pr.radius - 0.02, pr.radius, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pr.color,
        transparent: true,
        opacity: pr.opacity,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      pedestalGroup.add(ring);
    });

    // ─────────────────────────────────────────────────────────────
    // 4. CANVAS TEXTURE GENERATOR FOR HIGH-RES 3D CODEX PAGES
    // ─────────────────────────────────────────────────────────────
    const createPageTexture = (isLeftPage = true) => {
      const cvs = document.createElement('canvas');
      cvs.width = 600;
      cvs.height = 760;
      const ctx = cvs.getContext('2d');

      // Frosted Glass Paper Background
      ctx.fillStyle = 'rgba(8, 16, 42, 0.95)';
      ctx.fillRect(0, 0, 600, 760);

      // Outer Paper Margin Border
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 4;
      ctx.strokeRect(6, 6, 588, 748);

      if (isLeftPage) {
        // Top Header
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fillRect(20, 20, 560, 52);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.fillText('Design Patterns & Software Architecture.pdf', 36, 54);

        // Section Tag
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('CHAPTER 3 — CREATIONAL PATTERNS', 36, 110);

        // Simulated Text Lines
        for (let i = 0; i < 11; i++) {
          const y = 145 + i * 44;
          if (i === 2) {
            // Highlighted Important Clause
            ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
            ctx.fillRect(36, y - 18, 528, 28);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '600 16px system-ui, sans-serif';
            ctx.fillText('► § 4.1 Factory Method defines interface for object creation.', 44, y + 2);
          } else if (i === 6) {
            // Highlighted Potential Risk
            ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
            ctx.fillRect(36, y - 18, 528, 28);
            ctx.fillStyle = '#f43f5e';
            ctx.font = '600 16px system-ui, sans-serif';
            ctx.fillText('► Critical Risk: Memory allocation overhead in tight loops.', 44, y + 2);
          } else {
            ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
            ctx.fillRect(36, y - 6, i % 2 === 0 ? 510 : 420, 8);
          }
        }

        // Page Number
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('DocuMind Source Verified • Page 89', 36, 720);
      } else {
        // Right Page: AI Extracted Knowledge Synthesis
        ctx.fillStyle = 'rgba(129, 140, 248, 0.15)';
        ctx.fillRect(20, 20, 560, 52);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.fillText('AI Knowledge Connectome & Key Insights', 36, 54);

        // Synthesis Badge
        ctx.fillStyle = 'rgba(129, 140, 248, 0.9)';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('STRUCTURED SYNTHESIS MATRIX', 36, 110);

        // 4 Insight Summary Pods
        const pods = [
          { title: '8 Important Clauses', desc: 'Warranties, liabilities, and termination rules extracted.', color: '#38bdf8' },
          { title: '5 Organizations', desc: 'Named entities linked to authors and publishers.', color: '#60a5fa' },
          { title: '1 Critical Risk Flag', desc: 'Unbounded cache growth under concurrent write loads.', color: '#f43f5e' },
          { title: 'Executive Summary', desc: '23 standardized patterns categorized across 3 domains.', color: '#c084fc' },
        ];

        pods.forEach((p, idx) => {
          const y = 145 + idx * 125;
          ctx.fillStyle = 'rgba(15, 23, 52, 0.85)';
          ctx.fillRect(36, y, 528, 100);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 2;
          ctx.strokeRect(36, y, 528, 100);

          ctx.fillStyle = p.color;
          ctx.font = 'bold 16px system-ui, sans-serif';
          ctx.fillText(p.title, 52, y + 34);

          ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
          ctx.font = '14px system-ui, sans-serif';
          ctx.fillText(p.desc, 52, y + 68);
        });

        // Page Number
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('DocuMind Knowledge Layer • v2.4', 36, 720);
      }

      const tex = new THREE.CanvasTexture(cvs);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    // ─────────────────────────────────────────────────────────────
    // 5. CENTRAL 3D OPEN CYBER CODEX / BOOK MESHES
    // ─────────────────────────────────────────────────────────────
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, 0.05, 0);
    mainGroup.add(bookGroup);

    // Left Page Wing (Angled)
    const leftPageGeo = new THREE.PlaneGeometry(1.55, 1.95);
    const leftPageMat = new THREE.MeshStandardMaterial({
      map: createPageTexture(true),
      transparent: true,
      opacity: 0.94,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const leftPage = new THREE.Mesh(leftPageGeo, leftPageMat);
    leftPage.position.set(-0.78, 0, 0.12);
    leftPage.rotation.y = 0.28;
    bookGroup.add(leftPage);

    // Right Page Wing (Angled)
    const rightPageGeo = new THREE.PlaneGeometry(1.55, 1.95);
    const rightPageMat = new THREE.MeshStandardMaterial({
      map: createPageTexture(false),
      transparent: true,
      opacity: 0.94,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const rightPage = new THREE.Mesh(rightPageGeo, rightPageMat);
    rightPage.position.set(0.78, 0, 0.12);
    rightPage.rotation.y = -0.28;
    bookGroup.add(rightPage);

    // Glowing Central Spine Rod
    const spineGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 16);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0, -0.05);
    bookGroup.add(spine);

    // ─────────────────────────────────────────────────────────────
    // 6. HOLOGRAPHIC DOCUMENT SCANNING LIGHT BEAM
    // ─────────────────────────────────────────────────────────────
    const scanGroup = new THREE.Group();
    bookGroup.add(scanGroup);

    // Horizontal scanning light line
    const scanLineGeo = new THREE.CylinderGeometry(0.015, 0.015, 3.2, 16);
    const scanLineMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const scanLine = new THREE.Mesh(scanLineGeo, scanLineMat);
    scanLine.rotation.z = Math.PI / 2;
    scanLine.position.set(0, 0.8, 0.22);
    scanGroup.add(scanLine);

    // Soft scan light flare plane
    const flareGeo = new THREE.PlaneGeometry(3.2, 0.18);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const flarePlane = new THREE.Mesh(flareGeo, flareMat);
    flarePlane.position.set(0, 0.8, 0.22);
    scanGroup.add(flarePlane);

    // ─────────────────────────────────────────────────────────────
    // 7. CLEAN NEURAL CONNECTIVITY THREADS TO LEFT/RIGHT CARDS
    // ─────────────────────────────────────────────────────────────
    const threadGroup = new THREE.Group();
    mainGroup.add(threadGroup);

    const targetCoords = [
      // Left 4 nodes
      { id: 0, x: -2.35, y: 0.8, color: 0x38bdf8 },
      { id: 1, x: -2.45, y: 0.28, color: 0x60a5fa },
      { id: 2, x: -2.45, y: -0.28, color: 0xf43f5e },
      { id: 3, x: -2.35, y: -0.8, color: 0xc084fc },
      // Right 4 nodes
      { id: 4, x: 2.35, y: 0.8, color: 0x22d3ee },
      { id: 5, x: 2.45, y: 0.28, color: 0x38bdf8 },
      { id: 6, x: 2.45, y: -0.28, color: 0xa855f7 },
      { id: 7, x: 2.35, y: -0.8, color: 0x818cf8 },
    ];

    const threads = targetCoords.map((tc, idx) => {
      const startX = tc.x > 0 ? 1.4 : -1.4;
      const start = new THREE.Vector3(startX, tc.y * 0.5, 0.1);
      const end = new THREE.Vector3(tc.x, tc.y, 0.0);

      const points = [start, end];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: tc.color,
        transparent: true,
        opacity: 0.25,
        linewidth: 1.2,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      threadGroup.add(line);

      // Clean citation pin
      const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: tc.color });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(end);
      threadGroup.add(pin);

      // Traveling pulse dot
      const dotGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      threadGroup.add(dot);

      return { line, pin, dot, start, end, progress: (idx * 0.125) % 1.0 };
    });

    // ─────────────────────────────────────────────────────────────
    // 8. CALM AMBIENT STAR DUST
    // ─────────────────────────────────────────────────────────────
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleOriginals = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 6.5;
      const y = (Math.random() - 0.5) * 3.5;
      const z = (Math.random() - 0.5) * 2.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      particleOriginals.push({ x, y, z, speed: 0.2 + Math.random() * 0.4 });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.022,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.4,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // ─────────────────────────────────────────────────────────────
    // 9. SMOOTH MOUSE PARALLAX
    // ─────────────────────────────────────────────────────────────
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.18;
      targetRotX = -y * 0.12;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // ─────────────────────────────────────────────────────────────
    // 10. ANIMATION LOOP (CALM, EDITORIAL SPEED)
    // ─────────────────────────────────────────────────────────────
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Damped parallax
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      mainGroup.rotation.x = currentRotX;
      mainGroup.rotation.y = currentRotY;

      // Gentle floating motion of 3D Book
      bookGroup.position.y = 0.05 + Math.sin(elapsedTime * 0.6) * 0.04;
      bookGroup.rotation.y = Math.sin(elapsedTime * 0.35) * 0.02;

      // Smooth vertical scanning laser beam motion (Top to Bottom)
      const scanY = 0.78 * Math.cos(elapsedTime * 0.9);
      scanLine.position.y = scanY;
      flarePlane.position.y = scanY;

      // Animate Citation Threads
      const activeIdx = activeNodeRef.current;
      threads.forEach((th, idx) => {
        const isActive = idx === activeIdx;

        th.line.material.opacity = isActive ? 0.85 : 0.2;
        th.pin.scale.setScalar(isActive ? 1.4 : 1.0);

        th.progress = (th.progress + (isActive ? 0.005 : 0.002)) % 1.0;
        th.dot.position.lerpVectors(th.start, th.end, th.progress);
        th.dot.scale.setScalar(isActive ? 1.3 : 0.8);
      });

      // Subtle particle float
      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const orig = particleOriginals[i];
        posArr[i * 3 + 1] = orig.y + Math.sin(elapsedTime * orig.speed + i) * 0.03;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ─────────────────────────────────────────────────────────────
    // RESIZE OBSERVER
    // ─────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 1200;
      height = container.clientHeight || 750;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
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
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
    />
  );
}
