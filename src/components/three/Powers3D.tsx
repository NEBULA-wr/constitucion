import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { POWERS_OF_STATE, PowerOfTheState } from '../../data/constitutionData';
import { sound } from '../../utils/audioSystem';
import { useMedia } from '../../context/MediaContext';
import { Landmark, Scale, Building2, ShieldCheck, ChevronRight, Video, Layers, Sliders } from 'lucide-react';

interface Props {
  onSelectPower?: (power: PowerOfTheState) => void;
}

export const Powers3D: React.FC<Props> = ({ onSelectPower }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>('ejecutivo');
  const [activePower, setActivePower] = useState<PowerOfTheState>(POWERS_OF_STATE[0]);

  const stateRef = useRef({
    selectedId: 'ejecutivo',
    camTargetX: -3.5,
    camTargetY: 2.2,
    camTargetZ: 7.5,
    lookTargetX: -3.5,
    lookTargetY: 0.8,
    lookTargetZ: 0,
    currentCamX: 0,
    currentCamY: 4,
    currentCamZ: 10,
    currentLookX: 0,
    currentLookY: 0,
    currentLookZ: 0
  });

  const handleSelect = (power: PowerOfTheState) => {
    sound.playClick();
    setSelectedId(power.id);
    setActivePower(power);
    stateRef.current.selectedId = power.id;

    if (power.id === 'ejecutivo') {
      stateRef.current.camTargetX = -4.2;
      stateRef.current.camTargetY = 2.4;
      stateRef.current.camTargetZ = 6.2;
      stateRef.current.lookTargetX = -4.2;
      stateRef.current.lookTargetY = 0.8;
      stateRef.current.lookTargetZ = 0;
    } else if (power.id === 'legislativo') {
      stateRef.current.camTargetX = 0;
      stateRef.current.camTargetY = 2.6;
      stateRef.current.camTargetZ = 6.5;
      stateRef.current.lookTargetX = 0;
      stateRef.current.lookTargetY = 0.9;
      stateRef.current.lookTargetZ = 0;
    } else if (power.id === 'judicial') {
      stateRef.current.camTargetX = 4.2;
      stateRef.current.camTargetY = 2.4;
      stateRef.current.camTargetZ = 6.2;
      stateRef.current.lookTargetX = 4.2;
      stateRef.current.lookTargetY = 0.8;
      stateRef.current.lookTargetZ = 0;
    } else {
      // Tribunal Constitucional (center overview elevated)
      stateRef.current.camTargetX = 0;
      stateRef.current.camTargetY = 4.2;
      stateRef.current.camTargetZ = 8.5;
      stateRef.current.lookTargetX = 0;
      stateRef.current.lookTargetY = 0.5;
      stateRef.current.lookTargetZ = 0;
    }

    if (onSelectPower) {
      onSelectPower(power);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig
    const sunLight = new THREE.DirectionalLight(0xFFF4E0, 2.2);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = !isSoftwareGl;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x002F6C, 0xCE1126, 0.6);
    scene.add(hemiLight);

    // Dynamic spotlight for highlighted power
    const spotLight = new THREE.SpotLight(0xE5A93C, 3.5, 20, Math.PI / 4, 0.3);
    spotLight.position.set(0, 8, 4);
    scene.add(spotLight);

    // Base Travertine Marble Plaza (Plaza de los Poderes)
    const plazaGeo = new THREE.CylinderGeometry(8.5, 8.8, 0.4, 48);
    const marbleCanvas = document.createElement('canvas');
    marbleCanvas.width = 512;
    marbleCanvas.height = 512;
    const mCtx = marbleCanvas.getContext('2d')!;
    mCtx.fillStyle = '#E8E1D5';
    mCtx.fillRect(0, 0, 512, 512);
    // Concentric ceremonial rings & Dominican compass star
    mCtx.strokeStyle = 'rgba(229, 169, 60, 0.4)';
    mCtx.lineWidth = 4;
    mCtx.beginPath();
    mCtx.arc(256, 256, 200, 0, Math.PI * 2);
    mCtx.arc(256, 256, 120, 0, Math.PI * 2);
    mCtx.stroke();
    const marbleTex = new THREE.CanvasTexture(marbleCanvas);
    marbleTex.colorSpace = THREE.SRGBColorSpace;

    const plazaMat = new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.4,
      metalness: 0.1
    });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.position.y = -0.2;
    plazaMesh.receiveShadow = !isSoftwareGl;
    scene.add(plazaMesh);

    // Reusable Materials
    const marbleWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xF2ECE1,
      roughness: 0.3,
      metalness: 0.15
    });
    const domePatinaMat = new THREE.MeshPhysicalMaterial({
      color: 0x3FA89B, // Patina copper dome
      roughness: 0.45,
      metalness: 0.4
    });
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xE5A93C,
      roughness: 0.25,
      metalness: 0.8
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x3B82F6,
      transmission: isSoftwareGl ? 0 : 0.85,
      opacity: isSoftwareGl ? 0.4 : 1,
      transparent: true,
      roughness: 0.1
    });
    const drBlueMat = new THREE.MeshStandardMaterial({ color: 0x002F6C, roughness: 0.4 });
    const drRedMat = new THREE.MeshStandardMaterial({ color: 0xCE1126, roughness: 0.4 });

    // MODEL 1: PALACIO NACIONAL (Poder Ejecutivo - Left)
    const palacioGroup = new THREE.Group();
    palacioGroup.position.set(-4.2, 0, 0);
    scene.add(palacioGroup);

    // Main base and steps
    const palBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.3, 1.8), marbleWhiteMat);
    palBase.position.y = 0.15;
    palBase.castShadow = !isSoftwareGl;
    palacioGroup.add(palBase);

    // Main Building block
    const palBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.4), marbleWhiteMat);
    palBody.position.y = 0.7;
    palBody.castShadow = !isSoftwareGl;
    palacioGroup.add(palBody);

    // Portico & Columns (6 columns)
    for (let c = -0.7; c <= 0.7; c += 0.28) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.65, 12), marbleWhiteMat);
      col.position.set(c, 0.65, 0.8);
      palacioGroup.add(col);
    }

    // Triangular Pediment
    const pedimentShape = new THREE.Shape();
    pedimentShape.moveTo(-0.8, 0);
    pedimentShape.lineTo(0.8, 0);
    pedimentShape.lineTo(0, 0.45);
    pedimentShape.closePath();
    const pedGeo = new THREE.ExtrudeGeometry(pedimentShape, { depth: 0.2, bevelEnabled: false });
    const pedMesh = new THREE.Mesh(pedGeo, marbleWhiteMat);
    pedMesh.position.set(0, 0.98, 0.7);
    palacioGroup.add(pedMesh);

    // Rotunda Drum & Neoclassical Dome
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.4, 24), marbleWhiteMat);
    drum.position.y = 1.3;
    palacioGroup.add(drum);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), domePatinaMat);
    dome.position.y = 1.5;
    palacioGroup.add(dome);

    // Gold Finial Flagstaff on top of dome
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), goldMat);
    staff.position.y = 2.15;
    palacioGroup.add(staff);

    // MODEL 2: CONGRESO NACIONAL (Poder Legislativo - Center)
    const congresoGroup = new THREE.Group();
    congresoGroup.position.set(0, 0, 0);
    scene.add(congresoGroup);

    // Base podium
    const congBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 1.8), marbleWhiteMat);
    congBase.position.y = 0.15;
    congresoGroup.add(congBase);

    // Bicameral Wings (Senado on left, Diputados on right)
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.3), drBlueMat);
    leftWing.position.set(-0.95, 0.75, 0);
    congresoGroup.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.3), drRedMat);
    rightWing.position.set(0.95, 0.75, 0);
    congresoGroup.add(rightWing);

    // Central Glass Assembly Atrium
    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 24), glassMat);
    atrium.position.set(0, 0.85, 0);
    congresoGroup.add(atrium);

    // Gold Seal Canopy
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 24), goldMat);
    canopy.position.set(0, 1.45, 0);
    congresoGroup.add(canopy);

    // MODEL 3: TRIBUNAL & SUPREMA CORTE (Poder Judicial - Right)
    const judicialGroup = new THREE.Group();
    judicialGroup.position.set(4.2, 0, 0);
    scene.add(judicialGroup);

    // Stepped classical base
    const judBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.35, 1.8), marbleWhiteMat);
    judBase.position.y = 0.17;
    judicialGroup.add(judBase);

    // Colonnade Temple
    const judTemple = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.3), marbleWhiteMat);
    judTemple.position.y = 0.75;
    judicialGroup.add(judTemple);

    // Classical Columns
    for (let c = -0.8; c <= 0.8; c += 0.4) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.75, 12), marbleWhiteMat);
      col.position.set(c, 0.75, 0.75);
      judicialGroup.add(col);
    }

    // Entablature and Pediment
    const judPediment = new THREE.Mesh(pedGeo, marbleWhiteMat);
    judPediment.position.set(0, 1.15, 0.65);
    judicialGroup.add(judPediment);

    // Gold Scales of Justice in center
    const scalePole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), goldMat);
    scalePole.position.set(0, 1.7, 0.7);
    judicialGroup.add(scalePole);

    const scaleBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), goldMat);
    scaleBeam.rotation.z = Math.PI / 2;
    scaleBeam.position.set(0, 1.95, 0.7);
    judicialGroup.add(scaleBeam);

    // Left and right scale pans
    const panGeo = new THREE.ConeGeometry(0.08, 0.04, 12);
    const leftPan = new THREE.Mesh(panGeo, goldMat);
    leftPan.position.set(-0.2, 1.82, 0.7);
    leftPan.rotation.x = Math.PI;
    judicialGroup.add(leftPan);

    const rightPan = new THREE.Mesh(panGeo, goldMat);
    rightPan.position.set(0.2, 1.82, 0.7);
    rightPan.rotation.x = Math.PI;
    judicialGroup.add(rightPan);

    // Animation Loop
    let frameId = 0;
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

      // Camera smooth glide
      stateRef.current.currentCamX = THREE.MathUtils.damp(stateRef.current.currentCamX, stateRef.current.camTargetX, 4, dt);
      stateRef.current.currentCamY = THREE.MathUtils.damp(stateRef.current.currentCamY, stateRef.current.camTargetY, 4, dt);
      stateRef.current.currentCamZ = THREE.MathUtils.damp(stateRef.current.currentCamZ, stateRef.current.camTargetZ, 4, dt);

      stateRef.current.currentLookX = THREE.MathUtils.damp(stateRef.current.currentLookX, stateRef.current.lookTargetX, 4, dt);
      stateRef.current.currentLookY = THREE.MathUtils.damp(stateRef.current.currentLookY, stateRef.current.lookTargetY, 4, dt);
      stateRef.current.currentLookZ = THREE.MathUtils.damp(stateRef.current.currentLookZ, stateRef.current.lookTargetZ, 4, dt);

      camera.position.set(
        stateRef.current.currentCamX,
        stateRef.current.currentCamY,
        stateRef.current.currentCamZ
      );
      camera.lookAt(
        stateRef.current.currentLookX,
        stateRef.current.currentLookY,
        stateRef.current.currentLookZ
      );

      // Spotlight aim towards selected target
      spotLight.target.position.set(
        stateRef.current.lookTargetX,
        stateRef.current.lookTargetY,
        stateRef.current.lookTargetZ
      );
      spotLight.target.updateMatrixWorld();

      // Subtle atmospheric hover animation
      const hover = Math.sin(now * 0.002) * 0.05;
      if (stateRef.current.selectedId === 'ejecutivo') {
        palacioGroup.position.y = hover;
        congresoGroup.position.y = 0;
        judicialGroup.position.y = 0;
      } else if (stateRef.current.selectedId === 'legislativo') {
        congresoGroup.position.y = hover;
        palacioGroup.position.y = 0;
        judicialGroup.position.y = 0;
      } else if (stateRef.current.selectedId === 'judicial') {
        judicialGroup.position.y = hover;
        palacioGroup.position.y = 0;
        congresoGroup.position.y = 0;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

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
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      marbleTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const { manifest, getMediaForSection } = useMedia();
  const { item: assignedPowersItem } = getMediaForSection('powers');
  const maquetaVideo =
    manifest.media.find(
      (m) =>
        m.type === 'video' &&
        (m.filename === '2.mp4' ||
          m.id === 'vid-2' ||
          m.category === 'powers' ||
          m.title.toLowerCase().includes('maqueta') ||
          m.title.toLowerCase().includes('palacio'))
    ) ||
    assignedPowersItem || {
      id: 'vid-2',
      type: 'video',
      title: 'Video 2 — Palacio Nacional y Maqueta 3D',
      filename: '2.mp4',
      path: '/2.mp4'
    };

  const [viewMode, setViewMode] = useState<'both' | 'video' | '3d'>('both');

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#030712] via-[#071328] to-[#030712] border border-[#E5A93C]/30 shadow-2xl">
      {/* Top Header / Title */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 z-10 relative bg-black/40 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#E5A93C] uppercase mb-1 font-cinzel">
            <Landmark className="w-4 h-4" />
            <span>Arquitectura Institucional Dominicana</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-cinzel tracking-tight">
            Los Tres Poderes del Estado & El Tribunal Constitucional
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl font-light">
            Explora en 3D la división republicana y el sistema de frenos y contrapesos consagrado en la Constitución Dominicana.
          </p>
        </div>

        {/* Video Mode and Tab Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Mode Switcher */}
          {maquetaVideo && (
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/15 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-2" />
              <span className="text-[11px] text-[#FCE29C] font-semibold hidden lg:inline mr-1">
                Fondo Maqueta 3D
              </span>
              <button
                onClick={() => setViewMode('both')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  viewMode === 'both'
                    ? 'bg-[#002F6C] text-white border border-[#E5A93C]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Ver modelos 3D flotando sobre el video cinematográfico"
              >
                3D + Video
              </button>
              <button
                onClick={() => setViewMode('video')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  viewMode === 'video'
                    ? 'bg-[#002F6C] text-white border border-[#E5A93C]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Ver video cinematográfico de las sedes republicanas"
              >
                Solo Video
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  viewMode === '3d'
                    ? 'bg-[#002F6C] text-white border border-[#E5A93C]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Ver maqueta 3D PBR pura"
              >
                Solo 3D
              </button>
            </div>
          )}

          {/* Tab selection buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {POWERS_OF_STATE.map((power) => (
              <button
                key={power.id}
                onClick={() => handleSelect(power)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center gap-2 ${
                  selectedId === power.id
                    ? 'bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white border-[#E5A93C] shadow-lg scale-105'
                    : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-[#E5A93C]/50 hover:text-white'
                }`}
              >
                {power.id === 'ejecutivo' && <Building2 className="w-3.5 h-3.5 text-blue-400" />}
                {power.id === 'legislativo' && <Landmark className="w-3.5 h-3.5 text-red-400" />}
                {power.id === 'judicial' && <Scale className="w-3.5 h-3.5 text-amber-400" />}
                {power.id === 'tribunal-constitucional' && <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />}
                <span>{power.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Scene Viewport with Integrated Video Background */}
      <div className="relative w-full h-[440px] md:h-[520px] overflow-hidden">
        {/* Real Playing Video of the 3D Maqueta */}
        {maquetaVideo && maquetaVideo.path && viewMode !== '3d' && (
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <video
              src={maquetaVideo.path}
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                viewMode === 'video' ? 'opacity-90' : 'opacity-40'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/80" />
            <div className="absolute top-4 left-6 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Reproduciendo video de fondo: {maquetaVideo.title}</span>
            </div>
          </div>
        )}

        {/* Three.js Interactive Canvas Container */}
        <div
          ref={mountRef}
          className={`w-full h-full cursor-pointer relative z-10 transition-opacity duration-500 ${
            viewMode === 'video' ? 'opacity-25 hover:opacity-100' : 'opacity-100'
          }`}
        />

        {/* Bottom Floating Card with Active Power Details (Collapsible & unobstructed) */}
        <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-20">
          <div className="p-5 rounded-2xl bg-[#050C1B]/90 border border-[#E5A93C]/40 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-blue-950/80 text-[#FCE29C] border border-[#E5A93C]/30 font-cinzel">
                {activePower.constitutionArticles}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {activePower.seat}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-cinzel">
              {activePower.name}
            </h3>
            <p className="text-xs font-semibold text-[#E5A93C] mt-0.5">
              Titular: {activePower.leaderTitle}
            </p>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-200">
              {activePower.functions.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#CE1126] font-bold mt-0.5">▸</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-amber-200/90 flex items-start gap-2 bg-amber-950/30 p-2 rounded-lg">
              <span className="font-bold text-[#E5A93C]">Frenos y Contrapesos:</span>
              <span>{activePower.checksAndBalances}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
