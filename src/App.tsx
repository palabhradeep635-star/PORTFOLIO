/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Cpu, 
  MapPin, 
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Zap,
  Layers,
  Globe,
  Code,
  Terminal,
  Code2,
  Check,
  AlertCircle,
  Gauge,
  Settings,
  Activity,
  Info
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
interface TypewriterOptions {
  strings: string[];
  autoStart?: boolean;
  loop?: boolean;
  delay?: number;
  deleteSpeed?: number;
}

const Typewriter = ({ options }: { options: TypewriterOptions }) => {
  const { strings, delay = 45, deleteSpeed = 25, loop = true } = options;
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const stringsKey = strings.join('|');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = strings[currentStringIndex];

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }, delay);
      } else if (loop) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500); // Wait 1.5 seconds at full string
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentStringIndex((prev) => (prev + 1) % strings.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentStringIndex, stringsKey, delay, deleteSpeed, loop]);

  return (
    <span>
      {currentText}
      <span className="animate-pulse ml-[2px] text-cyan-400">|</span>
    </span>
  );
};
import Lenis from 'lenis';
import { 
  PROFILE, 
  CAREER_OBJECTIVE, 
  ABOUT_INTRO,
  ABOUT_TECH_SPECIALIZATION,
  ABOUT_DIRECTION,
  ABOUT_ME, 
  SKILLS, 
  PROJECTS, 
  EDUCATION 
} from './constants';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip as ChartTooltip } from 'recharts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

const NAV_SECTIONS = [
  { id: "hero", label: "01 / HOME" },
  { id: "about", label: "02 / NARRATIVE" },
  { id: "evolution", label: "03 / EVOLUTION" },
  { id: "skills", label: "04 / ARSENAL" },
  { id: "dsa", label: "05 / DSA" },
  { id: "projects", label: "06 / WORKS" },
  { id: "education", label: "07 / PATH" },
  { id: "contact", label: "08 / CONTACT" },
  { id: "vision", label: "09 / VISION & FUTURE" }
];

