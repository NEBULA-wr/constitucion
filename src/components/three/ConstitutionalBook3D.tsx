import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { sound } from '../../utils/audioSystem';
import { BookOpen, RotateCcw, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface Props {
  className?: string;
  onExploreClick?: () => void;
}

export const ConstitutionalBook3D: React.FC<Props> = ({ className, onExploreClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // References for animation state
  const stateRef = useRef({
    isOpen: false,
    pageIndex: 0,
    openProgress: 0,
    targetOpen: 0,
    pageProgress: 0,
    targetPage: 0,
    rotX: 0.25,
    rotY: -0.35,
    targetRotX: 0.25,
    targetRotY: -0.35,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0
  });

  const pageTexts = [
    {
      leftTitle: "CONSTITUCIÓN DE LA REPÚBLICA DOMINICANA",
      leftSub: "Proclamada en San Cristóbal el 6 de Noviembre de 1844",
      leftBody: "«Nos, los Representantes del Pueblo Dominicano, reunidos en Soberana Convención Constituyente, invocando el nombre de Dios, Padre, Hijo y Espíritu Santo, Supremo Legislador del Universo... declaramos libre e independiente a la Nación Dominicana».",
      rightTitle: "ARTÍCULO 6 — SUPREMACÍA",
      rightSub: "Norma Suprema del Estado",
      rightBody: "«Todas las personas y los órganos que ejercen potestades públicas están sujetos a la Constitución, norma suprema y fundamento del ordenamiento jurídico del Estado. Son nulos de pleno derecho toda ley, decreto o acto contrarios a esta Constitución»."
    },
    {
      leftTitle: "ARTÍCULO 38 — DIGNIDAD HUMANA",
      leftSub: "Fundamento Sagrado",
      leftBody: "«El Estado se fundamenta en el respeto a la dignidad de la persona. La dignidad del ser humano es sagrada, innata e inviolable; su respeto y protección constituyen una responsabilidad esencial de todos los poderes públicos».",
      rightTitle: "ARTÍCULO 39 — IGUALDAD",
      rightSub: "Universalidad de Derechos",
      rightBody: "«Todas las personas nacen libres e iguales ante la ley, reciben la misma protección y trato de las instituciones, autoridades y demás personas y gozan de los mismos derechos, libertades y oportunidades, sin ninguna discriminación»."
    },
    {
      leftTitle: "ARTÍCULO 63 — EDUCACIÓN",
      leftSub: "Derecho Fundamental Universal",
      leftBody: "«Toda persona tiene derecho a una educación integral, de calidad, permanente, en igualdad de condiciones y oportunidades. La educación es obligatoria en los niveles inicial, básico y medio. En los establecimientos del Estado es gratuita».",
      rightTitle: "REFORMA 2024 — CLÁUSULA PÉTREA",
      rightSub: "Artículos 268 y 278",
      rightBody: "«Ningún funcionario electo popularmente podrá beneficiarse de una reforma constitucional durante su mandato para alterar las reglas de su propia reelección o permanencia. El modelo republicano civil y democrático es irrevocable»."
    }
  ];

  useEffect(() => {
    stateRef.current.isOpen = isOpen;
    stateRef.current.targetOpen = isOpen ? 1 : 0;
  }, [isOpen]);

  useEffect(() => {
    stateRef.current.pageIndex = pageIndex;
    stateRef.current.targetPage = pageIndex;
  }, [pageIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per threejs guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light, Fill Light, Rim Light
    const keyLight = new THREE.DirectionalLight(0xFFF0D5, 2.5);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x3B82F6, 0xCE1126, 0.7);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xE5A93C, 1.8);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Soft contact shadow plane beneath the book
    const shadowGeo = new THREE.PlaneGeometry(6, 4.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.35;
    scene.add(shadowMesh);

    // Procedural Cover Texture (Dominican navy leather + gilded coat of arms & title)
    function createCoverTexture(): THREE.CanvasTexture {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 1400;
      const ctx = c.getContext('2d')!;

      // Deep Dominican Navy leather texture
      ctx.fillStyle = '#001E47';
      ctx.fillRect(0, 0, 1024, 1400);

      // Leather grain noise
      for (let i = 0; i < 40000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1400;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.06)';
        ctx.fillRect(x, y, 2, 2);
      }

      // Ornate Gold Embossed Border
      ctx.strokeStyle = '#E5A93C';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, 944, 1320);

      ctx.strokeStyle = '#FFF0A0';
      ctx.lineWidth = 4;
      ctx.strokeRect(55, 55, 914, 1290);

      // Corner filigree ornaments
      const drawCorner = (cx: number, cy: number) => {
        ctx.fillStyle = '#E5A93C';
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
      };
      drawCorner(70, 70);
      drawCorner(954, 70);
      drawCorner(70, 1330);
      drawCorner(954, 1330);

      // Gold Title
      ctx.font = 'bold 54px Cinzel, serif';
      ctx.fillStyle = '#FCE29C';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 10;
      ctx.fillText('CONSTITUCIÓN', 512, 280);
      ctx.font = '600 36px Cinzel, serif';
      ctx.fillStyle = '#E5A93C';
      ctx.fillText('DE LA', 512, 335);
      ctx.font = 'bold 46px Cinzel, serif';
      ctx.fillStyle = '#FCE29C';
      ctx.fillText('REPÚBLICA DOMINICANA', 512, 395);

      // Central Dominican Escudo Nacional relief
      const cx = 512;
      const cy = 720;

      // Outer gold wreath
      ctx.strokeStyle = '#E5A93C';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 190, 0, Math.PI * 2);
      ctx.stroke();

      // Dominican Shield quarters
      const sw = 140;
      const sh = 170;
      // Top-left: Blue
      ctx.fillStyle = '#002F6C';
      ctx.fillRect(cx - sw, cy - sh, sw, sh);
      // Top-right: Red
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(cx, cy - sh, sw, sh);
      // Bottom-left: Red
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(cx - sw, cy, sw, sh);
      // Bottom-right: Blue
      ctx.fillStyle = '#002F6C';
      ctx.fillRect(cx, cy, sw, sh);

      // White cross of the Dominican flag
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx - 24, cy - sh, 48, sh * 2);
      ctx.fillRect(cx - sw, cy - 24, sw * 2, 48);

      // Center Bible & Cross
      ctx.fillStyle = '#FAF6EF';
      ctx.fillRect(cx - 30, cy - 25, 60, 50);
      ctx.strokeStyle = '#E5A93C';
      ctx.lineWidth = 4;
      ctx.strokeRect(cx - 30, cy - 25, 60, 50);

      // Golden cross above Bible
      ctx.strokeStyle = '#E5A93C';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 40);
      ctx.lineTo(cx, cy - 10);
      ctx.moveTo(cx - 15, cy - 28);
      ctx.lineTo(cx + 15, cy - 28);
      ctx.stroke();

      // Top Ribbon: DIOS, PATRIA, LIBERTAD
      ctx.fillStyle = '#002F6C';
      ctx.fillRect(cx - 160, cy - sh - 45, 320, 36);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('DIOS  ·  PATRIA  ·  LIBERTAD', cx, cy - sh - 20);

      // Bottom Ribbon: REPÚBLICA DOMINICANA
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(cx - 180, cy + sh + 15, 360, 36);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('REPÚBLICA DOMINICANA', cx, cy + sh + 40);

      // Subtitle at bottom
      ctx.font = 'italic 26px "Playfair Display", serif';
      ctx.fillStyle = '#FCE29C';
      ctx.fillText('«Cuna de la Libertad y los Derechos»', 512, 1220);
      ctx.font = 'bold 20px Cinzel, serif';
      ctx.fillStyle = '#E5A93C';
      ctx.fillText('1844 — 2024', 512, 1265);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    }

    // Procedural Open Pages Texture
    function createPageTexture(pageIdx: number): THREE.CanvasTexture {
      const c = document.createElement('canvas');
      c.width = 1600;
      c.height = 1100;
      const ctx = c.getContext('2d')!;

      // Parchment paper background
      ctx.fillStyle = '#F8F4EB';
      ctx.fillRect(0, 0, 1600, 1100);

      // Aged paper subtle stains & edge aging
      ctx.fillStyle = 'rgba(210, 180, 140, 0.12)';
      ctx.fillRect(0, 0, 1600, 1100);

      // Central spine shadow fold
      const spineGrad = ctx.createLinearGradient(740, 0, 860, 0);
      spineGrad.addColorStop(0, 'rgba(0,0,0,0)');
      spineGrad.addColorStop(0.5, 'rgba(0,0,0,0.35)');
      spineGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = spineGrad;
      ctx.fillRect(740, 0, 120, 1100);

      const pData = pageTexts[pageIdx % pageTexts.length];

      // LEFT PAGE
      ctx.textAlign = 'left';
      ctx.fillStyle = '#002F6C';
      ctx.font = 'bold 36px Cinzel, serif';
      ctx.fillText(pData.leftTitle, 90, 130);

      ctx.fillStyle = '#CE1126';
      ctx.font = '600 22px Inter, sans-serif';
      ctx.fillText(pData.leftSub, 90, 180);

      ctx.strokeStyle = '#E5A93C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(90, 205);
      ctx.lineTo(700, 205);
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.font = 'italic 26px "Playfair Display", serif';
      wrapText(ctx, pData.leftBody, 90, 270, 610, 42);

      // RIGHT PAGE
      ctx.fillStyle = '#002F6C';
      ctx.font = 'bold 36px Cinzel, serif';
      ctx.fillText(pData.rightTitle, 890, 130);

      ctx.fillStyle = '#CE1126';
      ctx.font = '600 22px Inter, sans-serif';
      ctx.fillText(pData.rightSub, 890, 180);

      ctx.strokeStyle = '#E5A93C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(890, 205);
      ctx.lineTo(1500, 205);
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.font = 'italic 26px "Playfair Display", serif';
      wrapText(ctx, pData.rightBody, 890, 270, 610, 42);

      // Page numbers
      ctx.font = 'bold 20px Cinzel, serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(`${(pageIdx + 1) * 2 - 1}`, 395, 1030);
      ctx.fillText(`${(pageIdx + 1) * 2}`, 1195, 1030);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    }

    function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
      const words = text.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    }

    // Book Group
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    // Book Dimensions
    const bW = 2.4;
    const bH = 3.2;
    const bThick = 0.45;

    // Materials
    const coverTex = createCoverTexture();
    const coverMat = new THREE.MeshPhysicalMaterial({
      map: coverTex,
      roughness: 0.35,
      metalness: 0.25,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2
    });

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xE5A93C,
      roughness: 0.2,
      metalness: 0.85,
      anisotropy: 0.6
    });

    const pagesEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xEAD8A8,
      roughness: 0.7,
      metalness: 0.1
    });

    // 1. Back Cover
    const backCoverGeo = new THREE.BoxGeometry(bW, bH, 0.04);
    const backCover = new THREE.Mesh(backCoverGeo, coverMat);
    backCover.position.set(0, 0, -bThick / 2);
    backCover.castShadow = !isSoftwareGl;
    bookGroup.add(backCover);

    // 2. Spine
    const spineGeo = new THREE.CylinderGeometry(bThick / 2, bThick / 2, bH, 16, 1, false, 0, Math.PI);
    const spineMat = new THREE.MeshPhysicalMaterial({
      color: 0x001E47,
      roughness: 0.3,
      metalness: 0.2
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.rotation.y = Math.PI / 2;
    spine.position.set(-bW / 2, 0, 0);
    bookGroup.add(spine);

    // 3. Pages Block (closed)
    const pagesGeo = new THREE.BoxGeometry(bW - 0.12, bH - 0.14, bThick - 0.06);
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesEdgeMat);
    pagesMesh.position.set(0.04, 0, 0);
    bookGroup.add(pagesMesh);

    // 4. Gold Corner Accents (4 corners)
    const cornerGeo = new THREE.BoxGeometry(0.3, 0.3, 0.05);
    const cornerOffsets = [
      [bW / 2 - 0.15, bH / 2 - 0.15],
      [bW / 2 - 0.15, -bH / 2 + 0.15],
      [-bW / 2 + 0.15, bH / 2 - 0.15],
      [-bW / 2 + 0.15, -bH / 2 + 0.15]
    ];
    cornerOffsets.forEach(([cx, cy]) => {
      const cMesh = new THREE.Mesh(cornerGeo, goldMat);
      cMesh.position.set(cx, cy, bThick / 2 + 0.01);
      bookGroup.add(cMesh);
    });

    // 5. Front Cover Pivot Group (for opening animation)
    const frontCoverPivot = new THREE.Group();
    frontCoverPivot.position.set(-bW / 2, 0, bThick / 2);
    bookGroup.add(frontCoverPivot);

    const frontCoverGeo = new THREE.BoxGeometry(bW, bH, 0.04);
    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, coverMat);
    frontCoverMesh.position.set(bW / 2, 0, 0);
    frontCoverMesh.castShadow = !isSoftwareGl;
    frontCoverPivot.add(frontCoverMesh);

    // 6. Open Book Display Group (revealed when open)
    const openBookGroup = new THREE.Group();
    openBookGroup.position.set(0, 0, 0.1);
    openBookGroup.scale.set(0.001, 0.001, 0.001); // invisible initially
    scene.add(openBookGroup);

    let activePageTex = createPageTexture(0);
    const openPageMat = new THREE.MeshStandardMaterial({
      map: activePageTex,
      roughness: 0.6,
      metalness: 0.05
    });

    // Double spread curved plane
    const openPagesGeo = new THREE.PlaneGeometry(bW * 2, bH, 32, 1);
    // Subtle curl on pages
    const pos = openPagesGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const curve = Math.sin((x / (bW * 2) + 0.5) * Math.PI) * 0.15;
      pos.setZ(i, curve);
    }
    openPagesGeo.computeVertexNormals();

    const openPagesMesh = new THREE.Mesh(openPagesGeo, openPageMat);
    openBookGroup.add(openPagesMesh);

    // Open book cover base
    const openCoverGeo = new THREE.PlaneGeometry(bW * 2 + 0.2, bH + 0.15);
    const openCoverMesh = new THREE.Mesh(openCoverGeo, coverMat);
    openCoverMesh.position.z = -0.06;
    openBookGroup.add(openCoverMesh);

    // Red Silk Ribbon Marker
    const ribbonGeo = new THREE.PlaneGeometry(0.12, bH * 1.15);
    const ribbonMat = new THREE.MeshPhysicalMaterial({
      color: 0xCE1126,
      roughness: 0.4,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.position.set(0.1, -0.2, 0.08);
    ribbonMesh.rotation.z = -0.08;
    openBookGroup.add(ribbonMesh);

    // Mouse interaction for orbit rotation
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const deltaX = e.clientX - stateRef.current.prevMouseX;
      const deltaY = e.clientY - stateRef.current.prevMouseY;
      stateRef.current.targetRotY += deltaX * 0.008;
      stateRef.current.targetRotX += deltaY * 0.008;
      stateRef.current.targetRotX = Math.max(-0.8, Math.min(0.8, stateRef.current.targetRotX));
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop with exponential damping
    let frameId: number = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const s = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (s === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth camera and rotation damping
      stateRef.current.rotX = THREE.MathUtils.damp(stateRef.current.rotX, stateRef.current.targetRotX, 8, dt);
      stateRef.current.rotY = THREE.MathUtils.damp(stateRef.current.rotY, stateRef.current.targetRotY, 8, dt);

      // Smooth opening angle
      stateRef.current.openProgress = THREE.MathUtils.damp(
        stateRef.current.openProgress,
        stateRef.current.targetOpen,
        5,
        dt
      );

      // Rotate book based on state
      const idleFloat = Math.sin(now * 0.0015) * 0.04;
      bookGroup.position.y = idleFloat;
      openBookGroup.position.y = idleFloat;

      if (stateRef.current.openProgress < 0.02) {
        // Book closed
        bookGroup.visible = true;
        openBookGroup.visible = false;
        bookGroup.rotation.x = stateRef.current.rotX;
        bookGroup.rotation.y = stateRef.current.rotY;
        frontCoverPivot.rotation.y = 0;
      } else if (stateRef.current.openProgress > 0.95) {
        // Book fully open
        bookGroup.visible = false;
        openBookGroup.visible = true;
        openBookGroup.scale.set(1, 1, 1);
        openBookGroup.rotation.x = stateRef.current.rotX;
        openBookGroup.rotation.y = stateRef.current.rotY;
      } else {
        // Transitioning
        bookGroup.visible = true;
        openBookGroup.visible = true;
        const p = stateRef.current.openProgress;
        frontCoverPivot.rotation.y = -p * (Math.PI * 0.95);
        openBookGroup.scale.set(p, p, p);
        bookGroup.rotation.x = stateRef.current.rotX;
        bookGroup.rotation.y = stateRef.current.rotY;
        openBookGroup.rotation.x = stateRef.current.rotX;
        openBookGroup.rotation.y = stateRef.current.rotY;
      }

      // Check if page texture needs update
      if (openPagesMesh.material) {
        const targetPage = stateRef.current.pageIndex;
        if (stateRef.current.pageProgress !== targetPage) {
          stateRef.current.pageProgress = targetPage;
          activePageTex.dispose();
          activePageTex = createPageTexture(targetPage);
          (openPagesMesh.material as THREE.MeshStandardMaterial).map = activePageTex;
          (openPagesMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      coverTex.dispose();
      activePageTex.dispose();
      shadowTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleToggleOpen = () => {
    sound.playPageFlip();
    setIsOpen(!isOpen);
  };

  const handleNextPage = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    sound.playPageFlip();
    setPageIndex((prev) => (prev + 1) % pageTexts.length);
  };

  const handlePrevPage = () => {
    sound.playPageFlip();
    setPageIndex((prev) => (prev - 1 + pageTexts.length) % pageTexts.length);
  };

  const handleResetView = () => {
    sound.playClick();
    stateRef.current.targetRotX = 0.25;
    stateRef.current.targetRotY = -0.35;
  };

  return (
    <div
      className={`relative w-full h-[520px] md:h-[600px] flex items-center justify-center select-none ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Arrastra para rotar la Constitución 3D en 360°"
      />

      {/* Floating Badge (Top-Left) */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 border border-[#E5A93C]/40 text-xs text-[#FCE29C] shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
        <span className="font-semibold tracking-wider uppercase font-cinzel">Carta Magna 3D Interactiva</span>
      </div>

      {/* Unified Bottom Control Dock (Consolidated, collapsible, as requested in Three.js skill) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-[640px] z-20 transition-all duration-300 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-40'
        }`}
      >
        <div className="flex items-center justify-between p-2.5 px-4 rounded-2xl bg-[#071120]/90 border border-[#E5A93C]/35 shadow-2xl backdrop-blur-md">
          {/* Main Action: Abrir/Cerrar */}
          <button
            onClick={handleToggleOpen}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md ${
              isOpen
                ? 'bg-[#CE1126] text-white hover:bg-red-700'
                : 'bg-gradient-to-r from-[#002F6C] to-[#004BB3] text-white hover:brightness-110 border border-blue-400/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isOpen ? 'Cerrar Libro' : 'Abrir Constitución'}</span>
          </button>

          {/* Page Navigation (visible when open) */}
          {isOpen && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevPage}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 text-xs"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-medium text-[#FCE29C] font-cinzel">
                Pág. {pageIndex + 1}/{pageTexts.length}
              </span>
              <button
                onClick={handleNextPage}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 text-xs"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Reset rotation and secondary actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetView}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-[#E5A93C] hover:bg-slate-700 transition"
              title="Restablecer vista 3D"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {onExploreClick && (
              <button
                onClick={() => {
                  sound.playClick();
                  onExploreClick();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A93C]/20 border border-[#E5A93C]/50 text-[#FCE29C] text-xs font-medium hover:bg-[#E5A93C]/30 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Explorar Artículos</span>
              </button>
            )}
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200"
              title={showControls ? 'Ocultar barra' : 'Mostrar barra'}
            >
              {showControls ? '▾' : '▴'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
