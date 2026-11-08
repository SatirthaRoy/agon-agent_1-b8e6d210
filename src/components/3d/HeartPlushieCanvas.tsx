import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../contexts/ThemeContext';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeartPlushieProps {
  partnerName?: string;
}

export const HeartPlushieCanvas: React.FC<HeartPlushieProps> = ({ partnerName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, settings } = useTheme();
  const [loveCount, setLoveCount] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const heartMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Create Plushie Velvet Bump Texture procedurally
    const createPlushieBumpMap = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 20000; i++) {
          const x = Math.random() * 256;
          const y = Math.random() * 256;
          const val = Math.floor(Math.random() * 255);
          ctx.fillStyle = `rgb(${val},${val},${val})`;
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    };

    const bumpMap = createPlushieBumpMap();

    // Heart 2D Shape
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    // Extrude settings for plushie volume
    const extrudeSettings = {
      steps: 2,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.28,
      bevelSize: 0.25,
      bevelOffset: 0,
      bevelSegments: 16,
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geometry.center();

    // Material with Plushie Warm Glow
    const hexColor = theme.heartColor || '#ec4899';
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hexColor),
      roughness: 0.7,
      metalness: 0.1,
      bumpMap: bumpMap,
      bumpScale: 0.03,
    });

    const heartMesh = new THREE.Mesh(geometry, material);
    heartMesh.scale.set(2.2, 2.2, 2.2);
    heartMesh.rotation.x = Math.PI; // Flip heart right side up
    scene.add(heartMesh);
    heartMeshRef.current = heartMesh;

    // Stitching outline detail (Golden/Warm thread aesthetic)
    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#ffffff'),
      transparent: true,
      opacity: 0.12,
    });
    const stitches = new THREE.LineSegments(wireframeGeo, wireframeMat);
    heartMesh.add(stitches);

    // Particle Stars / Sparkles
    const particleCount = 60;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Simple star texture canvas
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const starCtx = starCanvas.getContext('2d');
    if (starCtx) {
      starCtx.fillStyle = '#ffffff';
      starCtx.beginPath();
      starCtx.arc(16, 16, 12, 0, Math.PI * 2);
      starCtx.fill();
    }
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const particlesMat = new THREE.PointsMaterial({
      color: new THREE.Color(hexColor),
      size: 0.15,
      map: starTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const pinkPointLight = new THREE.PointLight(new THREE.Color(hexColor), 2.5, 10);
    pinkPointLight.position.set(-3, 2, 3);
    scene.add(pinkPointLight);

    const warmPointLight = new THREE.PointLight(0xffedd5, 2.0, 10);
    warmPointLight.position.set(3, -2, 3);
    scene.add(warmPointLight);

    // Mouse Interaction
    let targetRotationX = Math.PI;
    let targetRotationY = 0;
    let bounceScale = 2.2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotationY = mouseX * 1.2;
      targetRotationX = Math.PI - mouseY * 0.8;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (heartMesh) {
        // Floating gentle breathing movement
        const floatOffsetY = Math.sin(elapsedTime * 2) * 0.15;
        heartMesh.position.y = floatOffsetY;

        // Smooth rotation interpolation
        heartMesh.rotation.y += (targetRotationY - heartMesh.rotation.y) * 0.08;
        heartMesh.rotation.x += (targetRotationX - heartMesh.rotation.x) * 0.08;

        // Idle slow spin when idle
        targetRotationY += 0.003;

        // Smooth scale recovery after squish
        bounceScale += (2.2 - bounceScale) * 0.1;
        heartMesh.scale.set(bounceScale, bounceScale, bounceScale);
      }

      // Rotate sparkles
      if (particleSystem) {
        particleSystem.rotation.y = elapsedTime * 0.1;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.05) * 0.2;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [theme.heartColor]);

  // Click Plushie Heart Effect
  const handlePlushieClick = (e: React.MouseEvent) => {
    setLoveCount((prev) => prev + 1);

    // Trigger burst confetti
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#ec4899', '#f43f5e', '#fb7185', '#ffd1dc'],
    });

    // Floating Love Text Popup
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const lovePhrases = [
        `I Love You ${partnerName || settings.partner_name}! ❤️`,
        'Forever Yours 💕',
        'You Hug My Heart 🧸',
        'My Cutest Plushie 💖',
        '1000x Hugs 🌸',
        'Always & Forever ✨',
      ];
      const randomText = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];
      const newFloating = { id: Date.now(), text: randomText, x: clickX, y: clickY };

      setFloatingTexts((prev) => [...prev.slice(-5), newFloating]);

      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== newFloating.id));
      }, 1500);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6">
      {/* Container header badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-rose-950/60 backdrop-blur-md border border-rose-200/80 dark:border-rose-800 shadow-sm text-xs font-semibold text-rose-600 dark:text-rose-300 mb-3 animate-pulse">
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        <span>3D Heart Plushie — Tap to squeeze me!</span>
      </div>

      {/* Canvas wrapper */}
      <div
        onClick={handlePlushieClick}
        className="relative cursor-pointer transition-transform active:scale-95 group rounded-3xl"
        style={{ width: '380px', height: '380px' }}
      >
        <div ref={containerRef} className="w-full h-full" />

        {/* Floating click text animations */}
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            className="absolute pointer-events-none font-bold text-sm sm:text-base text-rose-600 dark:text-pink-300 bg-white/90 dark:bg-rose-900/90 px-3 py-1 rounded-full shadow-lg border border-pink-300 animate-bounce transition-all duration-1000 z-20 whitespace-nowrap"
            style={{
              left: `${f.x - 40}px`,
              top: `${f.y - 30}px`,
            }}
          >
            {f.text}
          </div>
        ))}

        {/* Glow backdrop behind heart */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/20 via-rose-300/30 to-amber-200/20 blur-3xl -z-10 rounded-full group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Love counter indicator */}
      <div className="mt-2 flex items-center gap-3 bg-white/80 dark:bg-rose-950/70 backdrop-blur-md px-5 py-2 rounded-full border border-pink-200 dark:border-rose-800 shadow-md">
        <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-ping" />
        <span className="text-xs sm:text-sm font-medium text-rose-800 dark:text-rose-200">
          Heart Squeezes Sent: <strong className="text-pink-600 dark:text-pink-400 font-bold text-base">{loveCount}</strong>
        </span>
      </div>
    </div>
  );
};
