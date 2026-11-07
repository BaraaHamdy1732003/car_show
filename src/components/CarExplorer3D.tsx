import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Car, ComponentHotspot } from '../types/car';
import {
  RotateCcw,
  Wind,
  Maximize2,
  Minimize2,
  Volume2,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CarExplorer3DProps {
  car: Car;
  onClose: () => void;
  onOpenDetails: (car: Car) => void;
  onOpenRevModal: (car: Car) => void;
}

export const CarExplorer3D: React.FC<CarExplorer3DProps> = ({
  car,
  onClose,
  onOpenDetails,
  onOpenRevModal,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<'exterior' | 'interior'>('exterior');
  const [selectedColor, setSelectedColor] = useState<string>(
    car.equipment.exteriorColors[0]?.hex || '#D50000'
  );
  const [selectedHotspot, setSelectedHotspot] = useState<ComponentHotspot | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [showWindTunnel, setShowWindTunnel] = useState<boolean>(false);
  const [selectedBg, setSelectedBg] = useState<'exhibition' | 'dark' | 'cyber'>('exhibition');
  const [cameraPreset, setCameraPreset] = useState<string>('perspective');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [interiorAmbientColor, setInteriorAmbientColor] = useState<string>('#D50000');
  const [interiorSelectedHotspot, setInteriorSelectedHotspot] = useState<string | null>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const paintMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const windStreamlinesRef = useRef<THREE.LineSegments | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationTargetRef = useRef<{ x: number; y: number }>({ x: 0.25, y: -0.6 });
  const zoomRef = useRef<number>(6.2);

  // Setup Three.js scene
  useEffect(() => {
    if (!mountRef.current || activeMode !== 'exterior') return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(selectedBg === 'cyber' ? 0x050811 : 0x080808);
    scene.fog = new THREE.FogExp2(0x080808, 0.045);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 2.2, 5.0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (Exhibition Hall Spotlights matching photo)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Main Overhead Spotlight (shining straight down on car & red carpet)
    const mainSpotlight = new THREE.SpotLight(0xffffff, 4.5);
    mainSpotlight.position.set(0, 7.5, 0);
    mainSpotlight.angle = Math.PI / 4.2;
    mainSpotlight.penumbra = 0.6;
    mainSpotlight.castShadow = true;
    mainSpotlight.shadow.mapSize.width = 1024;
    mainSpotlight.shadow.mapSize.height = 1024;
    scene.add(mainSpotlight);

    // Red Rim Light from perimeter (matching exhibition photo wall pillars)
    const redRimLight = new THREE.DirectionalLight(0xd50000, 2.2);
    redRimLight.position.set(-6, 2.5, -5);
    scene.add(redRimLight);

    // Warm Front Key Light
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.8);
    keyLight.position.set(5, 4, 5);
    scene.add(keyLight);

    // Underbody Soft Reflection Light
    const floorBounce = new THREE.DirectionalLight(0xd50000, 0.6);
    floorBounce.position.set(0, -2, 0);
    scene.add(floorBounce);

    // 5. Floor & Red Carpet Podium (Directly inspired by user photo!)
    const floorGeo = new THREE.PlaneGeometry(35, 35);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.22,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.72;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid markings on floor
    const gridHelper = new THREE.GridHelper(26, 26, 0x333333, 0x161616);
    gridHelper.position.y = -0.715;
    scene.add(gridHelper);

    // Vibrant Red Carpet Runner Podium beneath car
    const carpetGeo = new THREE.BoxGeometry(3.2, 0.04, 6.4);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0xd50000,
      roughness: 0.7,
      metalness: 0.05,
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.position.set(0, -0.7, 0);
    carpet.receiveShadow = true;
    scene.add(carpet);

    // Gold/White edge trim on carpet
    const carpetBorderGeo = new THREE.BoxGeometry(3.28, 0.02, 6.48);
    const carpetBorderMat = new THREE.MeshStandardMaterial({
      color: 0xffd600,
      roughness: 0.3,
      metalness: 0.8,
    });
    const carpetBorder = new THREE.Mesh(carpetBorderGeo, carpetBorderMat);
    carpetBorder.position.set(0, -0.71, 0);
    scene.add(carpetBorder);

    // 6. Detailed Procedural 3D Car Geometry
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    paintMaterialsRef.current = [];

    // Metallic Car Paint Material
    const carPaintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedColor),
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });
    paintMaterialsRef.current.push(carPaintMat);

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.45,
      metalness: 0.6,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.8,
      transparent: true,
      opacity: 0.75,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.95,
      roughness: 0.1,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.85,
      metalness: 0.1,
    });

    const brakeDiscMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.9,
      roughness: 0.2,
    });

    const brakeCaliperMat = new THREE.MeshStandardMaterial({
      color: 0xd50000,
      metalness: 0.7,
      roughness: 0.25,
    });

    // --- CAR BODY SECTIONS ---
    // A. Main Sleek Aerodynamic Lower Fuselage / Chassis
    const chassisGeo = new THREE.BoxGeometry(1.82, 0.42, 4.4);
    const chassis = new THREE.Mesh(chassisGeo, carPaintMat);
    chassis.position.y = -0.15;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    carGroup.add(chassis);

    // B. Aerodynamic Sloping Front Nose
    const noseGeo = new THREE.ConeGeometry(0.92, 1.2, 4);
    const nose = new THREE.Mesh(noseGeo, carPaintMat);
    nose.rotation.x = Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    nose.scale.set(1.0, 0.35, 1.2);
    nose.position.set(0, -0.18, 2.3);
    nose.castShadow = true;
    carGroup.add(nose);

    // C. Cockpit Canopy / Greenhouse (Curved low roofline)
    const cabinGeo = new THREE.CylinderGeometry(0.68, 0.82, 1.9, 16);
    cabinGeo.scale(1.0, 0.42, 1.0);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 0.28, -0.1);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Center Panel
    const roofPanelGeo = new THREE.BoxGeometry(1.15, 0.08, 1.4);
    const roofPanel = new THREE.Mesh(roofPanelGeo, carbonMat);
    roofPanel.position.set(0, 0.38, -0.1);
    carGroup.add(roofPanel);

    // D. Front Aerodynamic Splitter
    const splitterGeo = new THREE.BoxGeometry(1.94, 0.06, 0.65);
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(0, -0.38, 2.35);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // E. Side Aerodynamic Skirts
    const sideSkirtLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 2.5), carbonMat);
    sideSkirtLeft.position.set(0.96, -0.36, 0);
    carGroup.add(sideSkirtLeft);

    const sideSkirtRight = sideSkirtLeft.clone();
    sideSkirtRight.position.set(-0.96, -0.36, 0);
    carGroup.add(sideSkirtRight);

    // F. Rear Aerodynamic Diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.86, 0.18, 0.7);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
    diffuser.position.set(0, -0.28, -2.25);
    diffuser.castShadow = true;
    carGroup.add(diffuser);

    // Vertical diffuser fins
    for (let f = -0.6; f <= 0.6; f += 0.4) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.6), carbonMat);
      fin.position.set(f, -0.28, -2.25);
      carGroup.add(fin);
    }

    // G. Active Rear Wing / Spoiler
    const wingGeo = new THREE.BoxGeometry(1.95, 0.05, 0.42);
    const wing = new THREE.Mesh(wingGeo, carbonMat);
    wing.position.set(0, 0.52, -2.05);
    wing.castShadow = true;
    carGroup.add(wing);

    // Wing Stalks
    const stalkLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), chromeMat);
    stalkLeft.position.set(0.48, 0.32, -2.05);
    carGroup.add(stalkLeft);
    const stalkRight = stalkLeft.clone();
    stalkRight.position.set(-0.48, 0.32, -2.05);
    carGroup.add(stalkRight);

    // H. Quad Titanium Exhaust Tips
    for (let e = -0.24; e <= 0.24; e += 0.16) {
      const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.25, 12), chromeMat);
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(e, 0.02, -2.28);
      carGroup.add(exhaust);

      // Inner heat blue/glow
      const exhaustGlow = new THREE.Mesh(
        new THREE.RingGeometry(0.01, 0.04, 12),
        new THREE.MeshBasicMaterial({ color: 0x3d5afe })
      );
      exhaustGlow.position.set(e, 0.02, -2.4);
      carGroup.add(exhaustGlow);
    }

    // I. LED Headlights & Taillights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headlightL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.12), headlightMat);
    headlightL.position.set(0.68, -0.04, 2.18);
    headlightL.rotation.y = -0.3;
    carGroup.add(headlightL);

    const headlightR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.12), headlightMat);
    headlightR.position.set(-0.68, -0.04, 2.18);
    headlightR.rotation.y = 0.3;
    carGroup.add(headlightR);

    // Taillight Light Strip
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xd50000 });
    const taillightBar = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.04, 0.05), taillightMat);
    taillightBar.position.set(0, 0.12, -2.22);
    carGroup.add(taillightBar);

    // J. Four Wheels with Rims, Drilled Discs, and Brembo Calipers
    const wheelPositions = [
      { x: 0.94, y: -0.36, z: 1.35, isFront: true },
      { x: -0.94, y: -0.36, z: 1.35, isFront: true },
      { x: 0.94, y: -0.36, z: -1.35, isFront: false },
      { x: -0.94, y: -0.36, z: -1.35, isFront: false },
    ];

    wheelPositions.forEach((pos) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, pos.y, pos.z);

      // Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 24);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelAssembly.add(tire);

      // Alloy Rim
      const rimGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.285, 12);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      wheelAssembly.add(rim);

      // Carbon-Ceramic Brake Disc
      const discGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 16);
      const disc = new THREE.Mesh(discGeo, brakeDiscMat);
      disc.rotation.z = Math.PI / 2;
      wheelAssembly.add(disc);

      // Red Caliper
      const caliperGeo = new THREE.BoxGeometry(0.08, 0.14, 0.1);
      const caliper = new THREE.Mesh(caliperGeo, brakeCaliperMat);
      caliper.position.set(pos.x > 0 ? 0.02 : -0.02, 0.12, 0);
      wheelAssembly.add(caliper);

      carGroup.add(wheelAssembly);
    });

    // 7. Aerodynamics Wind Tunnel Streamlines
    const particleCount = 200;
    const streamlinePoints: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 2.2;
      const yBase = -0.35 + Math.random() * 0.9;
      for (let z = 3.5; z >= -3.5; z -= 0.5) {
        // Curve air over hood & canopy
        let y = yBase;
        if (Math.abs(x) < 0.9 && z < 1.8 && z > -1.2) {
          y += Math.sin((z + 1.2) / 3.0 * Math.PI) * 0.45;
        }
        streamlinePoints.push(new THREE.Vector3(x, y, z));
      }
    }
    const streamGeo = new THREE.BufferGeometry().setFromPoints(streamlinePoints);
    const streamMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.4,
    });
    const windStreamlines = new THREE.LineSegments(streamGeo, streamMat);
    windStreamlines.visible = showWindTunnel;
    windStreamlinesRef.current = windStreamlines;
    carGroup.add(windStreamlines);

    // Initial position
    carGroup.rotation.y = rotationTargetRef.current.y;
    carGroup.rotation.x = rotationTargetRef.current.x;

    // 8. Animation Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isAutoRotating && !isDraggingRef.current && carGroupRef.current) {
        rotationTargetRef.current.y += delta * 0.35;
      }

      if (carGroupRef.current) {
        carGroupRef.current.rotation.y +=
          (rotationTargetRef.current.y - carGroupRef.current.rotation.y) * 0.1;
        carGroupRef.current.rotation.x +=
          (rotationTargetRef.current.x - carGroupRef.current.rotation.x) * 0.1;
      }

      // Wind tunnel pulse animation
      if (windStreamlinesRef.current && windStreamlinesRef.current.visible) {
        windStreamlinesRef.current.position.z = (clock.getElapsedTime() * 2.5) % 1.0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeMode, selectedBg]);

  // Update Paint Color
  useEffect(() => {
    paintMaterialsRef.current.forEach((mat) => {
      mat.color.set(selectedColor);
    });
  }, [selectedColor]);

  // Toggle Wind Tunnel Streamlines
  useEffect(() => {
    if (windStreamlinesRef.current) {
      windStreamlinesRef.current.visible = showWindTunnel;
    }
  }, [showWindTunnel]);

  // Orbit / Drag Interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    rotationTargetRef.current.y += deltaX * 0.008;
    rotationTargetRef.current.x = Math.max(
      -0.2,
      Math.min(0.65, rotationTargetRef.current.x + deltaY * 0.005)
    );

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    zoomRef.current = Math.max(3.8, Math.min(8.5, zoomRef.current + e.deltaY * 0.004));
    const factor = zoomRef.current / cameraRef.current.position.length();
    cameraRef.current.position.multiplyScalar(factor);
  };

  // Camera Presets
  const setPresetAngle = (preset: string) => {
    soundEngine.playClick();
    setCameraPreset(preset);
    setIsAutoRotating(false);

    if (preset === 'front') {
      rotationTargetRef.current = { x: 0.08, y: Math.PI };
    } else if (preset === 'rear') {
      rotationTargetRef.current = { x: 0.12, y: 0 };
    } else if (preset === 'side') {
      rotationTargetRef.current = { x: 0.05, y: Math.PI / 2 };
    } else if (preset === 'top') {
      rotationTargetRef.current = { x: 0.65, y: -0.6 };
    } else if (preset === 'photo-hero') {
      // Angle matching the user's exhibition photo! Rear 3/4 perspective
      rotationTargetRef.current = { x: 0.32, y: -0.45 };
    } else {
      rotationTargetRef.current = { x: 0.25, y: -0.6 };
    }
  };

  // Hotspot Click in 3D
  const handleHotspotClick = (hotspot: ComponentHotspot) => {
    soundEngine.playClick();
    setSelectedHotspot(hotspot);
    setIsAutoRotating(false);

    // Orient camera toward hotspot
    if (hotspot.id === 'front-splitter' || hotspot.id === 'matrix-headlights' || hotspot.id === 'carbon-hood') {
      rotationTargetRef.current = { x: 0.15, y: Math.PI };
    } else if (hotspot.id === 'active-rear-wing' || hotspot.id === 'exhaust-system' || hotspot.id === 'rear-diffuser') {
      rotationTargetRef.current = { x: 0.18, y: 0 };
    } else if (hotspot.id === 'wheels-brakes' || hotspot.id === 'dihedral-doors') {
      rotationTargetRef.current = { x: 0.1, y: Math.PI / 2 };
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#080808] flex flex-col overflow-hidden text-white transition-all ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      }`}
    >
      <div className="relative w-full h-full flex flex-col bg-[#0b0b0b] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
        {/* Top Control Header */}
        <header className="px-4 py-3 sm:px-6 bg-[#121212]/90 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between gap-4 z-40">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D50000] animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#D50000] uppercase font-bold tracking-wider">
                  {car.manufacturer}
                </span>
                <span className="text-xs text-neutral-400 font-mono">• {car.year}</span>
              </div>
              <h2 className="text-base sm:text-xl font-black font-heading tracking-wide uppercase text-white truncate">
                {car.model} <span className="text-neutral-400 font-normal text-xs sm:text-sm">Virtual Inspection</span>
              </h2>
            </div>
          </div>

          {/* Mode Switcher: Exterior 3D vs Interior Cockpit */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => {
                soundEngine.playGearShift();
                setActiveMode('exterior');
              }}
              className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeMode === 'exterior'
                  ? 'bg-[#D50000] text-white shadow-[0_0_15px_rgba(213,0,0,0.5)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Exterior 3D
            </button>
            <button
              onClick={() => {
                soundEngine.playGearShift();
                setActiveMode('interior');
              }}
              className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeMode === 'interior'
                  ? 'bg-[#D50000] text-white shadow-[0_0_15px_rgba(213,0,0,0.5)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interior Cockpit
            </button>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRevModal(car)}
              className="px-3 py-1.5 bg-[#FFD600]/10 hover:bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/40 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              title="Simulate Engine Revs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rev Engine</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all hidden sm:flex"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 bg-neutral-800 hover:bg-[#D50000] text-neutral-300 hover:text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MAIN EXPLORATION VIEWPORT */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {activeMode === 'exterior' ? (
            /* ================= EXTERIOR 3D MODE ================= */
            <div
              className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
            >
              {/* Three.js Canvas Container */}
              <div ref={mountRef} className="w-full h-full" />

              {/* Ambient Hall Lighting Simulation Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Top Viewport Floating Tag (matching photo) */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#D50000]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D50000]" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">
                    EXHIBITION PODIUM • 360° ORBITAL
                  </span>
                </div>
              </div>

              {/* Exterior Component Hotspots Overlay Floating Buttons */}
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                {car.exteriorHotspots.map((hotspot) => {
                  return (
                    <button
                      key={hotspot.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHotspotClick(hotspot);
                      }}
                      className="pointer-events-auto absolute group transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        // 2D placement projection fallback
                        left: `${(hotspot.position3D[0] * 12 + 50).toFixed(1)}%`,
                        top: `${(-hotspot.position3D[2] * 8 + 52).toFixed(1)}%`,
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Glowing pulsating ring */}
                        <span className="absolute w-6 h-6 rounded-full bg-[#D50000]/40 animate-ping" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#D50000] border-2 border-white shadow-[0_0_10px_#D50000] flex items-center justify-center text-[8px] font-bold text-white transition-transform group-hover:scale-125" />
                        
                        {/* Hover Tooltip Tag */}
                        <span className="absolute left-6 whitespace-nowrap bg-black/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                          {hotspot.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Left: Camera Angles & Stage Controls */}
              <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-2">
                <div className="bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-neutral-800 flex items-center gap-1">
                  <button
                    onClick={() => setPresetAngle('photo-hero')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                      cameraPreset === 'photo-hero'
                        ? 'bg-[#D50000] text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                    title="Camera matching user's exhibition photo"
                  >
                    Exhibition 3/4
                  </button>
                  <button
                    onClick={() => setPresetAngle('front')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                      cameraPreset === 'front' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setPresetAngle('side')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                      cameraPreset === 'side' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Side
                  </button>
                  <button
                    onClick={() => setPresetAngle('rear')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                      cameraPreset === 'rear' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Rear
                  </button>
                  <button
                    onClick={() => setPresetAngle('top')}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                      cameraPreset === 'top' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Aero Top
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setIsAutoRotating(!isAutoRotating);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      isAutoRotating
                        ? 'bg-[#D50000]/20 border-[#D50000] text-[#FF2020]'
                        : 'bg-black/80 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                    Turntable
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setShowWindTunnel(!showWindTunnel);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      showWindTunnel
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-black/80 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    Wind Tunnel
                  </button>
                </div>
              </div>

              {/* Bottom Right: Exterior Color Customizer & Background Switcher */}
              <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-3">
                {/* Paint Finishes Palette */}
                <div className="bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-neutral-800 shadow-xl flex flex-col items-end">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                    Exterior Paint Customizer
                  </span>
                  <div className="flex items-center gap-2">
                    {car.equipment.exteriorColors.map((col) => {
                      const isSelected = selectedColor === col.hex;
                      return (
                        <button
                          key={col.hex}
                          onClick={() => {
                            soundEngine.playClick();
                            setSelectedColor(col.hex);
                          }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform relative ${
                            isSelected
                              ? 'scale-125 border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                              : 'border-neutral-700 hover:scale-110'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Studio Backdrop Switcher */}
                <div className="bg-black/80 backdrop-blur-md p-1 rounded-lg border border-neutral-800 flex items-center gap-1 text-[10px] font-mono">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedBg('exhibition');
                    }}
                    className={`px-2 py-1 rounded transition-all ${
                      selectedBg === 'exhibition' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400'
                    }`}
                  >
                    Exhibition Hall
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedBg('dark');
                    }}
                    className={`px-2 py-1 rounded transition-all ${
                      selectedBg === 'dark' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400'
                    }`}
                  >
                    Dark Studio
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedBg('cyber');
                    }}
                    className={`px-2 py-1 rounded transition-all ${
                      selectedBg === 'cyber' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400'
                    }`}
                  >
                    Cyber Stage
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= INTERIOR COCKPIT MODE ================= */
            <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
              {/* Cockpit Ultra-HD High-Res Canvas */}
              <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center p-4">
                <div className="relative w-full aspect-[16/9] max-h-[85vh] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl group">
                  <img
                    src="/images/supercar-interior.jpg"
                    alt="Luxury Cockpit"
                    className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Ambient Light dynamic overlay that changes with the color picker! */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen opacity-45 transition-colors duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 60%, ${interiorAmbientColor} 0%, transparent 60%)`,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                  {/* Interior Hotspots with pulses */}
                  {car.interiorHotspots.map((hotspot) => {
                    const isSelected = interiorSelectedHotspot === hotspot.id;
                    return (
                      <button
                        key={hotspot.id}
                        onClick={() => {
                          soundEngine.playClick();
                          setInteriorSelectedHotspot(hotspot.id);
                        }}
                        className="absolute group z-20 transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${hotspot.xPercent}%`,
                          top: `${hotspot.yPercent}%`,
                        }}
                      >
                        <div className="relative flex items-center justify-center">
                          <span
                            className="absolute w-7 h-7 rounded-full animate-ping opacity-60"
                            style={{ backgroundColor: interiorAmbientColor }}
                          />
                          <span
                            className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white transition-transform ${
                              isSelected ? 'scale-125 ring-2 ring-white' : 'group-hover:scale-110'
                            }`}
                            style={{ backgroundColor: interiorAmbientColor }}
                          />
                          <span className="absolute top-5 whitespace-nowrap bg-black/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded border border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            {hotspot.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Ambient Lighting Interactive RGB Controller */}
                  <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md p-3 rounded-xl border border-neutral-800 z-30">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Cockpit Ambient Mood LED
                    </span>
                    <div className="flex items-center gap-2">
                      {[
                        { name: 'Racing Red', hex: '#D50000' },
                        { name: 'Modena Yellow', hex: '#FFD600' },
                        { name: 'Cyan Blue', hex: '#00E5FF' },
                        { name: 'Monza Green', hex: '#00E676' },
                        { name: 'Royal Purple', hex: '#D500F9' },
                        { name: 'Pure White', hex: '#FFFFFF' },
                      ].map((amb) => (
                        <button
                          key={amb.hex}
                          onClick={() => {
                            soundEngine.playClick();
                            setInteriorAmbientColor(amb.hex);
                          }}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            interiorAmbientColor === amb.hex
                              ? 'scale-125 border-white shadow-[0_0_10px_currentColor]'
                              : 'border-neutral-700 opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: amb.hex }}
                          title={amb.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Interior Hotspot Details Box */}
                  {interiorSelectedHotspot && (
                    (() => {
                      const cur = car.interiorHotspots.find((h) => h.id === interiorSelectedHotspot);
                      if (!cur) return null;
                      return (
                        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-black/90 backdrop-blur-xl border border-neutral-700 p-4 rounded-xl shadow-2xl z-30 animate-fadeIn">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-[10px] font-mono text-[#D50000] font-bold uppercase">
                                Cockpit Architecture
                              </span>
                              <h4 className="text-base font-bold text-white font-heading">
                                {cur.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => setInteriorSelectedHotspot(null)}
                              className="p-1 text-neutral-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                            {cur.description}
                          </p>
                          <div className="space-y-1.5 text-[11px] border-t border-neutral-800 pt-2 font-mono">
                            <div className="text-neutral-400">
                              <span className="text-neutral-500">Materials:</span> {cur.materials}
                            </div>
                            <div className="text-neutral-400">
                              <span className="text-neutral-500">Tech:</span> {cur.specialTech}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EXTERIOR COMPONENT DETAILED MODAL / DRAWER */}
          {selectedHotspot && (
            <div className="absolute top-4 right-4 bottom-4 w-full max-w-sm sm:max-w-md bg-[#121212]/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl p-6 shadow-2xl z-40 flex flex-col justify-between overflow-y-auto animate-fadeIn">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#D50000] uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D50000]" />
                      Component Inspector
                    </span>
                    <h3 className="text-xl font-bold font-heading text-white mt-1">
                      {selectedHotspot.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Component Image */}
                {selectedHotspot.image && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-neutral-800 bg-neutral-900">
                    <img
                      src={selectedHotspot.image}
                      alt={selectedHotspot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono text-neutral-300 bg-black/70 px-2 py-0.5 rounded border border-neutral-800 uppercase">
                      {selectedHotspot.category}
                    </span>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-xs font-mono uppercase text-neutral-400 mb-1">
                    Engineering Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    {selectedHotspot.description}
                  </p>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-3 bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">
                      Aerodynamic / Mechanical Purpose
                    </span>
                    <span className="text-neutral-200 font-medium">
                      {selectedHotspot.functionality}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">
                      Materials & Manufacturing
                    </span>
                    <span className="text-neutral-200 font-medium">
                      {selectedHotspot.materials}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">
                      Special Innovations
                    </span>
                    <span className="text-[#FFD600] font-medium">
                      {selectedHotspot.specialTech}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close / Next Action */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Return to 3D Orbital
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Vehicle Quick Summary Bar */}
        <footer className="px-4 py-2.5 sm:px-6 bg-[#121212]/90 backdrop-blur-md border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs z-30">
          <div className="flex items-center gap-4 sm:gap-6 font-mono">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Engine</span>
              <span className="font-semibold text-white">{car.engine.configuration}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] text-neutral-500 uppercase block">Output</span>
              <span className="font-bold text-[#FF2020]">{car.engine.horsepower} HP</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">0-100 km/h</span>
              <span className="font-bold text-[#FFD600]">{car.engine.acceleration0100}s</span>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] text-neutral-500 uppercase block">Max Velocity</span>
              <span className="font-bold text-white">{car.engine.topSpeedKmH} km/h</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetails(car)}
              className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all text-xs font-semibold flex items-center gap-1"
            >
              Full Specifications Dossier
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
