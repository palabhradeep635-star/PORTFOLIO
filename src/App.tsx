/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
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
  AlertCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typewriter from 'typewriter-effect';
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

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const particleCount = 45;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-30" />;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Evolution', href: '#evolution' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

 return (
  <nav
    className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled
        ? "bg-black/70 backdrop-blur-xl border-b border-white/5 py-4"
        : "bg-transparent py-6 sm:py-8"
    )}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

      {/* Logo */}
      <motion.a
        href="#"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xl font-bold tracking-tighter flex items-center gap-3 group"
      >
        <div className="relative w-11 h-11 flex items-center justify-center transition-all duration-500 group-hover:scale-110">

          {/* Neon Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 opacity-30 blur-xl group-hover:opacity-70 transition-all duration-500" />

          {/* Logo */}
          <img
            src="/ap-logo.png"
            alt="AP Logo"
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(120,119,255,0.95)]"
          />
        </div>

        <span className="hidden sm:inline tracking-[0.25em] font-mono text-[11px] text-white/90 group-hover:text-white transition-colors duration-500">
          ABHRADEEP PAL
        </span>
      </motion.a>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <motion.a
            key={link.name}
            href={link.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/55 hover:text-white transition-colors relative group"
          >
            {link.name}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded bg-blue-500 transition-all duration-300 group-hover:w-full" />
          </motion.a>
        ))}

        <motion.a
          href="#contact"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-5 py-2 glass-card hover:bg-white hover:text-black border border-white/10 transition-all duration-300 tracking-wider font-mono text-[9px] rounded-lg"
        >
          GET IN TOUCH
        </motion.a>
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-white p-2 glass-card rounded-lg focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

    </div>

    {/* Mobile Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 p-6 sm:p-8 md:hidden flex flex-col gap-4 shadow-xl font-mono text-center"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-widest text-white/60 hover:text-white py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}

          <a
            href="#contact"
            className="mt-2 text-center px-5 py-3 bg-white text-black hover:bg-white/90 border border-white/10 transition-all duration-300 tracking-wider font-mono text-[9px] font-bold rounded-lg uppercase"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            GET IN TOUCH
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);
};
const Section = ({ id, title, subtitle, children, className }: { id: string, title: string, subtitle?: string, children: React.ReactNode, className?: string }) => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        }
      });

      tl.from(".section-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(".section-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={sectionRef} className={cn("py-16 sm:py-24 px-4 sm:px-6 relative", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 section-header">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-10 bg-gradient-to-r from-blue-500 to-transparent" />
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-blue-400">{id}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4 sm:mb-5">{title}</h2>
          {subtitle && <p className="text-white/45 max-w-2xl text-xs sm:text-sm md:text-base font-light leading-relaxed">{subtitle}</p>}
        </div>
        <div className="section-content">
          {children}
        </div>
      </div>
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
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.08 }}
    whileHover={{ y: -8 }}
    className="group relative glass-card p-6 sm:p-8 md:p-10 rounded-3xl card-glow flex flex-col justify-between"
  >
    {/* Animated Background Gradient on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
    
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
            whileHover={{ scale: 1.1, rotate: 45 }}
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
      <div className="relative border-l border-white/5 ml-2.5 sm:ml-4 md:ml-10 pl-5 sm:pl-8 md:pl-16 space-y-12 sm:space-y-16 py-4">
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-blue-500 via-purple-500 to-transparent pointer-events-none" />
        
        {roadmap.map((milestone, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline center node */}
            <div className={cn(
              "absolute left-0 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 flex items-center justify-center z-10",
              idx === 0 ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
            )}>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                idx === 0 ? "bg-cyan-400" : "bg-purple-400"
              )} />
            </div>

            {/* Content Card layout */}
            <div className="glass-card p-5 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] card-glow hover:border-white/10 transition-all">
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
          </motion.div>
        ))}
      </div>
    </Section>
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
  const [dispatchDetails, setDispatchDetails] = useState<{ delivered?: boolean; fallbackUsed?: boolean } | null>(null);

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

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Parallax effect for hero background strictly on non-mobile screens to preserve GPU performance
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.to(".hero-bg", {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden antialiased">
      <ScrollProgress />
      <ParticleBackground />
      <div className="bg-mesh" />
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen py-24 md:py-0 md:h-screen flex items-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 hero-bg pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 hero-content">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-card text-[9px] font-mono text-blue-400 mb-8 tracking-[0.2em] border border-blue-500/15">
            <Zap size={12} className="animate-pulse text-cyan-400" />
            OPEN TO OPPORTUNITIES
          </div>
          
          <h1 className="text-[11vw] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-bold tracking-tighter mb-6 leading-[0.9] sm:leading-[0.85] uppercase">
            <span className="block">{PROFILE.name.split(' ')[0]}</span>
            <span className="text-gradient block">{PROFILE.name.split(' ')[1]}</span>
          </h1>
          
          <div className="text-base sm:text-xl md:text-[1.75rem] text-white/50 max-w-2xl mb-10 leading-normal font-light font-mono min-h-[5rem] sm:min-h-[3.5rem] md:min-h-[3rem]">
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
          </div>

          <div className="flex flex-wrap gap-5 items-center">
            <motion.a 
              href="#projects" 
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2.5 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 tracking-wider text-[11px]"
            >
              EXPLORE WORKS
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.a>
            
            <div className="flex items-center gap-6 px-4">
              {[
                { icon: Github, href: PROFILE.actualGithub },
                { icon: Linkedin, href: PROFILE.linkedin },
                { icon: Code, href: PROFILE.hackerrank },
                { icon: Mail, href: `mailto:${PROFILE.email}` }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  target={social.href.startsWith('mailto') ? undefined : "_blank"}
                  rel={social.href.startsWith('mailto') ? undefined : "noopener noreferrer"}
                  whileHover={{ y: -3, color: '#60A5FA' }}
                  className="text-white/35 transition-colors"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements side rail */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-16 items-center">
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <p className="text-[9px] font-mono text-white/15 uppercase tracking-[0.8em] [writing-mode:vertical-rl] rotate-180">
            SCROLL TO EXPLORE
          </p>
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>
      </section>

      {/* Narrative (About) Section updated to reduce text-density */}
      <Section id="about" title="The Narrative" subtitle="The balance of high-level algorithmic logic and target hardware precision.">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            <div className="space-y-6 text-xs sm:text-sm text-white/50 leading-relaxed font-light">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-white font-mono text-xs uppercase tracking-widest mb-1.5 text-blue-400 font-semibold">01 / CORE SYNTHESIS</p>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">{ABOUT_INTRO}</p>
              </div>
              <div className="border-l-2 border-purple-500 pl-4 mt-8">
                <p className="text-white font-mono text-xs uppercase tracking-widest mb-1.5 text-purple-400 font-semibold">02 / EMBEDDED AI SPECIALIZATION</p>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">{ABOUT_TECH_SPECIALIZATION}</p>
              </div>
              <div className="border-l-2 border-pink-500 pl-4 mt-8">
                <p className="text-white font-mono text-xs uppercase tracking-widest mb-1.5 text-pink-400 font-semibold">03 / ENGINEERING TARGET</p>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">{ABOUT_DIRECTION}</p>
              </div>
            </div>
            
            <motion.div 
              whileHover={{ x: 6 }}
              className="p-6 sm:p-8 glass-card border-l-4 border-blue-500/50 rounded-2xl card-glow"
            >
              <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3 sm:mb-4 text-blue-400">Core Architecture Mission</h4>
              <p className="text-xs sm:text-sm font-light italic text-white/80 leading-relaxed">"{CAREER_OBJECTIVE}"</p>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { label: 'PROTOTYPES', value: '05+', icon: Layers },
              { label: 'UNIVERSITY', value: 'CU', icon: Globe },
              { label: 'LOCATION', value: 'IND', icon: MapPin },
              { label: 'CENTRIC FOCUS', value: 'AI/IOT', icon: Cpu }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="aspect-square glass-card p-4 sm:p-6 md:p-8 flex flex-col justify-between group hover:border-blue-500/20 transition-all card-glow"
              >
                <stat.icon size={18} className="text-white/15 group-hover:text-blue-400 transition-colors" />
                <div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold block mb-1 tracking-tighter text-white">{stat.value}</span>
                  <span className="text-[8px] sm:text-[9px] font-mono text-white/30 uppercase tracking-widest block">{stat.label}</span>
                </div>
              </motion.div>
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
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 sm:p-8 md:p-10 glass-card rounded-2xl hover:border-blue-500/20 transition-all group card-glow"
            >
              <div className="mb-6 sm:mb-8 text-white/25 group-hover:text-blue-400 transition-colors duration-500">
                <skillGroup.icon size={28} className="sm:size-[32px]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 tracking-tight text-white">{skillGroup.category}</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {skillGroup.items.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white/5 border border-white/5 text-[8px] sm:text-[9px] font-mono text-white/45 rounded-lg hover:bg-white/10 hover:text-white transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Selected Works (Projects) Section */}
      <Section id="projects" title="Selected Works" subtitle="Complete system designs proving practical performance metrics.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </Section>

      {/* Academic Path (Education) Section */}
      <Section id="education" title="Academic Path" className="bg-zinc-950/20">
        <div className="space-y-6">
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={`${edu.institution}-${edu.degree}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-6 md:gap-8 md:items-center justify-between p-6 sm:p-8 md:p-10 glass-card rounded-2xl group hover:border-blue-500/20 transition-all card-glow"
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
              </div>
              
              <div className="text-left md:text-right shrink-0 border-l md:border-l-0 md:border-r border-white/5 pl-4 md:pl-0 md:pr-6 mt-4 md:mt-0">
                <div className="text-lg sm:text-xl font-bold mb-1 tracking-tighter text-white">{edu.period}</div>
                <div className="text-[8px] sm:text-[9px] font-mono text-white/30 uppercase tracking-widest">{edu.location}</div>
              </div>
            </motion.div>
          ))}


        </div>
      </Section>

      {/* Contact Section updated with requested professional placeholders */}
      <Section id="contact" title="Initiate Contact" subtitle="Available for collaborations, academic projects, and industry internships.">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <p className="text-xl sm:text-2xl font-light text-white/45 leading-relaxed">
              Open to <span className="text-white font-medium">internships</span>, collaborative engineering projects, and <span className="text-white font-medium font-mono">AI/Embedded Systems</span> opportunities. Let us connect.
            </p>
            
            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: 'Email Address', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
                { icon: Linkedin, label: 'LinkedIn', value: 'Abhradeep Pal', href: PROFILE.linkedin },
                { icon: Github, label: 'GitHub', value: '@palabhradeep635', href: PROFILE.actualGithub },
                { icon: Code, label: 'HackerRank', value: '25BAI70056', href: PROFILE.hackerrank }
              ].map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.href}
                  target={item.href.startsWith('mailto') ? undefined : "_blank"}
                  rel={item.href.startsWith('mailto') ? undefined : "noopener noreferrer"}
                  whileHover={{ y: -3 }}
                  className="p-4 sm:p-6 glass-card rounded-2xl group hover:border-blue-500/20 transition-all card-glow min-w-0"
                >
                  <item.icon size={18} className="text-white/15 mb-3 sm:mb-4 group-hover:text-blue-400 transition-colors" />
                  <p className="text-[7.5px] sm:text-[8px] font-mono text-white/25 uppercase tracking-widest mb-1 truncate">{item.label}</p>
                  <p className="text-[10px] sm:text-xs font-medium truncate text-white/80">{item.value}</p>
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 glass-card p-6 sm:p-8 md:p-10 rounded-[1.5rem] relative card-glow overflow-hidden"
          >
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
                    className="w-full py-4.5 bg-blue-500 hover:bg-blue-600 font-bold rounded-xl transition-all tracking-[0.2em] text-[10px] text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          </motion.div>
        </div>
      </Section>

      <footer className="py-16 px-6 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8 flex justify-center gap-6">
            <a href={PROFILE.actualGithub} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors"><Github size={18} /></a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors"><Linkedin size={18} /></a>
            <a href={PROFILE.hackerrank} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors"><Code size={18} /></a>
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
            className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-[#0d1117]/95 border border-blue-500/30 rounded-xl shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex items-center gap-3 backdrop-blur-md"
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