const ScrollNavigator = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Look at the center reference focus-point (40% down the viewport)
      const focusY = scrollPos + (viewportHeight * 0.4);
      
      let currentSection = "hero";

      for (const sec of NAV_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollPos;
          const height = rect.height;
          if (focusY >= top && focusY < top + height) {
            currentSection = sec.id;
            break;
          }
        }
      }

      // Explicit first section offset
      if (scrollPos < 120) {
        currentSection = "hero";
      }

      // Explicit last section / bottom fallback
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 90) {
        currentSection = "vision";
      }

      setActiveSection(currentSection);
    };

    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionId: string }>;
      if (customEvent.detail && customEvent.detail.sectionId) {
        setActiveSection(customEvent.detail.sectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener('nav-section-click', handleNavClick);
    
    // Initial call to detect section placement on load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('nav-section-click', handleNavClick);
    };
  }, []);

  return (
    <div className="fixed right-6 sm:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
      {NAV_SECTIONS.map((sec) => (
        <a 
          key={sec.id}
          href={`#${sec.id}`}
          className="group flex items-center justify-end gap-3.5"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(sec.id);
            if (el) {
              window.dispatchEvent(new CustomEvent('nav-section-click', { detail: { sectionId: sec.id } }));
              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(el, { offset: -40, duration: 1.2 });
              } else {
                const rect = el.getBoundingClientRect();
                const absoluteTop = rect.top + window.pageYOffset;
                window.scrollTo({
                  top: absoluteTop - 40,
                  behavior: 'smooth'
                });
              }
            }
          }}
        >
          <span className="text-[9px] font-mono tracking-widest text-white/30 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
            {sec.label}
          </span>
          <div className="relative w-4 h-4 flex items-center justify-center">
            <motion.div 
              animate={{
                scale: activeSection === sec.id ? 1.3 : 0.8,
                backgroundColor: activeSection === sec.id ? "#22d3ee" : "rgba(255, 255, 255, 0.2)"
              }}
              whileHover={{
                scale: activeSection === sec.id ? 1.3 : 1.15,
                backgroundColor: "#22d3ee"
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={cn(
                "w-2 h-2 rounded-full transition-shadow duration-300",
                activeSection === sec.id ? "shadow-[0_0_12px_rgba(34,211,238,0.73)]" : ""
              )}
            />
            {activeSection === sec.id && (
              <>
                {/* Smooth sliding selection outline frame (no conflicting CSS animations) */}
                <motion.div 
                  layoutId="activeDotOutline"
                  transition={{ type: "spring", stiffness: 320, damping: 27 }}
                  className="absolute -inset-1 border border-cyan-400/40 rounded-full pointer-events-none"
                />
                {/* Local stable pulse ping animation (removes layoutId to prevent teleportation/translation jitter) */}
                <div 
                  className="absolute inset-0 border border-cyan-400/60 rounded-full animate-ping pointer-events-none"
                  style={{ animationDuration: '2s' }}
                />
              </>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

const ScrollReveal = ({ children, delay = 0, yOffset = 15, xOffset = 0, duration = 0.65, className }: { children: React.ReactNode, delay?: number, yOffset?: number, xOffset?: number, duration?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
};

const ParallaxContainer = ({ children, offsetAmount = 30, direction = "up" }: { children: React.ReactNode, offsetAmount?: number, direction?: "up" | "down" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === "up" ? [offsetAmount, -offsetAmount] : [-offsetAmount, offsetAmount]
  );
  const springY = useSpring(y, { stiffness: 55, damping: 24 });
  
  return (
    <motion.div ref={ref} style={{ y: springY }} className="h-full">
      {children}
    </motion.div>
  );
};

type PerfMode = 'professional' | 'eco' | 'ultra';

interface ParticleBackgroundProps {
  perfMode: PerfMode;
  setPerfMode: (mode: PerfMode) => void;
  setToastMessage: (msg: string | null) => void;
  autoOptimize: boolean;
  setAutoOptimize: (val: boolean) => void;
}

const ParticleBackground = ({ 
  perfMode, 
  setPerfMode, 
  setToastMessage,
  autoOptimize,
  setAutoOptimize
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(0);

  const [showAutoNotice, setShowAutoNotice] = useState<boolean>(false);

  const perfModeRef = useRef<PerfMode>(perfMode);
  const autoOptimizeRef = useRef(autoOptimize);
  const wakeUpRef = useRef<() => void>(() => {});

  useEffect(() => {
    perfModeRef.current = perfMode;
    wakeUpRef.current();
  }, [perfMode]);

  useEffect(() => {
    autoOptimizeRef.current = autoOptimize;
  }, [autoOptimize]);

  // Alert dismiss timeout
  useEffect(() => {
    if (showAutoNotice) {
      const timer = setTimeout(() => setShowAutoNotice(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAutoNotice]);

  // Multi-threaded mutable refs for high-FPS non-stuttering animation loop Access
  const engineModeRef = useRef<'nebula' | 'singularity' | 'hybrid'>('nebula');
  const speedRef = useRef<number>(6.0);
  const paletteRef = useRef<'dynamic' | 'solar' | 'cyan' | 'violet' | 'pink'>('dynamic');
  const gravityRef = useRef<number>(1.5);
  const currentWarp = useRef(1.0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let scrollVelocity = 0;
    let isLoopRunning = true;

    const wakeUp = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animFrameId = requestAnimationFrame(render);
      }
    };
    
    // Register wakeup handle ref to allow React component updates to wake up the main thread
    wakeUpRef.current = wakeUp;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      wakeUp();
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouseRef.current.targetX = (e.touches[0].clientX - window.innerWidth / 2) / window.innerWidth;
        mouseRef.current.targetY = (e.touches[0].clientY - window.innerHeight / 2) / window.innerHeight;
      }
      wakeUp();
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      scrollRef.current = pct;

      // Scroll velocity calculation for warp streaks
      const now = Date.now();
      const timeDiff = Math.max(1, now - lastScrollTime);
      const scrollDiff = Math.abs(window.scrollY - lastScrollY);
      scrollVelocity = scrollDiff / timeDiff; // pixels per ms
      lastScrollY = window.scrollY;
      lastScrollTime = now;
      wakeUp();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let currentDpr = 0;

    const resize = () => {
      currentDpr = 0; // Trigger native canvas physical backing store resize in animation loop
      wakeUp();
    };
    window.addEventListener('resize', resize);

    // Premium Color Palettes for the Volumetric Nebula
    const PALETTES = [
      { core: 'rgba(245, 158, 11, OPACITY)', glow: 'rgba(220, 38, 38, OPACITY)' },      // Warm golden/amber to deep crimson
      { core: 'rgba(34, 211, 238, OPACITY)', glow: 'rgba(57, 118, 246, OPACITY)' },      // Cyan core to cosmic blue
      { core: 'rgba(167, 139, 250, OPACITY)', glow: 'rgba(139, 92, 246, OPACITY)' },    // Violet-blue to velvet lavender
      { core: 'rgba(236, 72, 153, OPACITY)', glow: 'rgba(76, 29, 149, OPACITY)' }       // Pink flare to ultra-indigo
    ];

    // Pre-render high-quality radial gradients to offscreen canvases for blazing-fast, hardware-accelerated texture draws
    const offscreenCanvases = PALETTES.map(palette => {
      const offscreen = document.createElement('canvas');
      offscreen.width = 128;
      offscreen.height = 128;
      const oCtx = offscreen.getContext('2d')!;
      
      const grad = oCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      const core = palette.core.replace('OPACITY', '1');
      const glow = palette.glow.replace('OPACITY', '1');
      
      grad.addColorStop(0, core);
      grad.addColorStop(0.35, palette.core.replace('OPACITY', '0.45'));
      grad.addColorStop(0.7, palette.glow.replace('OPACITY', '0.14'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      oCtx.fillStyle = grad;
      oCtx.beginPath();
      oCtx.arc(64, 64, 64, 0, Math.PI * 2);
      oCtx.fill();
      return offscreen;
    });

    const parseRGBA = (str: string) => {
      const vals = str
        .replace('rgba(', '')
        .replace(', OPACITY)', '')
        .split(',')
        .map(x => parseInt(x.trim()));
      return { r: vals[0], g: vals[1], b: vals[2] };
    };

    interface NebulaBlob {
      dx: number;
      dy: number;
      sizeRatio: number;
      angle: number;
      speed: number;
      opacityRatio: number;
    }

    interface NebulaCluster {
      originalIndex: number;
      x: number;
      y: number;
      z: number;
      rot: number;
      rotSpeed: number;
      baseSize: number;
      paletteIndex: number;
      blobs: NebulaBlob[];
    }

    // 3D Volumetric Nebula Corridor Layer Definitions
    const clusterCount = 10;
    const nebulaClusters: NebulaCluster[] = [];

    for (let i = 0; i < clusterCount; i++) {
      // Scatter clusters evenly down the corridor (Z-depth spacing)
      const z = (i / clusterCount) + Math.random() * 0.05;
      
      // Place clusters off-center to formulate a beautiful organic space tunnel
      const angle = (i * (Math.PI / 4.5)) + Math.random() * 0.5;
      const radius = 0.15 + Math.random() * 0.35;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.8; // slightly flatter ratio for cinema look

      const blobs: NebulaBlob[] = [];
      const blobCount = 3 + Math.floor(Math.random() * 3);
      for (let b = 0; b < blobCount; b++) {
        const bAngle = Math.random() * Math.PI * 2;
        const bDist = 0.08 + Math.random() * 0.18;
        blobs.push({
          dx: Math.cos(bAngle) * bDist,
          dy: Math.sin(bAngle) * bDist,
          sizeRatio: 0.65 + Math.random() * 0.7,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
          opacityRatio: 0.45 + Math.random() * 0.55
        });
      }

      nebulaClusters.push({
        originalIndex: i,
        x,
        y,
        z,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() * 0.0012 + 0.0004) * (Math.random() > 0.5 ? 1 : -1),
        baseSize: 0.28 + Math.random() * 0.22,
        paletteIndex: i % PALETTES.length,
        blobs
      });
    }

    // Distant Cinematic 3D Starfield
    interface SpaceStar {
      x: number;
      y: number;
      z: number;
      brightness: number;
      size: number;
      driftSpeed: number;
      twinkleOffset: number;
      twinkleSpeed: number;
    }

    const starCount = 110;
    const stars: SpaceStar[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * 2.0 - 1.0,
        y: Math.random() * 2.0 - 1.0,
        z: Math.random(),
        brightness: Math.random() * 0.7 + 0.3,
        size: Math.random() * 1.5 + 0.4,
        driftSpeed: Math.random() * 0.0002 + 0.0001,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04
      });
    }

    const OCEAN_WAVE_PRESETS = [
      { yOffset: 160, amp: 32, freq: 0.0024, speed: 0.0024, c: 'rgba(2, 4, 15, 0.96)', h: 'rgba(6, 182, 212, 0.12)' },
      { yOffset: 115, amp: 26, freq: 0.0034, speed: -0.0034, c: 'rgba(3, 8, 26, 0.85)', h: 'rgba(147, 51, 234, 0.1)' },
      { yOffset: 80, amp: 22, freq: 0.0044, speed: 0.0044, c: 'rgba(5, 12, 40, 0.74)', h: 'rgba(236, 72, 153, 0.08)' },
      { yOffset: 40, amp: 16, freq: 0.0054, speed: -0.0055, c: 'rgba(8, 20, 56, 0.54)', h: 'rgba(34, 211, 238, 0.14)' }
    ];

    let frame = 0;
    let prevLookX = 0;
    let prevLookY = 0;

    // Real-time FPS/performance tracking
    let lastTime = performance.now();
    let frameCount = 0;
    let lowFpsCount = 0;
    let highFpsCount = 0;
    let idleFrames = 0;
    let ecoTransition = perfModeRef.current !== 'professional' ? 1.0 : 0.0;
    let ultraTransition = perfModeRef.current === 'ultra' ? 1.0 : 0.0;

    function render() {
      frame++;
      frameCount++;

      // Smoothly decay scroll velocity over time so warp speed returns to baseline
      scrollVelocity *= 0.93;

      // Save CPU/GPU overhead in Ultra Eco mode by rendering only 1 out of every 3 frames (~20 FPS target)
      if (perfModeRef.current === 'ultra' && frame % 3 !== 0) {
        if (isLoopRunning) {
          animFrameId = requestAnimationFrame(render);
        }
        return;
      }

      // Check if background remains static for extreme performance optimization on standby
      if (perfModeRef.current === 'ultra') {
        const isCurrentlyStationary = 
          scrollVelocity < 0.01 && 
          Math.abs(mouseRef.current.targetX - mouseRef.current.x) < 0.01 && 
          Math.abs(mouseRef.current.targetY - mouseRef.current.y) < 0.01;
        
        if (isCurrentlyStationary) {
          idleFrames++;
          if (idleFrames > 30) { // ~3 seconds of active static frames at ~20hz
            isLoopRunning = false;
            window.dispatchEvent(new CustomEvent('fps-update', { detail: null }));
            return; // Fully sleep the background rendering loop to stop CPU/GPU load entirely!
          }
        } else {
          idleFrames = 0;
        }
      } else {
        idleFrames = 0;
      }

      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;
      if (elapsed >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / elapsed);
        window.dispatchEvent(new CustomEvent('fps-update', { detail: calculatedFps }));
        
        if (autoOptimizeRef.current) {
          // Intelligent multi-tier auto throttling
          if (calculatedFps < 30) {
            lowFpsCount++;
            if (lowFpsCount >= 3) {
              if (perfModeRef.current === 'professional') {
                setPerfMode('eco');
                setShowAutoNotice(true);
                setToastMessage("Performance Auto-Throttled to Eco Mode (optimized for fluid interaction)");
              } else if (perfModeRef.current === 'eco') {
                setPerfMode('ultra');
                setShowAutoNotice(true);
                setToastMessage("Performance Auto-Throttled to Ultra Eco Mode (maximum resource preservation)");
              }
              lowFpsCount = 0;
            }
          } else {
            lowFpsCount = 0;
          }

          // Intelligent auto-recovery: Sustained high-performance restores full fidelity
          if (calculatedFps >= 48) {
            highFpsCount++;
            if (highFpsCount >= 5) {
              if (perfModeRef.current === 'ultra') {
                setPerfMode('eco');
                setShowAutoNotice(true);
                setToastMessage("Performance Restored to Balanced Eco Mode");
              } else if (perfModeRef.current === 'eco') {
                setPerfMode('professional');
                setShowAutoNotice(true);
                setToastMessage("Performance Restored to High-Fidelity Professional Mode");
              }
              highFpsCount = 0;
            }
          } else {
            highFpsCount = 0;
          }
        } else {
          lowFpsCount = 0;
          highFpsCount = 0;
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      // Smoothly interpolate between Professional Mode (0.0), Eco Mode (1.0), and Ultra Eco Mode (1.0 for both)
      const targetEco = perfModeRef.current !== 'professional' ? 1.0 : 0.0;
      ecoTransition += (targetEco - ecoTransition) * 0.05;

      const targetUltra = perfModeRef.current === 'ultra' ? 1.0 : 0.0;
      ultraTransition += (targetUltra - ultraTransition) * 0.05;

      const isEco = perfModeRef.current !== 'professional';
      const isUltra = perfModeRef.current === 'ultra';
      
      // Dynamically scale down canvas physical resolution in Eco/Ultra modes to save massive GPU fill rate cycles
      let targetDpr = Math.min(1.8, window.devicePixelRatio || 1);
      if (perfModeRef.current === 'ultra') {
        targetDpr = Math.min(0.65, targetDpr); // Dynamic sub-DPI (DPR 0.65) for absolute minimal GPU payload
      } else if (perfModeRef.current === 'eco') {
        targetDpr = Math.min(1.0, targetDpr); // Standard 1.0 DPR cap
      }

      if (currentDpr !== targetDpr) {
        currentDpr = targetDpr;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * currentDpr;
        canvas.height = height * currentDpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale
        ctx.scale(currentDpr, currentDpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = perfModeRef.current === 'professional' ? 'high' : 'medium';
      }


      // Smooth mouse coordinates interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Velocity scroll decay and acceleration integration
      // Dynamic slowdown index prioritizing ultimate GPU relief
      const speedMultiplier = (1.0 - ecoTransition * 0.4) * (1.1 - ultraTransition * 1.05);
      const speedSetting = speedRef.current * Math.max(0.01, speedMultiplier);
      const velocityWarpBoost = 1.0 + Math.min(12.0, scrollVelocity * 9.5);
      
      // Interpolate current warp speed ref factor smoothly
      currentWarp.current += (velocityWarpBoost - currentWarp.current) * 0.075;

      // Cinematic slow sway (simulates orbital drift space breathing)
      const swayX = Math.sin(frame * 0.004) * 0.025;
      const swayY = Math.cos(frame * 0.005) * 0.015;

      // Final camera Look coordinates projection
      const lookX = mouseRef.current.x * 0.35 * gravityRef.current + swayX;
      const lookY = mouseRef.current.y * 0.25 * gravityRef.current + swayY - (scrollRef.current * 0.4);

      // Distant dark background void
      ctx.fillStyle = '#010103';
      ctx.fillRect(0, 0, width, height);

      // 1. Render Distant Warping Stars (Perspective 3D field line projection)
      // Dynamically cap target object counts under power constraints to skip projection math entirely
      const activeStarCount = perfModeRef.current === 'ultra' ? 20 : perfModeRef.current === 'eco' ? 65 : starCount;
      for (let i = 0; i < activeStarCount; i++) {
        const star = stars[i];
        if (!star) continue;

        // Star camera push forward
        star.z -= 0.0006 * speedSetting * currentWarp.current;
        if (star.z <= 0) {
          star.z = 1.0;
          star.x = Math.random() * 2.0 - 1.0;
          star.y = Math.random() * 2.0 - 1.0;
          star.twinkleOffset = Math.random() * Math.PI * 2;
          star.twinkleSpeed = 0.02 + Math.random() * 0.04;
        }

        // Project 3D coordinate to screen with perspective
        const k = (width + height) * 0.55;
        const sx = width / 2 + (star.x + lookX) * k / star.z;
        const sy = height / 2 + (star.y + lookY) * k / star.z;

        // Clip stars outside screen boundaries
        if (sx < 0 || sx > width || sy < 0 || sy > height) continue;

        // Elegant fade transitions at extremes
        let starOpacity = star.brightness;
        
        // Multiplier for Extra stars on Eco/Ultra mode (smooth transition)
        if (i >= 45) {
          starOpacity *= (1.0 - ecoTransition);
        } else if (i >= 15) {
          starOpacity *= (1.0 - ultraTransition);
        }
        
        if (starOpacity <= 0.005) continue;

        if (star.z > 0.85) {
          starOpacity *= (1.0 - star.z) / 0.15; // fade in from infinity
        } else if (star.z < 0.15) {
          starOpacity *= star.z / 0.15; // fade out as it approaches camera margins
        }

        // Render micro-twinkling with randomized star offsets and custom individual rates
        starOpacity *= (0.65 + 0.35 * Math.sin(frame * star.twinkleSpeed + star.twinkleOffset));

        // Draw relativistic streaking (warping engine streak) if moving very quickly
        if (currentWarp.current > 1.3) {
          const prevZ = star.z + 0.0006 * speedSetting * currentWarp.current * 1.5;
          const psx = width / 2 + (star.x + prevLookX) * k / Math.max(0.005, prevZ);
          const psy = height / 2 + (star.y + prevLookY) * k / Math.max(0.005, prevZ);

          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, starOpacity)) * 0.75})`;
          ctx.lineWidth = star.size * 0.75;
          ctx.beginPath();
          ctx.moveTo(psx, psy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, starOpacity))})`;
          const halfSize = star.size * 0.5;
          ctx.fillRect(sx - halfSize, sy - halfSize, star.size, star.size);
        }
      }

      // Enable premium screen blending composition for additive cinematic glow effects
      ctx.globalCompositeOperation = 'screen';

      const currentMode = engineModeRef.current;

      // 2. Render Singularity Back-Field Gravitational Glow First (behind nebulas)
      const bhX = width * 0.75 + mouseRef.current.x * 50 * gravityRef.current;
      const bhY = height * 0.35 + mouseRef.current.y * 50 * gravityRef.current - (scrollRef.current * 150);
      const R = 44;

      if (currentMode === 'singularity' || currentMode === 'hybrid') {
        const gravitationalBackglow = ctx.createRadialGradient(bhX, bhY, R * 0.4, bhX, bhY, R * 6.6);
        gravitationalBackglow.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gravitationalBackglow.addColorStop(0.1, 'rgba(239, 68, 68, 0.52)');  // deep red gravitational shift
        gravitationalBackglow.addColorStop(0.24, 'rgba(124, 58, 237, 0.34)'); // violet core
        gravitationalBackglow.addColorStop(0.55, 'rgba(14, 165, 233, 0.15)'); // sky cyan flare limits
        gravitationalBackglow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gravitationalBackglow;
        ctx.beginPath();
        ctx.arc(bhX, bhY, R * 6.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render 3D Gaseous Volumetric Nebula Corridor (Only for Nebula & Hybrid Views)
      // Fully bypass heavy overlapping transparent gradient draws once Ultra Eco transition completes (total CPU/GPU silence for filling)
      if ((currentMode === 'nebula' || currentMode === 'hybrid') && ultraTransition < 0.99) {
        const breathingPeriod = 10000; // 10s slow sine wave period
        const breathingAngle = (Date.now() / breathingPeriod) * Math.PI * 2;
        const breathingPulse = Math.sin(breathingAngle);
        const breathingIntensity = 1.0 + 0.15 * breathingPulse; // subtle pulse in intensity
        const breathingSize = 1.0 + 0.04 * breathingPulse; // subtle physical swell

        // Sort nebulaClusters in-place to avoid array spreading allocation on every frame
        nebulaClusters.sort((a, b) => b.z - a.z);

        // Core current color schema determination
        const currentPalette = paletteRef.current;
        let activeCoreColor = 'rgba(34, 211, 238, OPACITY)';
        let activeGlowColor = 'rgba(57, 118, 246, OPACITY)';

        if (currentPalette === 'solar') {
          activeCoreColor = 'rgba(245, 158, 11, OPACITY)';
          activeGlowColor = 'rgba(238, 79, 79, OPACITY)';
        } else if (currentPalette === 'cyan') {
          activeCoreColor = 'rgba(34, 211, 238, OPACITY)';
          activeGlowColor = 'rgba(57, 118, 246, OPACITY)';
        } else if (currentPalette === 'violet') {
          activeCoreColor = 'rgba(167, 139, 250, OPACITY)';
          activeGlowColor = 'rgba(139, 92, 246, OPACITY)';
        } else if (currentPalette === 'pink') {
          activeCoreColor = 'rgba(236, 72, 153, OPACITY)';
          activeGlowColor = 'rgba(67, 21, 137, OPACITY)';
        }

        for (let cIdx = 0; cIdx < clusterCount; cIdx++) {
          const cluster = nebulaClusters[cIdx];
          const originalIndex = cluster.originalIndex;
          
          // Calculate dynamic fading opacity factor for clusters under eco/ultra mode
          let modeOpacityMultiplier = 1.0;
          if (originalIndex >= 4) {
            modeOpacityMultiplier = Math.max(0, 1.0 - ecoTransition);
          } else {
            modeOpacityMultiplier = Math.max(0, 1.0 - ultraTransition);
          }
          if (modeOpacityMultiplier <= 0.005) {
            // Bypass rendering if fully transparent/deactivated under eco/ultra mode
            continue;
          }

          // Push gaseous cluster Z forward based on interactive warp calculations
          cluster.z -= 0.00038 * speedSetting * currentWarp.current;
          cluster.rot += cluster.rotSpeed;

          // Wrap seamlessly
          if (cluster.z <= 0.005) {
            cluster.z = 1.0;
            cluster.rot = Math.random() * Math.PI * 2;
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.15 + Math.random() * 0.35;
            cluster.x = Math.cos(angle) * radius;
            cluster.y = Math.sin(angle) * radius * 0.8;
          }

          // Tri-interval opacity tracking envelope for seamless deep loop
          let clusterOpacity = 0;
          if (cluster.z > 0.72) {
            clusterOpacity = (1.0 - cluster.z) / 0.28; // progressive background entry haze
          } else if (cluster.z < 0.28) {
            clusterOpacity = cluster.z / 0.28; // smooth cinematic dodge as it exits screen bounds
          } else {
            clusterOpacity = 1.0;
          }

          // Depth-dependent scroll parallax offset (closer clusters move more, deeper clusters move less)
          const nebulaLookX = swayX + (scrollRef.current * 0.12 * (1.4 - cluster.z));
          const nebulaLookY = swayY - (scrollRef.current * 0.38 * (1.6 - cluster.z));

          const screenFactor = (width + height) * 0.5;
          const cx = width / 2 + (cluster.x + nebulaLookX) * screenFactor / (cluster.z + 0.12);
          const cy = height / 2 + (cluster.y + nebulaLookY) * screenFactor / (cluster.z + 0.12);

          // Visual radius of the overall gaseous corridor
          const visualClusterSize = (cluster.baseSize * screenFactor * 0.58 * breathingSize) / (cluster.z + 0.15);

          let clusterCoreColor = activeCoreColor;
          let clusterGlowColor = activeGlowColor;

          if (currentPalette === 'dynamic') {
            const palette = PALETTES[cluster.paletteIndex];
            clusterCoreColor = palette.core;
            clusterGlowColor = palette.glow;
          }

          // Draw individual volumetric sub-blobs inside the cluster using standard loop to prevent allocations
          const blobsCount = cluster.blobs.length;
          for (let blobIdx = 0; blobIdx < blobsCount; blobIdx++) {
            const blob = cluster.blobs[blobIdx];
            let blobOpacityFactor = modeOpacityMultiplier;
            if (blobIdx >= 3) {
              blobOpacityFactor = Math.min(blobOpacityFactor, Math.max(0, 1.0 - ecoTransition));
            }
            if (blobOpacityFactor <= 0.005) continue;

            blob.angle += blob.speed;

            // Rotate inner blob coordinates around cluster core
            const cos = Math.cos(cluster.rot + blob.angle);
            const sin = Math.sin(cluster.rot + blob.angle);

            let bx = cx + (blob.dx * cos - blob.dy * sin) * visualClusterSize;
            let by = cy + (blob.dx * sin + blob.dy * cos) * visualClusterSize;

            // Einstein visual lensing of nebula cloud fields in Hybrid Core mode!
            // Bypass equations dynamically under Eco Mode to avoid heavy mathematical iterations
            if (currentMode === 'hybrid' && ecoTransition < 0.95) {
              const dNebX = bx - bhX;
              const dNebY = by - bhY;
              const nebDist = Math.sqrt(dNebX * dNebX + dNebY * dNebY);
              
              if (nebDist < 500 && nebDist > 10) {
                const deflection = (R * R * 4.4) * (1.0 - ecoTransition) / (nebDist + 15);
                bx += (dNebX / nebDist) * deflection;
                by += (dNebY / nebDist) * deflection;
              }
            }

            const blobSize = visualClusterSize * blob.sizeRatio * 0.85;

            // Perform boundary clip for background efficiency
            if (bx < -blobSize || bx > width + blobSize || by < -blobSize || by > height + blobSize) continue;

            const calculatedOpacity = clusterOpacity * blob.opacityRatio * 0.23 * breathingIntensity * blobOpacityFactor; // soft glow factor, never clutters text

            ctx.globalAlpha = Math.max(0, Math.min(1, calculatedOpacity));

            // Map current palette selection to the pre-rendered canvas index
            const paletteIndex = currentPalette === 'dynamic' ? cluster.paletteIndex : 
                                 currentPalette === 'solar' ? 0 :
                                 currentPalette === 'cyan' ? 1 :
                                 currentPalette === 'violet' ? 2 : 3;

            ctx.drawImage(
              offscreenCanvases[paletteIndex],
              bx - blobSize,
              by - blobSize,
              blobSize * 2,
              blobSize * 2
            );
          }
        }
        ctx.globalAlpha = 1.0; // Restore default opacity
      }

      // 4. Render Singularity Horizon Accretion & Ocean Waves (Only for Singularity & Hybrid Views)
      if (currentMode === 'singularity' || currentMode === 'hybrid') {
        // Draw Einstein Ring of warped bright orange lensing photons
        ctx.strokeStyle = 'rgba(255, 226, 192, 0.85)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(bhX, bhY, R * 0.96, 0, Math.PI * 2);
        ctx.stroke();

        const ringShadowBlur = Math.round(18 * (1.0 - ecoTransition));
        if (ringShadowBlur > 0 && perfModeRef.current === 'professional') {
          // Layered strokes emulate beautiful shadow glow with massive hardware acceleration
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.16)';
          ctx.lineWidth = 5.5;
          ctx.beginPath();
          ctx.arc(bhX, bhY, R * 0.96, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.28)';
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          ctx.arc(bhX, bhY, R * 0.96, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw deep core event horizon shadow void
        ctx.fillStyle = '#010103';
        ctx.beginPath();
        ctx.arc(bhX, bhY, R * 0.94, 0, Math.PI * 2);
        ctx.fill();

        // Beautiful flat accretion disk belt running across
        const beltGrad = ctx.createLinearGradient(bhX - R * 4.6, bhY, bhX + R * 4.6, bhY);
        beltGrad.addColorStop(0, 'rgba(14, 165, 233, 0)');
        beltGrad.addColorStop(0.24, 'rgba(124, 58, 237, 0.32)');
        beltGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
        beltGrad.addColorStop(0.76, 'rgba(244, 114, 182, 0.32)');
        beltGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.strokeStyle = beltGrad;
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.moveTo(bhX - R * 4.4, bhY);
        ctx.bezierCurveTo(bhX - R * 1.8, bhY + R * 0.28, bhX + R * 1.8, bhY + R * 0.28, bhX + R * 4.4, bhY);
        ctx.stroke();

        const beltShadowBlur = Math.round(28 * (1.0 - ecoTransition));
        if (beltShadowBlur > 0 && perfModeRef.current === 'professional') {
          ctx.strokeStyle = 'rgba(167, 139, 250, 0.12)';
          ctx.lineWidth = 9.0;
          ctx.beginPath();
          ctx.moveTo(bhX - R * 4.4, bhY);
          ctx.bezierCurveTo(bhX - R * 1.8, bhY + R * 0.28, bhX + R * 1.8, bhY + R * 0.28, bhX + R * 4.4, bhY);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(167, 139, 250, 0.24)';
          ctx.lineWidth = 5.5;
          ctx.beginPath();
          ctx.moveTo(bhX - R * 4.4, bhY);
          ctx.bezierCurveTo(bhX - R * 1.8, bhY + R * 0.28, bhX + R * 1.8, bhY + R * 0.28, bhX + R * 4.4, bhY);
          ctx.stroke();
        }

        // MILLER'S COGNITIVE OCEAN WAVES LAYER RENDERERS
        // Smoothly interpolate wave resolution and fade extra waves to preserve high performance silently
        if (ultraTransition < 0.99) {
          const waveStep = Math.round(15 + 45 * ecoTransition + 120 * ultraTransition);
          const waveScale = (1.1 + scrollRef.current * 1.6) * (1.0 - ultraTransition * 1.0);

          for (let wIdx = 0; wIdx < 4; wIdx++) {
            const wave = OCEAN_WAVE_PRESETS[wIdx];
            let waveAlphaFactor = 1.0;
            if (wIdx >= 2) {
              waveAlphaFactor = Math.max(0, 1.0 - ecoTransition);
            }
            // Ultra Mode: also fade out the remaining first two waves smoothly
            waveAlphaFactor *= Math.max(0, 1.0 - ultraTransition);
            if (waveAlphaFactor <= 0.005) continue; // bypass completely when invisible

            ctx.save();
            ctx.globalAlpha = waveAlphaFactor;

            const calculatedBaseY = height - wave.yOffset + (wIdx * 25) - (scrollRef.current * 110);
            ctx.fillStyle = wave.c;
            ctx.beginPath();
            ctx.moveTo(0, height);

            for (let x = 0; x <= width; x += waveStep) {
              const angle1 = (x * wave.freq) + (frame * wave.speed);
              const angle2 = (x * 0.009) - (frame * 0.007);
              
              const y = calculatedBaseY + 
                        Math.sin(angle1) * wave.amp * waveScale + 
                        Math.cos(angle2) * (wave.amp * 0.25) * waveScale;

              ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();

            // Wave sharp horizon lines
            ctx.strokeStyle = wave.h;
            ctx.lineWidth = 1.6 + wIdx * 0.4;
            ctx.beginPath();
            for (let x = 0; x <= width; x += waveStep) {
              const angle1 = (x * wave.freq) + (frame * wave.speed);
              const angle2 = (x * 0.009) - (frame * 0.007);
              const y = calculatedBaseY + 
                        Math.sin(angle1) * wave.amp * waveScale + 
                        Math.cos(angle2) * (wave.amp * 0.25) * waveScale;

              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 5. Cinematic Widescreen Lighting & Anamorphic Center Flares (Bypassed under Eco Preset to preserve fill rate)
      if (ecoTransition < 0.95) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1.0 - ecoTransition);
        
        // Deep corridor color ambient bleed overlay
        const bleedGlow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.65);
        bleedGlow.addColorStop(0, 'rgba(147, 51, 234, 0.09)'); // regal violet space light core
        bleedGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.03)');
        bleedGlow.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = bleedGlow;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.max(width, height) * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // Soft center core star background burst
        const coreStarGlow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 70);
        coreStarGlow.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
        coreStarGlow.addColorStop(0.5, 'rgba(34, 211, 238, 0.09)');
        coreStarGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreStarGlow;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2);
        ctx.fill();

        // Widescreen thin Horizontal Anamorphic Flare
        const flareGrad = ctx.createLinearGradient(0, height / 2, width, height / 2);
        flareGrad.addColorStop(0, 'rgba(34, 211, 238, 0)');
        flareGrad.addColorStop(0.42, 'rgba(147, 51, 234, 0.07)');
        flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)'); // central bright lighting beam
        flareGrad.addColorStop(0.58, 'rgba(34, 211, 238, 0.07)');
        flareGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, height / 2 - 1.2, width, 2.4);
        ctx.restore();
      }

      // Restore normal source-over rendering state
      ctx.globalCompositeOperation = 'source-over';

      // Save look coordinates for subsequent frame differentials
      prevLookX = lookX;
      prevLookY = lookY;

      if (isLoopRunning) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      cancelAnimationFrame(animFrameId);
      window.dispatchEvent(new CustomEvent('fps-update', { detail: null }));
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 transform-gpu will-change-transform" />
    </>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Evolution', href: '#evolution' },
    { name: 'Skills', href: '#skills' },
    { name: 'DSA', href: '#dsa' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isMobileMenuOpen) {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      window.dispatchEvent(new CustomEvent('nav-section-click', { detail: { sectionId: targetId } }));
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(el, { offset: -40, duration: 1.2 });
      } else {
        const rect = el.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        window.scrollTo({
          top: absoluteTop - 40,
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none p-0">
        <div 
          style={{
            transitionProperty: "transform, width, max-width, border-radius, background-color, border-color, padding, box-shadow, backdrop-filter, -webkit-backdrop-filter",
            transitionDuration: "700ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transform: `translate3d(0, ${isScrolled ? "12px" : "0px"}, 0)`,
            maxWidth: isScrolled ? "1280px" : "100vw",
            willChange: "transform, width, max-width, background-color, border-radius, backdrop-filter",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
          className={cn(
            "w-full border pointer-events-auto",
            isScrolled 
              ? "w-[94%] min-[400px]:w-[92%] lg:w-[90%] xl:w-[86%] rounded-full bg-[#0a0d14]/60 backdrop-blur-md border-white/[0.08] px-3 sm:px-4 py-2 sm:py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:border-white/[0.12] lg:px-8 lg:py-3.5" 
              : "w-full rounded-none bg-transparent border-transparent backdrop-blur-none px-4 py-4 sm:px-6 lg:px-12 lg:py-6 shadow-none"
          )}
        >
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <motion.a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (isMobileMenuOpen) {
                document.body.style.overflow = '';
                if ((window as any).lenis) {
                  (window as any).lenis.start();
                }
                setIsMobileMenuOpen(false);
              }
              window.dispatchEvent(new CustomEvent('nav-section-click', { detail: { sectionId: 'hero' } }));
              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(0, { duration: 1.2 });
              } else {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }
            }}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg sm:text-xl font-bold tracking-tighter flex items-center gap-2 sm:gap-3 group"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-visible group-hover:scale-110 transition-transform duration-500 shrink-0">
              <svg 
                className="w-full h-full select-none pointer-events-none drop-shadow-[0_0_12px_rgba(56,189,248,0.45)]" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                id="ap-logo"
              >
                <defs>
                  <linearGradient id="apLogoGrad" x1="0%" y1="30%" x2="100%" y2="70%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                  <filter id="apGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background Glass Glowing Layer (replicates the colorful volumetric halo) */}
                <g opacity="0.5" filter="url(#apGlow)">
                  {/* Slanted left leg of 'A' */}
                  <path 
                    d="M 22 72 L 54 26" 
                    stroke="url(#apLogoGrad)" 
                    strokeWidth="11" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  {/* Shared central vertical stem */}
                  <path 
                    d="M 54 26 L 54 72" 
                    stroke="url(#apLogoGrad)" 
                    strokeWidth="11" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  {/* Crossbar of 'A' */}
                  <path 
                    d="M 37 50 L 54 50" 
                    stroke="url(#apLogoGrad)" 
                    strokeWidth="11" 
                    strokeLinecap="round"
                  />
                  {/* Loop of 'P' */}
                  <path 
                    d="M 54 26 C 68 26, 78 32, 78 38 C 78 44, 68 50, 54 50" 
                    stroke="url(#apLogoGrad)" 
                    strokeWidth="11" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Crisp Foreground White 'AP' Layer */}
                <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  {/* Left slanted leg of A */}
                  <path d="M 22 72 L 54 26" />
                  {/* Shared vertical stem */}
                  <path d="M 54 26 L 54 72" />
                  {/* Crossbar of A */}
                  <path d="M 37 50 L 54 50" />
                  {/* Loop of P */}
                  <path d="M 54 26 C 68 26, 78 32, 78 38 C 78 44, 68 50, 54 50" />
                </g>

                {/* Sparkling Stars matching exactly the uploaded logo coordinates */}
                {/* Bottom Left Sparkle */}
                <g className="animate-[pulse_1.5s_infinite_alternate]" style={{ transformOrigin: "22px 72px" }}>
                  <circle cx="22" cy="72" r="4" fill="#38bdf8" opacity="0.35" filter="url(#apGlow)" />
                  <path d="M 22 65 L 22 79 M 15 72 L 29 72" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                </g>
                
                {/* Top Apex Sparkle */}
                <g className="animate-[pulse_1.2s_infinite_alternate]" style={{ transformOrigin: "54px 26px" }}>
                  <circle cx="54" cy="26" r="4" fill="#c084fc" opacity="0.35" filter="url(#apGlow)" />
                  <path d="M 54 19 L 54 33 M 47 26 L 61 26" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                </g>

                {/* Right Bowl Sparkle */}
                <g className="animate-[pulse_1.8s_infinite_alternate]" style={{ transformOrigin: "78px 38px" }}>
                  <circle cx="78" cy="38" r="4" fill="#f472b6" opacity="0.35" filter="url(#apGlow)" />
                  <path d="M 78 31 L 78 45 M 71 38 L 85 38" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                </g>

                {/* Bottom Right Stem Sparkle */}
                <g className="animate-[pulse_2s_infinite_alternate]" style={{ transformOrigin: "54px 72px" }}>
                  <circle cx="54" cy="72" r="4" fill="#a78bfa" opacity="0.35" filter="url(#apGlow)" />
                  <path d="M 54 65 L 54 79 M 47 72 L 61 72" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <span 
              className="hidden min-[360px]:inline-block tracking-[0.16em] sm:tracking-[0.25em] font-mono text-[9px] min-[400px]:text-[10px] sm:text-[11px] text-white/90"
            >
              ABHRADEEP PAL
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 22, 
                  delay: i * 0.05 
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -1, 
                  color: "#ffffff" 
                }}
                whileTap={{ scale: 0.95 }}
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/55 relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
            <motion.a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, '#contact')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(255,255,255,0.15)",
                backgroundColor: "rgba(255, 255, 255, 1)",
                color: "#000000"
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="px-5 py-2 glass-card border border-white/10 transition-colors duration-300 tracking-wider font-mono text-[9px] rounded-lg text-center flex items-center justify-center uppercase"
            >
              GET IN TOUCH
            </motion.a>
          </div>

          {/* Right Action buttons for Mobile/Tablet */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* GET IN TOUCH button inside the pill for tablet devices in portrait/landscape mode */}
            <motion.a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, '#contact')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(255,255,255,0.15)",
                backgroundColor: "rgba(255, 255, 255, 1)",
                color: "#000000"
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="hidden sm:inline-flex lg:hidden px-4 py-2 bg-white/[0.08] hover:bg-white border border-white/10 text-white hover:text-black transition-colors duration-300 tracking-wider font-mono text-[9px] rounded-lg text-center items-center justify-center uppercase shrink-0"
            >
              GET IN TOUCH
            </motion.a>

            {/* Mobile Toggle Button with high-contrast, larger size, clear outline */}
            <button 
              className="lg:hidden text-white hover:text-cyan-400 w-10 h-10 flex items-center justify-center bg-white/[0.08] border border-white/[0.12] rounded-full focus:outline-none hover:bg-white/[0.14] active:scale-90 transition-colors shrink-0 shadow-lg shadow-black/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Backdrop Blur Overlay: Fades in background behind mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[51] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Fixed Screen-Level Dropdown Menu (Guaranteed never to clip under floating pill boundary animations) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -12, scale: 0.98, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -12, scale: 0.98, x: "-50%" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="fixed top-[74px] left-1/2 w-[94%] min-[400px]:w-[92%] max-h-[75vh] overflow-y-auto bg-neutral-950/95 backdrop-blur-3xl border border-white/[0.12] p-5.5 sm:p-6 lg:hidden flex flex-col gap-3 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_1.5px_rgba(255,255,255,0.15)] rounded-[24px] font-mono text-center z-[52] scrollbar-thin scrollbar-thumb-white/10"
          >
            {navLinks.map((link, idx) => (
              <motion.a 
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                key={link.name} 
                href={link.href}
                className="text-xs uppercase tracking-[0.16em] text-white/85 hover:text-white py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.05] rounded-[14px] transition-all font-medium"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.a 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.04 + 0.05 }}
              href="#contact" 
              className="mt-2.5 text-center px-5 py-4 bg-white text-black hover:bg-neutral-100 border border-white/10 transition-all duration-300 tracking-[0.16em] font-mono text-[10px] font-extrabold rounded-[14px] uppercase shadow-lg shadow-white/5 active:scale-[0.98]"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              GET IN TOUCH
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Section = ({ id, title, subtitle, children, className }: { id: string, title: string, subtitle?: string, children: React.ReactNode, className?: string }) => {
  const sectionRef = useRef(null);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionId: string }>;
      if (customEvent.detail && customEvent.detail.sectionId === id) {
        setPulseActive(true);
        clearTimeout(timer);
        timer = setTimeout(() => setPulseActive(false), 2000);
      }
    };
    window.addEventListener('nav-section-click', handleNavClick);
    return () => {
      window.removeEventListener('nav-section-click', handleNavClick);
      clearTimeout(timer);
    };
  }, [id]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [45, -45]);
  const contentY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <section id={id} ref={sectionRef} className={cn("py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden transition-all duration-1000", className)}>
      {/* Gentle, glowing parallax backing node 1 (Bottom Right) */}
      <motion.div 
        style={{ y: bgY }}
        animate={{
          scale: pulseActive ? [1, 1.3, 1] : 1,
          opacity: pulseActive ? [0.35, 0.8, 0.35] : 0.35,
          backgroundColor: pulseActive ? "rgba(34, 211, 238, 0.15)" : "rgba(59, 130, 246, 0.05)"
        }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        className="absolute -right-48 -bottom-48 w-96 h-96 rounded-full blur-[90px] pointer-events-none" 
      />

      {/* Gentle, glowing parallax backing node 2 (Top Left) */}
      <motion.div 
        style={{ y: bgY2 }}
        animate={{
          opacity: pulseActive ? [0.25, 0.65, 0.25] : 0.25,
          backgroundColor: pulseActive ? "rgba(192, 132, 252, 0.12)" : "rgba(168, 85, 247, 0.03)"
        }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        className="absolute -left-48 -top-48 w-96 h-96 rounded-full blur-[90px] pointer-events-none" 
      />

      {/* Dynamic left border beam trace on click */}
      <motion.div
        animate={{
          opacity: pulseActive ? [0, 0.85, 0] : 0,
          scaleY: pulseActive ? [0.1, 1, 0.1] : 0.1,
        }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 pointer-events-none origin-top"
      />

      <motion.div style={{ y: contentY }} className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16 section-header"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div 
              animate={{
                width: pulseActive ? [40, 120, 40] : 40,
                backgroundColor: pulseActive ? ["#06b6d4", "#ec4899", "#3b82f6"] : "#3b82f6"
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-[1px] w-10 bg-blue-500" 
            />
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-blue-400">{id}</span>
          </div>
          <motion.h2 
            animate={{
              textShadow: pulseActive ? ["0px 0px 0px rgba(34,211,238,0)", "0px 0px 25px rgba(34,211,238,0.75)", "0px 0px 0px rgba(34,211,238,0)"] : "0px 0px 0px rgba(34,211,238,0)"
            }}
            transition={{ duration: 1.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4 sm:mb-5"
          >
            {title}
          </motion.h2>
          {subtitle && <p className="text-white/45 max-w-2xl text-xs sm:text-sm md:text-base font-light leading-relaxed">{subtitle}</p>}
        </motion.div>
        
        <div className="section-content">
          <motion.div
            animate={pulseActive ? {
              y: [0, -10, 0],
              scale: [1, 1.012, 1],
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// --- Custom Interactive Visual Diagrams inside Project Cards ---

const ProjectVisual = ({ title }: { title: string }) => {
  const [radarAngle, setRadarAngle] = useState(0);
  const [telemetryVal, setTelemetryVal] = useState(74);

  useEffect(() => {
    if (title.toLowerCase().includes("radar")) {
      let angle = 0;
      const interval = setInterval(() => {
        angle = (angle + 1.5) % 360;
        setRadarAngle(angle);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [title]);

  useEffect(() => {
    if (title.toLowerCase().includes("aquasense")) {
      const interval = setInterval(() => {
        setTelemetryVal(prev => {
          const change = Math.random() * 6 - 3;
          return Math.max(50, Math.min(95, parseFloat((prev + change).toFixed(1))));
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [title]);

  if (title.toLowerCase().includes("plant")) {
    return (
      <div className="mt-6 p-4 bg-black/45 border border-white/5 rounded-2xl font-mono text-[9px] text-white/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 text-blue-400 gap-1">
          <span className="truncate">PIPELINE: EFFICIENTNET-B0</span>
          <span className="text-emerald-400 font-bold tracking-widest text-[8px] whitespace-nowrap">● LIVE INFERENCE</span>
        </div>
        <div className="flex items-center gap-3 py-1">
          <div className="w-[60px] sm:w-[70px] h-[50px] border border-dashed border-white/10 rounded flex flex-col justify-center items-center shrink-0">
            <span className="text-[7px] text-white/20">INPUT</span>
            <span className="text-blue-400 font-bold text-[7.5px] truncate max-w-full">LEAF.PNG</span>
          </div>
          <ArrowRight size={10} className="text-white/20 shrink-0" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex justify-between text-[7px] gap-1">
              <span className="truncate">[L0] CONV MB-CONV</span>
              <span className="text-blue-400 shrink-0">112x112x32</span>
            </div>
            <div className="h-1 bg-white/5 rounded overflow-hidden">
              <div className="h-full w-full bg-blue-500 animate-[pulse_2s_infinite]" />
            </div>
            <div className="flex justify-between text-[7px] gap-1">
              <span className="truncate">[L16] GAP + SOFTMAX</span>
              <span className="text-purple-400 font-bold shrink-0">BATCH: 1</span>
            </div>
            <div className="h-1 bg-white/5 rounded overflow-hidden">
              <div className="h-full w-5/6 bg-purple-500" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-white/5 text-center">
          <div className="bg-white/5 p-1 sm:p-1.5 rounded">
            <span className="text-white/20 block text-[7px]">ACCURACY</span>
            <span className="text-emerald-400 font-bold text-[10px] sm:text-xs">94.2%</span>
          </div>
          <div className="bg-white/5 p-1 sm:p-1.5 rounded">
            <span className="text-white/20 block text-[7px]">LATENCY</span>
            <span className="text-yellow-400 font-bold text-[10px] sm:text-xs">45ms</span>
          </div>
          <div className="bg-white/5 p-1 sm:p-1.5 rounded">
            <span className="text-white/20 block text-[7px]">TOP-1 ACC</span>
            <span className="text-blue-400 font-bold text-[10px] sm:text-xs">91.4%</span>
          </div>
        </div>
      </div>
    );
  }

  if (title.toLowerCase().includes("wardrobe")) {
    return (
      <div className="mt-6 p-4 bg-black/45 border border-white/5 rounded-2xl font-mono text-[9px] text-white/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 text-purple-400 gap-1">
          <span className="truncate">SCHEMATIC: STATE AUTOMATION</span>
          <span className="text-purple-400 animate-pulse whitespace-nowrap">● PAT_PENDING</span>
        </div>
        <div className="flex flex-row items-center justify-between gap-1 text-center text-[7px] sm:text-[7.5px] overflow-x-auto pb-1">
          <div className="bg-white/5 p-1 sm:p-1.5 rounded flex-1 border border-white/5 min-w-[50px]">
            <span className="text-blue-400 font-bold block mb-0.5 whitespace-nowrap">RFID</span>
            <span className="text-white/20 text-[6.5px]">[SENSING]</span>
          </div>
          <ArrowRight size={8} className="text-white/20 shrink-0" />
          <div className="bg-white/10 p-1 sm:p-1.5 rounded flex-1 border border-purple-500/30 min-w-[50px]">
            <span className="text-white font-bold block mb-0.5 whitespace-nowrap">ESP32</span>
            <span className="text-purple-400 text-[6.5px]">[AUTO]</span>
          </div>
          <ArrowRight size={8} className="text-white/20 shrink-0" />
          <div className="bg-white/5 p-1 sm:p-1.5 rounded flex-1 border border-white/5 min-w-[50px]">
            <span className="text-cyan-400 font-bold block mb-0.5 whitespace-nowrap">ACT</span>
            <span className="text-white/20 text-[6.5px]">[DISPATCH]</span>
          </div>
        </div>
        <div className="bg-white/5 p-1.5 sm:p-2 rounded-lg border border-white/5 flex justify-between items-center text-[7px] sm:text-[7.5px]">
          <span>STATE TRANSLATION SYSTEM</span>
          <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded uppercase font-semibold text-[6.5px] sm:text-[7.5px]">ACTIVE LOGIC</span>
        </div>
      </div>
    );
  }

  if (title.toLowerCase().includes("aquasense")) {
    return (
      <div className="mt-6 p-4 bg-black/45 border border-white/5 rounded-2xl font-mono text-[9px] text-white/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 text-blue-400 gap-1">
          <span className="truncate">TELEMETRY STREAM: UBIDOTS</span>
          <span className="text-cyan-400 font-bold animate-[pulse_1s_infinite] whitespace-nowrap">● TRANSMITTING</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[7px]">
            <span>TELEMETRY METRICS</span>
            <span className="text-blue-400 font-bold">{telemetryVal}%</span>
          </div>
          <div className="h-10 w-full bg-blue-950/15 rounded flex items-end gap-[1px] sm:gap-[2px] p-1 border border-white/5 overflow-hidden">
            {[42, 48, 55, 43, 64, 52, 60, 68, 77, 85, 71, 62, 75, 81, telemetryVal].map((val, idx) => {
              return (
                <div 
                  key={idx} 
                  className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-[1px] w-full transition-all duration-300" 
                  style={{ height: `${val}%` }} 
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-between text-[7px] sm:text-[7.5px] text-white/25">
          <span>INT: 200MS</span>
          <span>WIFI: CONNECTED</span>
        </div>
      </div>
    );
  }

  if (title.toLowerCase().includes("radar")) {
    return (
      <div className="mt-6 p-4 bg-black/45 border border-white/5 rounded-2xl font-mono text-[9px] text-white/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 text-cyan-400 gap-1">
          <span className="truncate">RADIAL SWEEP VISUALIZER</span>
          <span className="text-cyan-400 font-bold animate-pulse whitespace-nowrap">● SCANNING 360°</span>
        </div>
        <div className="relative h-20 bg-cyan-950/5 rounded-xl overflow-hidden border border-cyan-500/10 flex items-center justify-center">
          <div className="absolute w-16 h-16 border border-dashed border-cyan-500/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-8 h-8 border border-dashed border-cyan-500/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div 
            className="absolute origin-right w-[40px] h-0.5 bg-gradient-to-r from-transparent to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] top-1/2 -mt-[1px]"
            style={{ 
              transform: `rotate(${radarAngle}deg)`,
              left: 'calc(50% - 40px)'
            }}
          />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-red-500 rounded-full animate-ping" />
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full" />
          <span className="absolute bottom-1 right-2 text-[6px] sm:text-[6.5px] text-red-500 font-bold bg-black/60 px-1 py-0.5 rounded">OBSTACLE: 14.5CM</span>
        </div>
        <div className="flex justify-between text-[7px] text-white/25">
          <span>SERVO ROT: 50HZ</span>
          <span>STEP VECTOR: 1°</span>
        </div>
      </div>
    );
  }

  if (title.toLowerCase().includes("algorithmic")) {
    return (
      <div className="mt-6 p-4 bg-black/45 border border-white/5 rounded-2xl font-mono text-[9px] text-white/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 text-white/40 gap-1">
          <span className="truncate">ALGORITHMIC RUNTIME PROFILES</span>
          <span className="text-yellow-400 font-semibold text-[8px] whitespace-nowrap">C++ CONTEXT</span>
        </div>
        <div className="space-y-2 font-mono text-[7.5px] sm:text-[8px] leading-normal">
          <div className="flex gap-1">
            <span className="text-blue-400">#include</span>
            <span>&lt;vector&gt;</span>
          </div>
          <div className="bg-white/5 p-1.5 rounded text-white/30 space-y-0.5 text-[7px] sm:text-[7.5px]">
            <div><span className="text-purple-400">template</span> &lt;<span className="text-purple-400">typename</span> T&gt;</div>
            <div><span className="text-purple-400">void</span> optimize(Node* h) &#123;</div>
            <div className="pl-2">if (!h) return;</div>
            <div>&#125;</div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-center text-[7px] sm:text-[7.5px] pt-0.5">
            <div className="bg-white/5 py-1 rounded text-emerald-400 font-bold">TIME: O(log N)</div>
            <div className="bg-white/5 py-1 rounded text-blue-400 font-bold">SPACE: O(1)</div>
          </div>
        </div>
      </div>
    );
  }

  if (title.toLowerCase().includes("line following")) {
    return (
      <div className="mt-6 p-4 bg-black/45 border border-white/5 rounded-2xl font-mono text-[9px] text-white/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 text-amber-500 gap-1">
          <span className="truncate">PD FEEDBACK LOOP REGISTERS</span>
          <span className="text-emerald-400 font-bold whitespace-nowrap">● SPEED LOCKED</span>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap justify-center gap-1.5 items-center text-[7px] sm:text-[7.5px]">
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-amber-400 rounded">L: [1]</span>
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-emerald-400 rounded">C: [0]</span>
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-amber-400 rounded">R: [1]</span>
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/5 text-[7px] sm:text-[7.5px] text-center text-white/30">
            <div className="text-white font-bold mb-0.5">Output = Kp*e + Kd*de/dt</div>
            <div className="truncate">L-Motor: <span className="text-blue-400">180 PWM</span> | R-Motor: <span className="text-blue-400">180 PWM</span></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const ProjectCard = ({ project, index }: { project: typeof PROJECTS[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20px" }}
    transition={{ 
      type: "spring",
      stiffness: 120,
      damping: 18,
      delay: index * 0.04
    }}
    whileHover={{ 
      y: -10, 
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
      transition: { type: "spring", stiffness: 350, damping: 18 }
    }}
    className="group relative glass-card p-6 sm:p-8 md:p-10 rounded-2xl card-glow flex flex-col justify-between h-full"
  >
    {/* Animated Background Gradient on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none" />
    
    <div className="relative z-10 flex-grow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4 mb-6 sm:mb-8">
          <div className="w-11 h-11 sm:w-12 sm:h-12 glass-card rounded-2xl flex items-center justify-center text-white/80 group-hover:scale-105 group-hover:bg-white group-hover:text-black transition-all duration-500 shrink-0">
            <Cpu size={22} className="sm:size-[24px]" />
          </div>
          <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
            {project.tech.map(t => (
              <span key={t} className="text-[7.5px] sm:text-[8px] font-mono uppercase tracking-wider text-white/40 border border-white/5 px-2 py-0.5 rounded-md bg-white/5">
                {t}
              </span>
            ))}
          </div>
        </div>

        <span className="text-[8px] font-mono text-blue-400 uppercase tracking-widest block mb-1.5">{project.focus}</span>
        <h3 className="text-xl sm:text-2xl font-bold mb-2.5 group-hover:text-blue-400 transition-colors duration-500 tracking-tight leading-tight">{project.title}</h3>
        <p className="text-white/45 text-xs leading-relaxed mb-5 font-light">
          {project.description}
        </p>

        <div className="space-y-2 mb-5">
          {project.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px] sm:text-[11px] text-white/35 leading-normal">
              <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* Dynamic Interactive Architectural Graphic Rendering */}
        <ProjectVisual title={project.title} />

        <div className="pt-5 border-t border-white/5 mt-5 flex items-center justify-between text-[9px] sm:text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-white/30 max-w-[80%]">
            <Sparkles size={11} className="text-blue-400 shrink-0" />
            <span className="truncate">Impact: {project.impact}</span>
          </div>
          <motion.a 
            href={PROFILE.actualGithub}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.15, 
              rotate: 45,
              borderColor: 'rgba(96,165,250,0.3)',
              color: '#38bdf8',
              transition: { type: 'spring', stiffness: 450, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 glass-card rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-colors ml-2 shrink-0"
          >
            <ExternalLink size={13} />
          </motion.a>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Mandatory Engineering Evolution Timeline Section ---

const TimelineSection = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 45, damping: 22 });

  const roadmap = [
    {
      semester: "Semester 1",
      title: "Embedded Systems & IoT Foundations",
      theme: "Foundational engineering systems",
      projects: [
        "AquaSense — Smart Water Monitoring & Telemetry System",
        "Autonomous Line Following & Obstacle Avoidance Robot"
      ],
      focus: [
        "ESP32 / MCU architecture",
        "Multi-sensor hardware structures",
        "IoT telemetry primitives",
        "Locomotion & proportional control logic",
        "Arduino IDE & Embedded C/C++"
      ],
      description: "Established fundamental low-level programming routines, real-time sensing feedback loops, and raw telemetry stream transmission pathways.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      semester: "Semester 2",
      title: "AI & Intelligent Monitoring Systems",
      theme: "Advanced intelligent systems engineering",
      projects: [
        "AI-Powered Plant Disease Detection System",
        "Smart Wardrobe System (Patent-Based)",
        "Smart Radar Detection & Telemetry System"
      ],
      focus: [
        "Artificial Intelligence / Neural nets",
        "EfficientNet-B0 transfer learning",
        "Computer Vision & pipeline optimizations",
        "Low-latency firmware automation states",
        "Edge-Cloud telemetry synchronization"
      ],
      description: "Imparted modern model inferences directly at the operational edge, optimizing convolutional neural grids and drafting patented smart mechanics.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <Section id="evolution" title="Engineering Evolution" subtitle="Bridging low-level telemetry systems with edge artificial intelligence over my academic trajectory.">
      <div ref={containerRef} className="relative border-l border-white/5 ml-2.5 sm:ml-4 md:ml-10 pl-5 sm:pl-8 md:pl-16 space-y-12 sm:space-y-16 py-4">
        {/* Scroll-driven growth vertical timeline line */}
        <motion.div 
          style={{ 
            scaleY: springScroll,
            originY: 0
          }}
          className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 pointer-events-none rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
        />
        
        {roadmap.map((milestone, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.15} yOffset={25}>
            <div className="relative">
              {/* Timeline center node that wakes on scroll */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.5 }}
                whileInView={{ scale: 1.1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={cn(
                  "absolute left-0 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 flex items-center justify-center z-10",
                  idx === 0 ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                )}
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  idx === 0 ? "bg-cyan-400" : "bg-purple-400"
                )} />
              </motion.div>

              {/* Content Card layout */}
              <div className="glass-card p-5 sm:p-8 md:p-10 rounded-2xl card-glow hover:border-white/10 transition-colors duration-500">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-white/5 pb-5 sm:pb-6">
                  <div>
                    <span className={cn(
                      "px-3 py-0.5 sm:px-4 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-widest font-bold",
                      idx === 0 ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    )}>
                      {milestone.semester}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight mt-2.5 sm:mt-3 text-white leading-tight">{milestone.title}</h3>
                  </div>
                  <div className="text-left lg:text-right text-[9px] sm:text-[10px] font-mono text-white/30 uppercase tracking-widest shrink-0">
                    <span>THEME: </span>
                    <span className="text-white block font-medium mt-0.5 sm:mt-1">{milestone.theme}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-5">
                    <p className="text-xs sm:text-sm font-light text-white/55 leading-relaxed">
                      {milestone.description}
                    </p>
                    <div>
                      <h4 className="text-[9px] sm:text-[10px] font-mono uppercase text-white/25 tracking-widest mb-3">Core Focus Areas</h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {milestone.focus.map((f, i) => (
                          <span key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/5 border border-white/5 rounded-md text-[8px] sm:text-[9px] font-mono text-white/50">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-white/5 rounded-[1.2rem] sm:rounded-[1.5rem] p-4 sm:p-6 md:p-8 flex flex-col justify-between gap-6">
                    <div>
                      <h4 className="text-[9px] sm:text-[10px] font-mono uppercase text-white/25 tracking-widest mb-3.5">Milestone Projects</h4>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {milestone.projects.map((proj, i) => (
                          <li key={i} className="flex gap-2 items-start text-[11px] sm:text-xs text-white/70 leading-relaxed">
                            <Zap size={10} className={cn("mt-1 shrink-0", idx === 0 ? "text-blue-400" : "text-purple-400")} />
                            <span>{proj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-white/5 mt-4 flex justify-between items-center text-[8px] sm:text-[9px] font-mono">
                      <span className="text-white/20">TRAJECTORY LOG:</span>
                      <span className={cn(
                        "font-semibold uppercase tracking-widest",
                        idx === 0 ? "text-cyan-400" : "text-purple-400"
                      )}>
                        {idx === 0 ? "Hardware Layer Standardized" : "AI Cognitive Layer Stacked"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
};

// --- DSA Progress & Problem Solving Section ---

const parseReadmeData = (readmeText: string, rootDirs: string[] = []) => {
  const lines = readmeText.split("\n");
  let currentTopic = "";
  
  const uniqueProblems = new Set<string>();
  const problemDifficulties = new Map<string, string>();
  const topicProblems = new Map<string, Set<string>>();

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith("## ") || line.startsWith("### ")) {
      currentTopic = line.replace(/^##+\s+/, "").trim();
      if (currentTopic && currentTopic.toLowerCase() !== "leetcode topics" && !topicProblems.has(currentTopic)) {
        topicProblems.set(currentTopic, new Set<string>());
      }
    } else if (currentTopic && currentTopic.toLowerCase() !== "leetcode topics" && line.startsWith("|") && !line.includes("Problem Name") && !line.includes("---")) {
      const parts = line.split("|").map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const linkPart = parts[0];
        const difficultyPart = parts[1];

        const nameMatch = linkPart.match(/\[([^\]]+)\]/);
        if (nameMatch) {
          const problemName = nameMatch[1].trim();
          const rawDiff = difficultyPart.trim();
          const difficulty = rawDiff.charAt(0).toUpperCase() + rawDiff.slice(1).toLowerCase();

          uniqueProblems.add(problemName);
          problemDifficulties.set(problemName, difficulty);

          if (!topicProblems.has(currentTopic)) {
            topicProblems.set(currentTopic, new Set<string>());
          }
          topicProblems.get(currentTopic)!.add(problemName);
        }
      }
    }
  }

  const totalSolved = uniqueProblems.size;

  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  problemDifficulties.forEach((diff) => {
    if (diff === "Easy") easyCount++;
    else if (diff === "Medium") mediumCount++;
    else if (diff === "Hard") hardCount++;
  });

  const parsedTopics: any[] = [];
  topicProblems.forEach((problemsSet, topicName) => {
    if (problemsSet.size > 0) {
      const topicEasy = Array.from(problemsSet).filter(p => problemDifficulties.get(p) === "Easy").length;
      const topicMedium = Array.from(problemsSet).filter(p => problemDifficulties.get(p) === "Medium").length;
      const topicHard = Array.from(problemsSet).filter(p => problemDifficulties.get(p) === "Hard").length;

      parsedTopics.push({
        name: topicName,
        count: problemsSet.size,
        problems: Array.from(problemsSet),
        easyCount: topicEasy,
        mediumCount: topicMedium,
        hardCount: topicHard
      });
    }
  });

  // Determine latest solved problem
  let latestProblem = "1051-height-checker";
  let latestDifficulty = "Easy";
  if (rootDirs.length > 0) {
    const sortedDirs = [...rootDirs].sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/^\d+/)?.[0] || "0", 10);
      return numB - numA;
    });
    latestProblem = sortedDirs[0];
    latestDifficulty = problemDifficulties.get(latestProblem) || "Easy";
  } else if (uniqueProblems.size > 0) {
    const sortedProbs = Array.from(uniqueProblems).sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/^\d+/)?.[0] || "0", 10);
      return numB - numA;
    });
    latestProblem = sortedProbs[0];
    latestDifficulty = problemDifficulties.get(latestProblem) || "Easy";
  }

  return {
    totalSolved,
    difficultyBreakdown: {
      Easy: easyCount,
      Medium: mediumCount,
      Hard: hardCount
    },
    topics: parsedTopics,
    latestProblem,
    latestDifficulty,
    lastUpdated: new Date().toISOString(),
    latestSolvedAt: new Date().toISOString(),
    isFallback: false
  };
};

const getDynamicMilestones = (solved: number, currentTarget: number) => {
  const milestones = [
    { target: 25, name: "Starter" },
    { target: 50, name: "Consistent" },
    { target: 100, name: "Centurion" },
    { target: 150, name: "Elite" },
    { target: 250, name: "Master" },
    { target: 500, name: "Grandmaster" },
    { target: 1000, name: "Legend" },
    { target: 2000, name: "Mythic" },
    { target: 4000, name: "Infinite" }
  ];
  
  let lastTarget = 4000;
  while (lastTarget < currentTarget || lastTarget <= solved) {
    lastTarget = lastTarget * 2;
    milestones.push({
      target: lastTarget,
      name: `Infinite Tier ${Math.floor(Math.log2(lastTarget / 4000)) + 1}`
    });
  }
  
  return milestones;
};

const getCompletionDateForTarget = (target: number, totalSolved: number, lastUpdatedISO: string) => {
  if (totalSolved < target) return null;
  try {
    const lastUpdated = new Date(lastUpdatedISO);
    const diff = totalSolved - target;
    const daysAgo = diff * 1.2;
    const milestoneDate = new Date(lastUpdated.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return milestoneDate.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const DSAProgressSection = () => {
  const [data, setData] = useState<{
    totalSolved: number;
    difficultyBreakdown: {
      Easy: number;
      Medium: number;
      Hard: number;
    };
    topics: Array<{
      name: string;
      count: number;
      problems: string[];
      easyCount: number;
      mediumCount: number;
      hardCount: number;
    }>;
    latestProblem: string;
    latestDifficulty: string | null;
    lastUpdated: string;
    latestSolvedAt: string;
    isFallback: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [centerHovered, setCenterHovered] = useState(false);
  const [chartScale, setChartScale] = useState(1);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const baseWidth = 520;
        let scale = width / baseWidth;
        if (scale > 1) scale = 1;
        if (scale < 0.72) scale = 0.72;
        setChartScale(scale);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    const fetchWithRetry = async (attempt: number = 1): Promise<any> => {
      // Step 1: Try fetching from the server-side proxy endpoint first to respect caching and bypass rate-limiting
      try {
        console.log(`[DSA fetch] Attempt ${attempt}: Trying server-side proxy /api/dsa-progress...`);
        const proxyRes = await fetch('/api/dsa-progress');
        if (proxyRes.ok) {
          const json = await proxyRes.json();
          if (json && !json.error && json.totalSolved > 0) {
            console.log("[DSA fetch] Successfully fetched progress via server proxy:", json);
            return json;
          }
        }
      } catch (proxyErr) {
        console.warn(`[DSA fetch] Server proxy attempt ${attempt} failed:`, proxyErr);
      }

      // Step 2: If proxy fails or returns unconfigured state, try fetching directly from raw README + Contents API
      try {
        console.log(`[DSA fetch] Attempt ${attempt}: Falling back to direct raw README parsing...`);
        const readmeRes = await fetch("https://raw.githubusercontent.com/palabhradeep635-star/lchub/main/README.md");
        if (!readmeRes.ok) {
          throw new Error(`Direct raw README fetch returned status ${readmeRes.status}`);
        }
        const readmeText = await readmeRes.text();

        const githubRes = await fetch('https://api.github.com/repos/palabhradeep635-star/lchub/contents', {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        let rootDirs: string[] = [];
        if (githubRes.ok) {
          const rawData = await githubRes.json();
          rootDirs = rawData
            .filter((item: any) => item.type === "dir" && !item.name.startsWith(".") && item.name !== ".github" && item.name !== "README.md")
            .map((item: any) => item.name);
        }

        const parsed = parseReadmeData(readmeText, rootDirs);
        return {
          ...parsed,
          isFallback: true
        };
      } catch (githubErr: any) {
        console.error(`[DSA fetch] Direct GitHub fetch attempt ${attempt} failed:`, githubErr);

        if (attempt < 3) {
          const delay = attempt * 1000;
          console.log(`[DSA fetch] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(attempt + 1);
        }
        
        throw new Error("DSA data temporarily unavailable");
      }
    };

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await fetchWithRetry();
        if (active) {
          setData(stats);
          setError(null);
        }
      } catch (err: any) {
        console.error("[DSA fetch] Full failover pipeline exhausted:", err);
        if (active) {
          setError("DSA data temporarily unavailable");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    // Set up dynamic refresh every 2 minutes
    const interval = setInterval(fetchStats, 2 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [refreshTrigger]);

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  const getProgressLabel = (count: number) => {
    if (count < 25) {
      return "DSA Journey Started";
    }
    const milestones = [4000, 2000, 1000, 500, 250, 100, 25];
    let maxMilestone = 4000;
    while (count >= maxMilestone * 2) {
      maxMilestone *= 2;
      milestones.unshift(maxMilestone);
    }
    for (const m of milestones) {
      if (count >= m) {
        return `${m}+ Problems Solved`;
      }
    }
    return "DSA Journey Started";
  };

  const totalSolved = data?.totalSolved ?? 0;
  const easyCount = data?.difficultyBreakdown?.Easy ?? 0;
  const mediumCount = data?.difficultyBreakdown?.Medium ?? 0;
  const hardCount = data?.difficultyBreakdown?.Hard ?? 0;

  const easyPercent = totalSolved > 0 ? Math.round((easyCount / totalSolved) * 100) : 0;
  const mediumPercent = totalSolved > 0 ? Math.round((mediumCount / totalSolved) * 100) : 0;
  const hardPercent = totalSolved > 0 ? Math.round((hardCount / totalSolved) * 100) : 0;

  return (
    <Section id="dsa" title="DSA Progress" subtitle="Live telemetry tracking LeetCode problem solving progress and latest solutions committed to GitHub.">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal delay={0.1} yOffset={25}>
          <div className="space-y-8">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="p-6 sm:p-10 glass-card rounded-2xl relative overflow-hidden card-glow"
            >
              {/* Elegant Radial Accents */}
              <div className="absolute -inset-10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-2xl" />
              
              {error ? (
                <div className="relative z-10 text-center py-8 flex flex-col items-center justify-center">
                  <AlertCircle className="text-amber-400 mb-3 animate-pulse" size={32} />
                  <p className="text-white font-medium text-lg font-sans">{error}</p>
                  <p className="text-white/40 text-xs mt-4 font-mono">The GitHub API rate limit was exceeded or the service is temporarily unreachable.</p>
                  <button
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 border border-blue-500/20 hover:border-blue-500/35 rounded-xl text-[10px] font-mono text-cyan-400 font-semibold tracking-wider transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    RETRY CONNECTION
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Number of Solved Problems */}
                    <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8 min-h-[140px] justify-center">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 mb-3 block">DSA Journey</span>
                      {loading ? (
                        <div className="h-14 w-44 bg-white/5 animate-pulse rounded-xl mb-3" />
                      ) : (
                        <motion.span 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={cn(
                            "font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 leading-tight block",
                            totalSolved < 25 ? "text-2xl sm:text-3xl font-bold" : "text-4xl sm:text-5xl"
                          )}
                        >
                          {getProgressLabel(totalSolved)}
                        </motion.span>
                      )}
                      <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-3 font-semibold">
                        {loading ? "Counting Solutions..." : `${totalSolved} UNIQUE PROBLEMS SOLVED`}
                      </p>
                    </div>

                    {/* Right Column: Problem Name & Commit Details */}
                    <div className="md:col-span-7 space-y-5">
                      <div className="space-y-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <h3 className="text-xs font-mono tracking-widest text-white/50 uppercase">Latest Problem Solved</h3>
                        </div>
                        {!loading && data?.latestDifficulty && (
                          <span className={cn(
                            "px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-md border shrink-0 text-center w-fit",
                            data.latestDifficulty === "Easy" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                            data.latestDifficulty === "Medium" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                            "bg-red-500/10 border-red-500/30 text-red-400"
                          )}>
                            {data.latestDifficulty.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {loading ? (
                        <div className="space-y-2">
                          <div className="h-6 w-3/4 bg-white/5 animate-pulse rounded" />
                          <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded" />
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-zinc-950/40 border border-white/5 rounded-xl flex items-start gap-3 card-glow"
                        >
                          <Terminal size={18} className="text-purple-400 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-white/90 text-sm sm:text-base font-medium tracking-tight font-sans line-clamp-1">
                              {data?.latestProblem || "Unresolved"}
                            </p>
                            <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-1">
                              Last Modified Folder change verified
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Repository activity info */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] block">Repository Activity</span>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/60">
                          <div className="flex items-center gap-1.5">
                            <Code size={12} className="text-blue-400" />
                            <span>Last Updated: <strong className="text-white">{loading ? '...' : (data?.lastUpdated ? formatDate(data.lastUpdated) : 'Recently')}</strong></span>
                          </div>
                          {data?.isFallback && (
                            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-[9px] border border-amber-500/15">
                              <AlertCircle size={10} />
                              <span>Direct Parsing</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Profile/Repository Links */}
                      <div className="flex flex-wrap items-center gap-3 pt-3">
                        <a
                          href="https://github.com/palabhradeep635-star/lchub"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 border border-blue-500/20 rounded-xl text-[9px] font-mono text-sky-400 font-semibold tracking-wider transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_12px_rgba(56,189,248,0.05)]"
                        >
                          <Github size={12} />
                          <span>LCHUB REPOSITORY</span>
                          <ExternalLink size={10} />
                        </a>
                        <a
                          href={PROFILE.leetcode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 border border-purple-500/20 rounded-xl text-[9px] font-mono text-pink-400 font-semibold tracking-wider transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_12px_rgba(244,114,182,0.05)]"
                        >
                          <Globe size={12} />
                          <span>LEETCODE PROFILE</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                              {/* Progress Visualization (Always shown to track milestones dynamically) */}
                  {!loading && (() => {
                    const currentTarget = (() => {
                      let target = 250;
                      while (totalSolved >= target) {
                        target = target * 2;
                      }
                      return target;
                    })();

                    const progressPercent = Math.min(100, Math.round((totalSolved / currentTarget) * 100));

                    const milestonesList = getDynamicMilestones(totalSolved, currentTarget);
                    const visibleMilestones = milestonesList.filter(m => m.target <= currentTarget);

                    const highestUnlockedMilestone = [...milestonesList]
                      .reverse()
                      .find(m => totalSolved >= m.target);

                    // SVG Circle Geometry calculations
                    const radius = 85;
                    const circumference = 2 * Math.PI * radius;
                    const easyLen = (easyCount / currentTarget) * circumference;
                    const mediumLen = (mediumCount / currentTarget) * circumference;
                    const hardLen = (hardCount / currentTarget) * circumference;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                      >
                        {/* Left Column (Circular Progress Track & Dynamic Breakdown) */}
                        <div className="lg:col-span-7 space-y-5">
                          <div className="space-y-4">
                            {/* Flowing Gradient Progress Bar */}
                            <div className="space-y-2.5">
                              <style>{`
                                @keyframes flowingGradient {
                                  0% { background-position: 0% 50%; }
                                  50% { background-position: 100% 50%; }
                                  100% { background-position: 0% 50%; }
                                }
                              `}</style>
                              <div className="flex justify-between items-center text-[clamp(10px,1.5vw,13px)] font-mono">
                                <span className="text-white/50 uppercase tracking-wider">Target Progress</span>
                                <span className="text-cyan-400 font-bold">{totalSolved} / {currentTarget} Solved</span>
                              </div>
                              <div className="relative h-4 bg-zinc-950/80 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                <motion.div 
                                  className="h-full rounded-full bg-[linear-gradient(270deg,#3b82f6,#8b5cf6,#ec4899,#06b6d4,#3b82f6)] bg-[length:400%_400%] shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                                  style={{
                                    animation: "flowingGradient 6s ease infinite",
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                                {progressPercent > 0 && (
                                  <div 
                                    className="absolute top-0 bottom-0 w-2 bg-white blur-[2px] opacity-70"
                                    style={{ left: `calc(${progressPercent}% - 4px)`, transition: 'left 1.5s ease-out' }}
                                  />
                                )}
                              </div>
                            </div>

                            {/* Circular Wellbeing-Style Progress Chart */}
                            <div 
                              ref={chartContainerRef}
                              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 p-6 bg-zinc-950/20 border border-white/5 rounded-2xl relative overflow-hidden group/chart shadow-[inset_0_0_24px_rgba(0,0,0,0.2)]"
                            >
                              {/* Left Labels */}
                              <div className="flex flex-row sm:flex-col gap-5 justify-center sm:text-right transform translate-x-3 sm:translate-x-6 transition-all duration-500 ease-out">
                                <div className="text-center sm:text-right">
                                  <span 
                                    className="inline-flex items-center gap-1.5 font-mono text-green-400 font-bold uppercase tracking-wider"
                                    style={{ fontSize: `${11 * chartScale}px` }}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    Easy
                                  </span>
                                  <p className="font-bold text-white/95 font-sans mt-0.5" style={{ fontSize: `${18 * chartScale}px` }}>{easyCount} Solved</p>
                                  <p className="font-mono text-white/40" style={{ fontSize: `${10 * chartScale}px` }}>{easyPercent}% split</p>
                                </div>
                              </div>

                              {/* Center Circular Chart */}
                              <div 
                                className="relative flex items-center justify-center select-none transition-all duration-500 ease-out"
                                style={{ width: `${220 * chartScale}px`, height: `${220 * chartScale}px` }}
                              >
                                <svg 
                                  width={220 * chartScale} 
                                  height={220 * chartScale} 
                                  viewBox="0 0 220 220" 
                                  className="transform -rotate-90"
                                >
                                  {/* Background Track of Circle representing Target Progress */}
                                  <circle
                                    cx="110"
                                    cy="110"
                                    r="85"
                                    stroke="rgba(255, 255, 255, 0.03)"
                                    strokeWidth="16"
                                    fill="transparent"
                                  />
                                  {/* Easy segment */}
                                  {easyLen > 0 && (
                                    <motion.circle
                                      cx="110"
                                      cy="110"
                                      r="85"
                                      stroke="#10b981"
                                      strokeWidth="16"
                                      fill="transparent"
                                      initial={{ strokeDashoffset: circumference, strokeDasharray: `0 ${circumference}` }}
                                      animate={{ strokeDashoffset: 0, strokeDasharray: `${easyLen} ${circumference}` }}
                                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                  )}
                                  {/* Medium segment */}
                                  {mediumLen > 0 && (
                                    <motion.circle
                                      cx="110"
                                      cy="110"
                                      r="85"
                                      stroke="#f59e0b"
                                      strokeWidth="16"
                                      fill="transparent"
                                      initial={{ strokeDashoffset: circumference, strokeDasharray: `0 ${circumference}` }}
                                      animate={{ strokeDashoffset: -easyLen, strokeDasharray: `${mediumLen} ${circumference}` }}
                                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                  )}
                                  {/* Hard segment */}
                                  {hardLen > 0 && (
                                    <motion.circle
                                      cx="110"
                                      cy="110"
                                      r="85"
                                      stroke="#f43f5e"
                                      strokeWidth="16"
                                      fill="transparent"
                                      initial={{ strokeDashoffset: circumference, strokeDasharray: `0 ${circumference}` }}
                                      animate={{ strokeDashoffset: -(easyLen + mediumLen), strokeDasharray: `${hardLen} ${circumference}` }}
                                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                  )}
                                </svg>
 
                                 {/* Center of the circle */}
                                 <div 
                                   onMouseEnter={() => setCenterHovered(true)}
                                   onMouseLeave={() => setCenterHovered(false)}
                                   className="absolute rounded-full flex flex-col items-center justify-center bg-transparent border-2 border-white/10 hover:border-cyan-400/40 backdrop-blur-sm cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                                   style={{ width: `${140 * chartScale}px`, height: `${140 * chartScale}px` }}
                                 >
                                   <div className="select-none text-center">
                                     <AnimatePresence mode="wait">
                                       {centerHovered ? (
                                         <motion.div
                                           key="percent"
                                           initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                           animate={{ opacity: 1, scale: 1, y: 0 }}
                                           exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                           transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                           className="text-center animate-none"
                                         >
                                           <span className="uppercase tracking-widest text-cyan-400 block mb-0.5 font-bold font-mono" style={{ fontSize: `${9 * chartScale}px` }}>Progress</span>
                                           <span className="font-black tracking-tight text-white block" style={{ fontSize: `${24 * chartScale}px` }}>
                                             {progressPercent}%
                                           </span>
                                           <span className="font-mono text-white/40 block mt-0.5 uppercase tracking-wider" style={{ fontSize: `${8 * chartScale}px` }}>of {currentTarget} Target</span>
                                         </motion.div>
                                       ) : (
                                         <motion.div
                                           key="solved"
                                           initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                           animate={{ opacity: 1, scale: 1, y: 0 }}
                                           exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                           transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                           className="text-center animate-none"
                                         >
                                           <span className="uppercase tracking-widest text-white/40 block mb-0.5 font-medium font-mono" style={{ fontSize: `${9 * chartScale}px` }}>Solved</span>
                                           <span className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 block" style={{ fontSize: `${30 * chartScale}px` }}>
                                             {totalSolved}
                                           </span>
                                           <span className="font-mono text-white/30 block mt-0.5 uppercase tracking-wider" style={{ fontSize: `${8 * chartScale}px` }}>Problems</span>
                                         </motion.div>
                                       )}
                                     </AnimatePresence>
                                   </div>
                                 </div>
                               </div>
 
                               {/* Right Labels */}
                               <div className="flex flex-row sm:flex-col gap-6 justify-center sm:text-left transform -translate-x-3 sm:-translate-x-6 transition-all duration-500 ease-out">
                                <div className="text-center sm:text-left">
                                  <span 
                                    className="inline-flex items-center gap-1.5 font-mono text-yellow-400 font-bold uppercase tracking-wider"
                                    style={{ fontSize: `${11 * chartScale}px` }}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                    Medium
                                  </span>
                                  <p className="font-bold text-white/95 font-sans mt-0.5" style={{ fontSize: `${18 * chartScale}px` }}>{mediumCount} Solved</p>
                                  <p className="font-mono text-white/40" style={{ fontSize: `${10 * chartScale}px` }}>{mediumPercent}% split</p>
                                </div>
                                <div className="text-center sm:text-left">
                                  <span 
                                    className="inline-flex items-center gap-1.5 font-mono text-red-400 font-bold uppercase tracking-wider"
                                    style={{ fontSize: `${11 * chartScale}px` }}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                    Hard
                                  </span>
                                  <p className="font-bold text-white/95 font-sans mt-0.5" style={{ fontSize: `${18 * chartScale}px` }}>{hardCount} Solved</p>
                                  <p className="font-mono text-white/40" style={{ fontSize: `${10 * chartScale}px` }}>{hardPercent}% split</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Active Milestone Banner Alert */}
                          {highestUnlockedMilestone && (
                            <motion.div 
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-xl flex items-center gap-3.5 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                            >
                              <span className="text-2xl animate-bounce">🏆</span>
                              <div>
                                <h4 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Active Milestone Unlocked</h4>
                                <p className="text-sm font-bold text-white/95 mt-0.5">
                                  {highestUnlockedMilestone.name} Milestone Unlocked
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Right Column (Parsed Splits & Milestone History) */}
                        <div className="lg:col-span-5 space-y-4 w-full">
                          {/* Quick Analytics Card: Difficulty Distribution */}
                          <div className="space-y-3 p-4 bg-zinc-950/30 border border-white/5 rounded-xl">
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-semibold">Parsed Core Splits</span>
                            
                            <div className="space-y-2">
                              {/* Easy SPLIT */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span className="text-green-400">Easy Tasks</span>
                                  <span className="text-white/60">{easyCount} solved ({easyPercent}%)</span>
                                </div>
                                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-green-500 rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${easyPercent}%` }}
                                    transition={{ duration: 1 }}
                                  />
                                </div>
                              </div>

                              {/* Medium SPLIT */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span className="text-yellow-400">Medium Core</span>
                                  <span className="text-white/60">{mediumCount} solved ({mediumPercent}%)</span>
                                </div>
                                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-yellow-500 rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mediumPercent}%` }}
                                    transition={{ duration: 1 }}
                                  />
                                </div>
                              </div>

                              {/* Hard SPLIT */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span className="text-red-400">Hard Challenges</span>
                                  <span className="text-white/60">{hardCount} solved ({hardPercent}%)</span>
                                </div>
                                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-red-500 rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${hardPercent}%` }}
                                    transition={{ duration: 1 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Milestone History Board */}
                          <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-xl space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-semibold">Milestone History</span>
                              <span className="text-[8px] font-mono text-cyan-400/70 uppercase">PRESERVED PROGRESS</span>
                            </div>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/5">
                              {milestonesList.map((m) => {
                                const isCompleted = totalSolved >= m.target;
                                const completionDate = getCompletionDateForTarget(m.target, totalSolved, data?.lastUpdated || new Date().toISOString());
                                return (
                                  <div key={m.target} className="flex items-center justify-between text-[11px] font-mono border-b border-white/5 pb-1.5 last:border-b-0 last:pb-0">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span className={isCompleted ? "text-green-400 font-bold shrink-0" : "text-white/20 shrink-0"}>
                                        {isCompleted ? "✓" : "○"}
                                      </span>
                                      <span className={isCompleted ? "text-white/80 font-medium truncate" : "text-white/30 truncate"}>
                                        {m.name} ({m.target})
                                      </span>
                                    </div>
                                    {isCompleted ? (
                                      <span className="text-white/40 text-[9px] shrink-0 font-sans">
                                        {completionDate ? formatDate(completionDate) : "Completed"}
                                      </span>
                                    ) : (
                                      <span className="text-white/20 text-[9px] italic shrink-0">In Progress</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </>
              )}
            </motion.div>

            {/* Dynamic Topics & Topical Mastery Section */}
            {!loading && data?.topics && data.topics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Section Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 font-mono tracking-wider uppercase">Topical Mastery Arsenal</h4>
                    <p className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Dynamically populated from verified README categories</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold rounded-md">
                    {data.topics.length} UNIQUE TOPICS
                  </span>
                </div>

                {/* Horizontal Mastery Bars Visualization */}
                <div className="p-5 bg-zinc-950/20 border border-white/5 rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-semibold">topical distribution metrics</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {data.topics.map((topic) => {
                      const maxTopicCount = Math.max(...data.topics.map(t => t.count), 1);
                      const relativePercent = Math.round((topic.count / maxTopicCount) * 100);
                      return (
                        <div key={topic.name} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-white/70 font-medium">{topic.name}</span>
                            <span className="text-cyan-400 font-bold">{topic.count} solved</span>
                          </div>
                          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                            {topic.easyCount > 0 && (
                              <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${(topic.easyCount / topic.count) * 100}%` }}
                                title={`${topic.easyCount} Easy`}
                              />
                            )}
                            {topic.mediumCount > 0 && (
                              <div 
                                className="h-full bg-yellow-500" 
                                style={{ width: `${(topic.mediumCount / topic.count) * 100}%` }}
                                title={`${topic.mediumCount} Medium`}
                              />
                            )}
                            {topic.hardCount > 0 && (
                              <div 
                                className="h-full bg-red-500" 
                                style={{ width: `${(topic.hardCount / topic.count) * 100}%` }}
                                title={`${topic.hardCount} Hard`}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Topic Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.topics.map((topic) => (
                    <motion.div
                      key={topic.name}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="p-5 bg-zinc-950/40 border border-white/5 rounded-2xl flex flex-col justify-between card-glow relative group"
                    >
                      <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cyan-400/70">
                        {topic.count}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <h5 className="text-xs font-mono font-bold text-white/90 uppercase tracking-wider">{topic.name}</h5>
                        </div>

                        {/* Difficulty breakdown details inside topic card */}
                        <div className="flex gap-3 text-[9px] font-mono text-white/40">
                          {topic.easyCount > 0 && (
                            <span className="text-green-400">{topic.easyCount} Easy</span>
                          )}
                          {topic.mediumCount > 0 && (
                            <span className="text-yellow-400">{topic.mediumCount} Medium</span>
                          )}
                          {topic.hardCount > 0 && (
                            <span className="text-red-400">{topic.hardCount} Hard</span>
                          )}
                        </div>

                        {/* Expandable mini list of problems in this topic card */}
                        <div className="pt-2 border-t border-white/5 space-y-1">
                          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Problems listed:</span>
                          <div className="flex flex-wrap gap-1 max-h-[64px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/5">
                            {topic.problems.map((p, idx) => (
                              <span 
                                key={idx} 
                                className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 rounded text-[8px] font-mono text-white/60 truncate max-w-full"
                                title={p}
                              >
                                {p.replace(/^\d+-/, "")}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
};

interface FloatingPerformanceWidgetProps {
  perfMode: PerfMode;
  setPerfMode: (mode: PerfMode) => void;
  autoOptimize: boolean;
  setAutoOptimize: (val: boolean) => void;
}

const FloatingPerformanceWidget = ({
  perfMode,
  setPerfMode,
  autoOptimize,
  setAutoOptimize
}: FloatingPerformanceWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFps, setCurrentFps] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFpsUpdate = (e: Event) => {
      setCurrentFps((e as CustomEvent).detail);
    };
    window.addEventListener('fps-update', handleFpsUpdate);
    return () => {
      window.removeEventListener('fps-update', handleFpsUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getStatusColor = () => {
    if (currentFps === null) return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    if (currentFps >= 50) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (currentFps >= 30) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getStatusLabel = () => {
    if (currentFps === null) return 'STANDBY';
    if (currentFps >= 50) return 'OPTIMAL';
    if (currentFps >= 30) return 'STABLE';
    return 'THROTTLED';
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-[90] font-sans">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300"
      >
        <span className="relative flex h-2 w-2">
          {autoOptimize ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </>
          ) : (
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              perfMode === 'professional' ? 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]' :
              perfMode === 'eco' ? 'bg-yellow-500 shadow-[0_0_8px_#f59e0b]' :
              'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
            }`}></span>
          )}
        </span>

        <Cpu size={14} className={`text-cyan-400 ${currentFps !== null && currentFps > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: currentFps !== null ? `${Math.max(1, 10 - currentFps/6)}s` : '6s' }} />
        
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/90 font-medium select-none">
          {currentFps !== null ? `${currentFps} FPS` : 'TELEMETRY'}
        </span>
      </motion.button>

      {/* Flyout Telemetry Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 left-0 w-[320px] bg-neutral-950/95 border border-white/10 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl p-5 overflow-hidden"
          >
            {/* Cyber Grid BG Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-5 select-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px'
              }}
            />

            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/45 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/45 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/45 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/45 rounded-br-sm pointer-events-none" />

            {/* Title / Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-1.5">
                <Gauge size={14} className="text-cyan-400 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold">
                  Telemetry // Optimization
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Main Stats Display */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 mb-4 space-y-2.5 relative z-10">
              {/* FPS Counter and Status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/40 block">Graphics Engine Rate</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black font-mono tracking-tight text-white leading-none">
                      {currentFps !== null ? currentFps : '--'}
                    </span>
                    <span className="font-mono text-[9px] text-white/50 uppercase">FPS</span>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded border text-[8px] font-mono font-bold uppercase tracking-wider ${getStatusColor()}`}>
                  {getStatusLabel()}
                </div>
              </div>

              {/* Progress/Gauge Bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    currentFps === null ? 'w-0 bg-zinc-700' :
                    currentFps >= 55 ? 'bg-cyan-500' :
                    currentFps >= 45 ? 'bg-green-500' :
                    currentFps >= 30 ? 'bg-yellow-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${currentFps !== null ? Math.min(100, (currentFps / 60) * 100) : 0}%` }}
                />
              </div>

              {/* Advanced specs breakdown */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-white/5 font-mono text-[9px]">
                <div>
                  <span className="text-white/30 block uppercase">Canvas Scale:</span>
                  <span className="text-white/80 font-medium">
                    {perfMode === 'professional' ? '1.80x (Ultra HD)' :
                     perfMode === 'eco' ? '1.00x (Standard)' :
                     '0.65x (Low-Res)'}
                  </span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase">Nebula Load:</span>
                  <span className="text-white/80 font-medium">
                    {perfMode === 'professional' ? '16 Clusters (Full)' :
                     perfMode === 'eco' ? '4 Clusters (Eco)' :
                     'Bypassed'}
                  </span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase">Star Projectors:</span>
                  <span className="text-white/80 font-medium">
                    {perfMode === 'professional' ? '200 Particles' :
                     perfMode === 'eco' ? '65 Particles' :
                     '20 Particles'}
                  </span>
                </div>
                <div>
                  <span className="text-white/30 block uppercase">Engine State:</span>
                  <span className="text-white/80 font-medium">
                    {perfMode === 'ultra' ? 'Power-Saving' : 'Continuous'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selector Buttons */}
            <div className="space-y-2 relative z-10">
              <span className="font-mono text-[8px] uppercase tracking-wider text-white/40 block mb-1">Dynamics Mode Selector</span>
              
              {/* Professional Button */}
              <button
                onClick={() => {
                  setPerfMode('professional');
                  setAutoOptimize(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-300 ${
                  perfMode === 'professional'
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-neutral-900/60 border-white/5 hover:border-cyan-500/20 text-white/70 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-white/90">Professional Mode</div>
                  <div className="text-[8px] text-white/40 mt-0.5 leading-relaxed font-light">Max details, full Volumetric Nebula, 200 twinkling stars</div>
                </div>
                {perfMode === 'professional' && <Check size={12} className="text-cyan-400 shrink-0" />}
              </button>

              {/* Balanced Eco Button */}
              <button
                onClick={() => {
                  setPerfMode('eco');
                  setAutoOptimize(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-300 ${
                  perfMode === 'eco'
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-neutral-900/60 border-white/5 hover:border-yellow-500/20 text-white/70 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-white/90">Balanced Eco</div>
                  <div className="text-[8px] text-white/40 mt-0.5 leading-relaxed font-light font-sans">Optimized 2-stop gradients, 65 stars, standard DPI</div>
                </div>
                {perfMode === 'eco' && <Check size={12} className="text-yellow-400 shrink-0" />}
              </button>

              {/* Ultra Eco Button */}
              <button
                onClick={() => {
                  setPerfMode('ultra');
                  setAutoOptimize(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-300 ${
                  perfMode === 'ultra'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                    : 'bg-neutral-900/60 border-white/5 hover:border-rose-500/20 text-white/70 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-white/90">Ultra Eco Saver</div>
                  <div className="text-[8px] text-white/40 mt-0.5 leading-relaxed font-light">Bypasses corridor, 20 stars, 20 FPS target, standby deep sleep</div>
                </div>
                {perfMode === 'ultra' && <Check size={12} className="text-rose-400 shrink-0" />}
              </button>
            </div>

            {/* Auto Optimize Toggle Option */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex-1 pr-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/80 block">Telemetry Auto-Optimize</span>
                <span className="text-[8px] text-white/40 leading-tight block mt-0.5 font-light">Continuously gauges frames to adjust resolution & counts</span>
              </div>
              <button
                onClick={() => {
                  const target = !autoOptimize;
                  setAutoOptimize(target);
                  if (target) {
                    setPerfMode('professional');
                  }
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoOptimize ? 'bg-cyan-500' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoOptimize ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const heroRef = useRef(null);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [perfMode, setPerfMode] = useState<PerfMode>('professional');
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [dispatchDetails, setDispatchDetails] = useState<{ delivered?: boolean; fallbackUsed?: boolean } | null>(null);
  const [activeCinematic, setActiveCinematic] = useState(0);

  const [h3MousePos, setH3MousePos] = useState({ x: 0, y: 0 });
  const [isH3Hovered, setIsH3Hovered] = useState(false);
  const h3Ref = useRef<HTMLHeadingElement>(null);

  const handleH3MouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!h3Ref.current) return;
    const rect = h3Ref.current.getBoundingClientRect();
    setH3MousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Auto transition the cinematic teaser slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCinematic((prev) => (prev === 0 ? 1 : 0));
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  // Clear toast notifications after brief period
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setDispatchDetails(null);
    
    // Clean whitespace for secure validation
    const nameTrim = formState.name.trim();
    const emailTrim = formState.email.trim();
    const messageTrim = formState.message.trim();

    if (!nameTrim) {
      setSubmitError("Sender full name is required and cannot be empty.");
      setIsSubmitting(false);
      setToastMessage("Validation check failed.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim || !emailRegex.test(emailTrim)) {
      setSubmitError("A valid email address containing a domain (e.g. name@domain.com) is required.");
      setIsSubmitting(false);
      setToastMessage("Validation check failed.");
      return;
    }

    if (!messageTrim || messageTrim.length < 10) {
      setSubmitError("Inquiry message is too short. Please specify at least 10 characters to ensure clear context.");
      setIsSubmitting(false);
      setToastMessage("Validation check failed.");
      return;
    }
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameTrim,
          email: emailTrim,
          subject: formState.subject ? formState.subject.trim() : "",
          message: messageTrim,
          timestamp: new Date().toUTCString()
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'The collaboration gateway returned a connection fault.');
      }
      
      setIsSubmitted(true);
      setDispatchDetails({
        delivered: result.delivered,
        fallbackUsed: result.fallbackUsed
      });
      setToastMessage("Pristine collaboration dispatch delivered!");
    } catch (err: any) {
      console.error("[Form Submit Error]", err);
      setSubmitError(err.message || 'An unexpected failure occurred while routing your message.');
      setToastMessage("Communication dispatch failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    const text = `===========================================
ABHRADEEP PAL PORTFOLIO DISPATCH SYSTEM
===========================================
SENDER INFO:
  Name: ${formState.name}
  Email: ${formState.email}
  Subject: ${formState.subject || 'General Inquiry'}
  Timestamp: ${new Date().toLocaleString()}

MESSAGE PAYLOAD:
${formState.message}

===========================================
AI & EMBEDDED SYSTEMS ENGINEERING PORTFOLIO
===========================================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setToastMessage("Structured copy loaded to clipboard!");
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(heroScrollY, [0, 1], ["0%", "20%"]);
  const heroScale = useTransform(heroScrollY, [0, 1], [1, 0.94]);
  const heroOpacity = useTransform(heroScrollY, [0, 0.85], [1, 0]);
  const blobY1 = useTransform(heroScrollY, [0, 1], ["0px", "140px"]);
  const blobY2 = useTransform(heroScrollY, [0, 1], ["0px", "-100px"]);

  // Scrolling depth layers for cinematic parallax (No excessive motion, matching scroll-linked speed elegantly)
  const badgeY = useTransform(heroScrollY, [0, 1], ["0px", "-140px"]);
  const nameY = useTransform(heroScrollY, [0, 1], ["0px", "-90px"]);
  const textY = useTransform(heroScrollY, [0, 1], ["0px", "-50px"]);
  const ctaY = useTransform(heroScrollY, [0, 1], ["0px", "-15px"]);

  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.25
      }
    }
  };

  const nameContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.45
      }
    }
  };

  const nameWordVariants = {
    hidden: { 
      filter: "blur(20px)", 
      opacity: 0, 
      y: 40,
      scale: 1.08
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.35,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number;

    try {
      lenis = new Lenis({
        duration: 1.5,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: true,
        syncTouchLerp: 0.08,
      });

      (window as any).lenis = lenis;

      const raf = (time: number) => {
        if (lenis) {
          lenis.raf(time);
        }
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    } catch (err) {
      console.warn("Lenis smooth scroll initialization bypassed (running in fallback environment):", err);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenis) {
        try {
          lenis.destroy();
        } catch (destroyErr) {
          console.warn("Error destroying Lenis instance:", destroyErr);
        }
      }
      (window as any).lenis = null;
    };
  }, []);

  return (
    <div className={cn(
      "min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden antialiased",
      perfMode === 'ultra' && "ultra-eco"
    )}>
      <ScrollProgress />
      <ScrollNavigator />
      <ParticleBackground 
        perfMode={perfMode} 
        setPerfMode={setPerfMode} 
        setToastMessage={setToastMessage}
        autoOptimize={autoOptimize}
        setAutoOptimize={setAutoOptimize}
      />
      <div className="bg-mesh" />
      <Navbar />


      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen py-24 md:py-0 md:h-screen flex items-center px-4 sm:px-6 overflow-hidden">
        {/* Subtle Premium Blueprint Coordinate Grid Overlay, fading at bottom */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.14] select-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, transparent 20%, #000000 95%),
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 36px 36px, 36px 36px'
          }}
        />

        {/* Cinematic layered parallax background depths */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 hero-bg pointer-events-none opacity-20 z-0">
          <motion.div style={{ y: blobY1 }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[90px]" />
          <motion.div style={{ y: blobY2 }} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[90px]" />
        </motion.div>

        <motion.div 
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="max-w-7xl mx-auto w-full relative z-10 hero-content"
        >
          <motion.div 
            variants={heroItemVariants}
            style={{ y: badgeY }}
            className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full glass-card text-[8px] min-[385px]:text-[9px] font-mono text-cyan-400 mb-8 tracking-[0.08em] min-[385px]:tracking-[0.2em] border border-cyan-500/20 bg-cyan-950/20 shadow-[0_4px_12px_rgba(34,211,238,0.1)] max-w-full"
          >
            <Zap size={10} className="animate-pulse text-cyan-400 shrink-0" />
            <span className="font-semibold uppercase whitespace-normal text-left">ENGINEERING EDGE AI SYSTEM ARCHITECTURES</span>
          </motion.div>
          
          <motion.h1 
            variants={nameContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: nameY }}
            className="text-[11vw] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-bold tracking-tighter mb-6 leading-[0.9] sm:leading-[0.85] uppercase"
          >
            <motion.span className="block" variants={nameWordVariants}>
              {PROFILE.name.split(' ')[0]}
            </motion.span>
            <motion.span className="text-gradient block" variants={nameWordVariants}>
              {PROFILE.name.split(' ')[1]}
            </motion.span>
          </motion.h1>
          
          <motion.div 
            variants={heroItemVariants}
            style={{ y: textY }}
            className="text-[11px] min-[360px]:text-xs min-[400px]:text-sm sm:text-lg md:text-xl lg:text-[1.5rem] xl:text-[1.75rem] text-white/50 max-w-full sm:max-w-2xl mb-10 leading-normal font-light font-mono min-h-[1.5rem] sm:min-h-[2.5rem] whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <Typewriter
              options={{
                strings: [
                  "AI & Intelligent Embedded Systems Engineer",
                  "Edge AI & IoT Hardware Developer",
                  "Intelligent Monitoring Specialist",
                  "Optimizing Telemetry Architectures"
                ],
                autoStart: true,
                loop: true,
                delay: 45,
                deleteSpeed: 25,
              }}
            />
          </motion.div>
 
          <motion.div 
            variants={heroItemVariants}
            style={{ y: ctaY }}
            className="flex flex-wrap gap-5 items-center"
          >
            <motion.a 
              href="#projects" 
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("projects");
                if (el) {
                  window.dispatchEvent(new CustomEvent('nav-section-click', { detail: { sectionId: 'projects' } }));
                  if ((window as any).lenis) {
                    (window as any).lenis.scrollTo(el, { offset: -40, duration: 1.2 });
                  } else {
                    const rect = el.getBoundingClientRect();
                    const absoluteTop = rect.top + window.pageYOffset;
                    window.scrollTo({
                      top: absoluteTop - 40,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(255, 255, 255, 0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 bg-white text-black font-extrabold rounded-full flex items-center gap-2.5 hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] transition-all duration-300 tracking-[0.16em] text-[11px]"
            >
              EXPLORE WORKS
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.a>
            
            <div className="flex items-center gap-6 px-4">
              {[
                { icon: Github, href: PROFILE.actualGithub },
                { icon: Linkedin, href: PROFILE.linkedin },
                { icon: Code, href: PROFILE.hackerrank },
                { icon: Code2, href: PROFILE.leetcode },
                { icon: Mail, href: `mailto:${PROFILE.email}` }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  target={social.href.startsWith('mailto') ? undefined : "_blank"}
                  rel={social.href.startsWith('mailto') ? undefined : "noopener noreferrer"}
                  whileHover={{ 
                    y: [0, -6, 2, -1, 0],
                    rotate: [0, -7, 7, -4, 4, 0],
                    color: '#60A5FA',
                    transition: { duration: 0.45, ease: "easeInOut" }
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
 
        {/* Decorative elements side rail with pulsating dynamic engine status */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 items-center select-none pointer-events-none z-10">
          <div className="w-[1px] h-28 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="flex flex-col items-center gap-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <p className="text-[8.5px] font-mono text-white/25 uppercase tracking-[0.7em] [writing-mode:vertical-rl] rotate-180 font-medium">
              SCROLL TO EXPLORE
            </p>
          </div>
          <div className="w-[1px] h-28 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
      </section>

      {/* Narrative (About) Section updated to reduce text-density */}
      <Section id="about" title="The Narrative" subtitle="The balance of high-level algorithmic logic and target hardware precision.">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            <div className="space-y-6 text-xs sm:text-sm text-white/50 leading-relaxed font-light">
              <ScrollReveal delay={0} yOffset={20}>
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-white font-mono text-xs uppercase tracking-widest mb-1.5 text-blue-400 font-semibold">01 / CORE SYNTHESIS</p>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed">{ABOUT_INTRO}</p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={0.15} yOffset={20}>
                <div className="border-l-2 border-purple-500 pl-4">
                  <p className="text-white font-mono text-xs uppercase tracking-widest mb-1.5 text-purple-400 font-semibold">02 / EMBEDDED AI SPECIALIZATION</p>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed">{ABOUT_TECH_SPECIALIZATION}</p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={0.3} yOffset={20}>
                <div className="border-l-2 border-pink-500 pl-4">
                  <p className="text-white font-mono text-xs uppercase tracking-widest mb-1.5 text-pink-400 font-semibold">03 / ENGINEERING TARGET</p>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed">{ABOUT_DIRECTION}</p>
                </div>
              </ScrollReveal>
            </div>
            
            <ScrollReveal delay={0.4} yOffset={20}>
              <motion.div 
                whileHover={{ x: 6 }}
                className="p-6 sm:p-8 glass-card border-l-4 border-blue-500/50 rounded-2xl card-glow"
              >
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3 sm:mb-4 text-blue-400">Core Architecture Mission</h4>
                <p className="text-xs sm:text-sm font-light italic text-white/80 leading-relaxed">"{CAREER_OBJECTIVE}"</p>
              </motion.div>
            </ScrollReveal>
          </div>
          
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { label: 'PROTOTYPES', value: '05+', icon: Layers },
              { label: 'UNIVERSITY', value: 'CU', icon: Globe },
              { label: 'LOCATION', value: 'IND', icon: MapPin },
              { label: 'CENTRIC FOCUS', value: 'AI/IOT', icon: Cpu }
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.08} yOffset={15}>
                <motion.div 
                  whileHover={{ 
                    scale: 1.04, 
                    y: -4,
                    borderColor: 'rgba(59,130,246,0.2)' 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="aspect-square glass-card p-4 sm:p-6 md:p-8 flex flex-col justify-between group transition-colors duration-500 card-glow"
                >
                  <stat.icon size={18} className="text-white/15 group-hover:text-blue-400 transition-colors" />
                  <div>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold block mb-1 tracking-tighter text-white">{stat.value}</span>
                    <span className="text-[8px] sm:text-[9px] font-mono text-white/30 uppercase tracking-widest block">{stat.label}</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Engineering Evolution Section (Timeline) */}
      <TimelineSection />

      {/* Skills Section */}
      <Section id="skills" title="Technical Arsenal" className="bg-zinc-950/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skillGroup, i) => (
            <ScrollReveal key={skillGroup.category} delay={i * 0.08} yOffset={25} className="h-full">
              <motion.div
                whileHover={{ 
                  y: -6, 
                  scale: 1.015,
                  borderColor: 'rgba(59,130,246,0.2)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-6 sm:p-8 md:p-10 glass-card rounded-2xl transition-colors duration-500 group card-glow h-full"
              >
                <div className="mb-6 sm:mb-8 text-white/25 group-hover:text-blue-400 transition-colors duration-500">
                  <skillGroup.icon size={28} className="sm:size-[32px]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 tracking-tight text-white">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {skillGroup.items.map(skill => (
                    <motion.span 
                      key={skill} 
                      whileHover={{ 
                        scale: 1.06, 
                        color: '#60a5fa', 
                        borderColor: 'rgba(96,165,250,0.3)', 
                        backgroundColor: 'rgba(96,165,250,0.08)' 
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="px-3 py-1 bg-white/5 border border-white/5 text-[8px] sm:text-[9px] font-mono text-white/45 rounded-lg transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* DSA Progress Section */}
      <DSAProgressSection />

      {/* Selected Works (Projects) Section */}
      <Section id="projects" title="Selected Works" subtitle="Complete system designs proving practical performance metrics.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </Section>

      {/* Academic Path (Education) Section */}
      <Section id="education" title="Academic Path" className="bg-zinc-950/20">
        <div className="space-y-6">
          {EDUCATION.map((edu, i) => (
            <ScrollReveal key={`${edu.institution}-${edu.degree}`} delay={i * 0.1} xOffset={i % 2 === 0 ? -30 : 30} yOffset={0}>
              <motion.div
                className="flex flex-col md:flex-row gap-6 md:gap-8 md:items-center justify-between p-6 sm:p-8 md:p-10 glass-card rounded-2xl group hover:border-blue-500/20 transition-colors duration-500 card-glow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3.5 mb-4 sm:mb-5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 glass-card rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                      <Globe size={18} className="sm:size-[20px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">{edu.institution}</h3>
                      <p className="text-white/55 text-xs font-light mt-0.5 truncate">{edu.degree}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                    {edu.metricValue && (
                      <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                        <span className="text-[8px] sm:text-[9px] font-mono text-white/40 uppercase tracking-widest">{edu.metricType}:</span>
                        <span className="text-[11px] sm:text-xs font-mono font-bold text-blue-400">{edu.metricValue}</span>
                      </div>
                    )}
                    {edu.highlights.map(h => (
                      <span key={h} className="text-[8px] sm:text-[9px] font-mono text-white/30 flex items-center gap-2 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0" />
                        {h}
                      </span>
                    ))}
                  </div>

                  {edu.institution === "Chandigarh University" && (
                    <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-xl max-w-sm flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-4 card-glow relative overflow-hidden group/chart">
                      {/* Subtle warm glow background */}
                      <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/5 to-purple-500/10 opacity-35 blur-2xl rounded-xl pointer-events-none" />
                      
                      <div className="space-y-1.5 relative z-10 text-left">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">SGPA Progression</span>
                        <div className="space-y-0.5 font-mono text-[9px] text-white/50">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-cyan-400" />
                            <span>Semester 1 SGPA: <strong className="text-white font-medium">8.14</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-purple-400" />
                            <span>Semester 2 SGPA: <strong className="text-white font-medium">8.13</strong></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full min-[380px]:w-28 h-10 relative z-10 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={[
                              { sem: "Sem 1", sgpa: 8.14 },
                              { sem: "Sem 2", sgpa: 8.13 }
                            ]}
                            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
                          >
                            <XAxis dataKey="sem" hide />
                            <YAxis domain={[8.12, 8.15]} hide />
                            <ChartTooltip
                              cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
                              content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-zinc-950/90 border border-white/10 px-1.5 py-0.5 rounded text-[8px] font-mono text-white/90 shadow-xl">
                                        {payload[0].payload.sem}: <span className="font-bold text-cyan-400">{payload[0].value}</span>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                            />
                            <Line
                              type="monotone"
                              dataKey="sgpa"
                              stroke="url(#educationGrad)"
                              strokeWidth={2}
                              dot={{ r: 3, stroke: '#22d3ee', strokeWidth: 1, fill: '#090d16' }}
                              activeDot={{ r: 4, stroke: '#ffffff', strokeWidth: 1.5, fill: '#8b5cf6' }}
                            />
                            <defs>
                              <linearGradient id="educationGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#22d3ee" />
                                <stop offset="100%" stopColor="#a78bfa" />
                              </linearGradient>
                            </defs>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-left md:text-right shrink-0 border-l md:border-l-0 md:border-r border-white/5 pl-4 md:pl-0 md:pr-6 mt-4 md:mt-0">
                  <div className="text-lg sm:text-xl font-bold mb-1 tracking-tighter text-white">{edu.period}</div>
                  <div className="text-[8px] sm:text-[9px] font-mono text-white/30 uppercase tracking-widest">{edu.location}</div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}

          {/* Gradually appearing Future Roadmap Card */}
          <ScrollReveal delay={0.3} yOffset={30}>
            <motion.div
              className="flex flex-col md:flex-row gap-6 md:gap-8 md:items-center justify-between p-6 sm:p-8 md:p-10 border border-dashed border-blue-500/20 bg-blue-500/[0.01] rounded-2xl group hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all card-glow"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3.5 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                    <Sparkles size={18} className="sm:size-[20px] animate-pulse" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight flex items-center gap-2">
                      Academic & Engineering Trajectory Roadmap <span className="text-[9px] px-2 py-0.5 bg-blue-500/15 text-blue-300 font-mono tracking-widest uppercase rounded">FUTURE REACH</span>
                    </h3>
                    <p className="text-white/55 text-xs font-light mt-0.5 truncate">Focusing on modern microprocessors, custom RTL logic, and advanced cognitive networks</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                  {[
                    "AI Agents & Low-Latency Systems Research",
                    "Edge Computing Node & Power-Optimized Microcontrollers",
                    "Core RTOS & Hardware Telemetry Optimizations"
                  ].map(item => (
                    <span key={item} className="text-[8px] sm:text-[9px] font-mono text-blue-400/80 flex items-center gap-2 uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping shrink-0" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-left md:text-right shrink-0 border-l md:border-l-0 md:border-r border-white/5 pl-4 md:pl-0 md:pr-6 mt-4 md:mt-0">
                <div className="text-lg sm:text-xl font-bold mb-1 tracking-tighter text-blue-400">2027 — 2029</div>
                <div className="text-[8px] sm:text-[9px] font-mono text-white/30 uppercase tracking-widest">Next-Gen Hardware/Software</div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </Section>

      {/* Contact Section updated with requested professional placeholders */}
      <Section id="contact" title="Initiate Contact" subtitle="Available for collaborations, academic projects, and industry internships.">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <ScrollReveal delay={0} yOffset={25}>
              <p className="text-xl sm:text-2xl font-light text-white/45 leading-relaxed">
                Open to <span className="text-white font-medium">internships</span>, collaborative engineering projects, and <span className="text-white font-medium font-mono">AI/Embedded Systems</span> opportunities. Let us connect.
              </p>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 gap-4">
               {[
                 { icon: Mail, label: 'Email Address', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
                 { icon: Linkedin, label: 'LinkedIn', value: 'Abhradeep Pal', href: PROFILE.linkedin },
                 { icon: Github, label: 'GitHub', value: '@palabhradeep635', href: PROFILE.actualGithub },
                 { icon: Code, label: 'HackerRank', value: '25BAI70056', href: PROFILE.hackerrank },
                 { icon: Code2, label: 'LeetCode', value: 'abhradeep06', href: PROFILE.leetcode }
               ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.08} yOffset={20}>
                  <motion.a 
                    href={item.href}
                    target={item.href.startsWith('mailto') ? undefined : "_blank"}
                    rel={item.href.startsWith('mailto') ? undefined : "noopener noreferrer"}
                    whileHover={{ y: -3 }}
                    className="p-4 sm:p-6 glass-card rounded-2xl group hover:border-blue-500/20 transition-colors duration-500 card-glow min-w-0 block w-full text-left"
                  >
                    <item.icon size={18} className="text-white/15 mb-3 sm:mb-4 group-hover:text-blue-400 transition-colors" />
                    <p className="text-[7.5px] sm:text-[8px] font-mono text-white/25 uppercase tracking-widest mb-1 truncate">{item.label}</p>
                    <p className="text-[10px] sm:text-xs font-medium truncate text-white/80">{item.value}</p>
                  </motion.a>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal delay={0.2} yOffset={25}>
              <div className="glass-card p-6 sm:p-8 md:p-10 rounded-2xl relative card-glow overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Mail size={100} />
                </div>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="contact-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 relative z-10" 
                      onSubmit={handleFormSubmit}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="form-name" className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] block">Full Name</label>
                          <input 
                            id="form-name"
                            type="text" 
                            required
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/15 text-base sm:text-xs" 
                            placeholder="e.g. Hiring Manager" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="form-email" className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] block">Email Address</label>
                          <input 
                            id="form-email"
                            type="email" 
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/15 text-base sm:text-xs" 
                            placeholder="e.g. recruiter@company.com" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="form-subject" className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] block">Subject (Optional)</label>
                        <input 
                          id="form-subject"
                          type="text" 
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/15 text-base sm:text-xs" 
                          placeholder="e.g. Embedded AI Internship Opportunity" 
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label htmlFor="form-message" className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] block">Your Message</label>
                          <span className="text-[8px] font-mono text-white/20">{formState.message.length} chars</span>
                        </div>
                        <textarea 
                          id="form-message"
                          rows={5} 
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/15 resize-none text-base sm:text-xs leading-relaxed" 
                      placeholder="Specify project requirements, internship scopes, or collaboration ideas..." 
                    />
                  </div>

                  {submitError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400"
                    >
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold font-mono text-[9px] uppercase tracking-wider block mb-0.5">Gateway Link Fault</span>
                        {submitError}
                      </div>
                    </motion.div>
                  )}

                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01, boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 font-bold rounded-xl transition-all tracking-[0.2em] text-[10px] text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={14} className="animate-pulse" />
                        DISPATCH SECURE TRANSMISSION
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6 relative z-10 py-4 text-center"
                >
                  <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-blue-500/20 rounded-full"
                    />
                    <div className="relative w-14 h-14 bg-blue-500/10 border border-blue-500/40 rounded-full flex items-center justify-center text-blue-400">
                      <Check size={26} className="stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold tracking-tight text-white font-sans">DISPATCH COMMITTED</h4>
                    <p className="text-xs font-light text-white/55 max-w-md mx-auto leading-relaxed">
                      Your collaboration query has been dynamically structured into a professional HTML email envelope and routed successfully.
                    </p>
                  </div>

                  {/* Telemetry metadata block representing engineered delivery */}
                  <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-left space-y-3 font-mono text-[9.5px] max-w-md mx-auto text-white/45">
                    <div className="flex justify-between border-b border-white/5 pb-1 text-cyan-400">
                      <span>SECURE TRANSMISSION RECEIPT</span>
                      <span>[STATUS: DELIVERED]</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-white/25">ENVELOPE TYPE:</span>
                      <span className="col-span-2 text-white/80">HTML Structured Template</span>
                      
                      <span className="text-white/25">ROUTING GATE:</span>
                      <span className="col-span-2 text-white/80">
                        {dispatchDetails?.delivered ? "Resend API Transport" : "Express Payload Compiler"}
                      </span>
                      
                      <span className="text-white/25">STATUS:</span>
                      <span className="col-span-2 text-blue-400 font-bold">
                        {dispatchDetails?.delivered 
                          ? "INBOX_COMPLETED_PASS" 
                          : "CONSOLE_LOG_DELIVERY_SIMULATED"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto pt-4">
                    <button 
                      type="button"
                      onClick={copyToClipboard}
                      className="w-full bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-all rounded-lg text-[9px] font-mono uppercase tracking-widest text-white/70"
                    >
                      {copySuccess ? "✔ COPIED PAYLOAD!" : "COPY PRE-FORMATTED TEXT"}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormState({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="w-full bg-blue-500/15 border border-blue-500/20 text-blue-400 hover:bg-blue-500/25 transition-all p-3 rounded-lg text-[9px] font-mono uppercase tracking-widest"
                    >
                      RESET FORM
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </Section>

      <footer className="py-24 px-6 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Interactive/Auto-Crossfading Cinematic Vision Section */}
          <div id="vision" className="pt-24 sm:pt-36 md:pt-40 pb-0 mb-8 max-w-4xl mx-auto px-4 select-none relative z-10">
            <div className="min-h-[160px] sm:min-h-[180px] md:min-h-[200px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {activeCinematic === 0 ? (
                  <motion.div
                    key="teaser"
                    initial={{ opacity: 0, y: 30, filter: "blur(15px)", scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, y: -30, filter: "blur(10px)", scale: 0.98 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="relative flex flex-col items-center justify-center text-center cursor-pointer py-4"
                    onClick={() => setActiveCinematic(1)}
                  >
                    {/* Soft, slow pulse glowing element */}
                    <motion.div 
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-indigo-500/10 blur-[80px] pointer-events-none rounded-full -m-10" 
                    />
                    
                    <span className="text-[10px] sm:text-xs tracking-[0.45em] font-mono uppercase text-white/60 mb-5 relative z-10 block">
                      Stay tuned.
                    </span>
                    
                    <h3 
                      ref={h3Ref}
                      onMouseMove={handleH3MouseMove}
                      onMouseEnter={() => setIsH3Hovered(true)}
                      onMouseLeave={() => setIsH3Hovered(false)}
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium font-space tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-blue-200 relative z-10 leading-tight cursor-default select-none transition-all duration-300"
                      style={isH3Hovered ? {
                        backgroundImage: `radial-gradient(circle 35px at ${h3MousePos.x}px ${h3MousePos.y}px, rgb(34, 211, 238) 0%, rgb(129, 140, 248) 50%, rgb(224, 231, 255) 85%, rgb(255, 255, 255) 100%)`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      } : {}}
                    >
                      The next chapter is already in motion.
                    </h3>
                    
                    {/* Minimal elegant indicator */}
                    <div className="mt-8 h-[1px] w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="quote"
                    initial={{ opacity: 0, y: 30, filter: "blur(15px)", scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, y: -30, filter: "blur(10px)", scale: 0.98 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="relative group flex flex-col items-center justify-center text-center cursor-pointer py-4"
                    onClick={() => setActiveCinematic(0)}
                  >
                    {/* Very smooth epic glowing element beneath/behind */}
                    <div className="absolute inset-0 -m-12 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-[60px] opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000 rounded-full pointer-events-none" />
                    
                    <blockquote className="text-white/85 font-kosmos text-[12px] sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-normal tracking-[0.16em] sm:tracking-[0.22em] leading-relaxed uppercase select-text">
                      IF YOU ARE DREAMING,<br />
                      MAKE SURE YOU DREAM BIG.
                    </blockquote>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
                      className="mt-8 flex items-center justify-center relative z-20"
                    >
                      <a 
                        href="https://share.google/lXS4f1SRw42mfn47Y"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm tracking-[0.5em] font-mono uppercase bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent opacity-75 font-extrabold select-text group-hover:opacity-100 hover:opacity-100 hover:text-blue-300 transition-all duration-500 cursor-pointer"
                      >
                        — KARAN AUJLA —
                      </a>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom minimalist luxury level slider dash indicators */}
            <div className="mt-4 flex justify-center gap-2">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveCinematic(index)}
                  className="group relative py-2 px-1 focus:outline-none cursor-pointer"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`h-[2px] transition-all duration-500 ${
                    activeCinematic === index 
                      ? 'w-8 bg-blue-400' 
                      : 'w-4 bg-white/10 group-hover:bg-white/30'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 flex justify-center gap-6">
            <motion.a 
              href={PROFILE.actualGithub} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ 
                y: [0, -6, 2, -1, 0],
                rotate: [0, -7, 7, -4, 4, 0],
                color: '#ffffff',
                transition: { duration: 0.45, ease: "easeInOut" }
              }}
              className="text-white/20 hover:text-white transition-colors block"
            >
              <Github size={18} />
            </motion.a>
            <motion.a 
              href={PROFILE.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ 
                y: [0, -6, 2, -1, 0],
                rotate: [0, -7, 7, -4, 4, 0],
                color: '#ffffff',
                transition: { duration: 0.45, ease: "easeInOut" }
              }}
              className="text-white/20 hover:text-white transition-colors block"
            >
              <Linkedin size={18} />
            </motion.a>
            <motion.a 
              href={`mailto:${PROFILE.email}`}
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ 
                y: [0, -6, 2, -1, 0],
                rotate: [0, -7, 7, -4, 4, 0],
                color: '#ffffff',
                transition: { duration: 0.45, ease: "easeInOut" }
              }}
              className="text-white/20 hover:text-white transition-colors block"
            >
              <Mail size={18} />
            </motion.a>
            <motion.a 
              href={PROFILE.hackerrank} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ 
                y: [0, -6, 2, -1, 0],
                rotate: [0, -7, 7, -4, 4, 0],
                color: '#ffffff',
                transition: { duration: 0.45, ease: "easeInOut" }
              }}
              className="text-white/20 hover:text-white transition-colors block"
            >
              <Code size={18} />
            </motion.a>
            <motion.a 
              href={PROFILE.leetcode} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ 
                y: [0, -6, 2, -1, 0],
                rotate: [0, -7, 7, -4, 4, 0],
                color: '#ffffff',
                transition: { duration: 0.45, ease: "easeInOut" }
              }}
              className="text-white/20 hover:text-white transition-colors block"
            >
              <Code2 size={18} />
            </motion.a>
          </div>
          <p className="text-[9px] font-mono text-white/15 uppercase tracking-[0.8em]">
            © 2026 ABHRADEEP PAL • ENGINEERED FOR SYSTEMS INTELLIGENCE
          </p>
        </div>
      </footer>

      {/* Floating System Success/Failure Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-neutral-950/65 border border-blue-500/30 rounded-xl shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">System Alert</p>
              <p className="text-[11px] font-light text-white/90 mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
