import React, { useRef, useEffect, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { Theme, Point, Particle, FloatingText, VocabularyItem } from '../types';
import { audioService } from '../services/audioService';

interface GameCanvasProps {
  theme: Theme;
  onScoreUpdate: (score: number) => void;
  setDebugInfo: (info: string) => void;
}

const SNAKE_SEGMENT_DISTANCE = 12; 
const SNAKE_SPEED_MULTIPLIER = 0.18; 
const RANDOM_WANDER_SPEED = 3;
const FOOD_SIZE = 40; // Slightly larger to fit text
const COMBO_TIMEOUT_MS = 2500; // Longer timeout to allow listening to the word

export const GameCanvas: React.FC<GameCanvasProps> = ({ theme, onScoreUpdate, setDebugInfo }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>(0);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  
  // State Refs 
  const isCameraReadyRef = useRef(false);
  const isVisionReadyRef = useRef(false);

  // Game State Refs
  const snakeRef = useRef<Point[]>([]); 
  const targetRef = useRef<Point>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const foodRef = useRef<{ x: number, y: number, vocab: VocabularyItem, scale: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const scoreRef = useRef(0);
  const wanderAngleRef = useRef(0);
  const isHandDetectedRef = useRef(false);
  
  // Combo System Refs
  const comboCountRef = useRef(0);
  const lastEatTimeRef = useRef(0);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    const initVision = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.2,
          minHandPresenceConfidence: 0.2,
          minTrackingConfidence: 0.2
        });
        handLandmarkerRef.current = handLandmarker;
        isVisionReadyRef.current = true;
        setDebugInfo("Vision Ready - Point at camera");
      } catch (e) {
        console.error("Failed to load MediaPipe:", e);
        setDebugInfo("Error loading vision model.");
      }
    };
    initVision();
  }, [setDebugInfo]);

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              isCameraReadyRef.current = true;
              videoRef.current?.play();
            };
          }
        } catch (error) {
          console.error("Camera error:", error);
          setDebugInfo("Camera access denied.");
        }
      }
    };
    startCamera();
  }, [setDebugInfo]);

  // Initialize Game State
  useEffect(() => {
    // Reset or Initialize
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    snakeRef.current = Array(25).fill({ x: startX, y: startY });
    spawnFood();
    
    const initAudio = () => {
        audioService.init().catch(() => {});
        window.removeEventListener('click', initAudio);
        window.removeEventListener('touchstart', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('touchstart', initAudio);

    return () => {
        window.removeEventListener('click', initAudio);
        window.removeEventListener('touchstart', initAudio);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const spawnFood = useCallback(() => {
    if (!canvasRef.current) return;
    const padding = 80; // More padding to ensure text fits
    const x = padding + Math.random() * (canvasRef.current.width - padding * 2);
    const y = padding + Math.random() * (canvasRef.current.height - padding * 2);
    
    // Pick random vocabulary item
    const vocab = theme.vocabulary[Math.floor(Math.random() * theme.vocabulary.length)];
    
    foodRef.current = { x, y, vocab, scale: 0 };
  }, [theme]);

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color
      });
    }
  };

  const createFloatingText = (x: number, y: number, text: string, subText: string | undefined, color: string, size: number = 24) => {
      floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x,
          y,
          text,
          subText,
          life: 1.0,
          color,
          size
      });
  };

  const updateGame = (timestamp: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect Hands
    if (isVisionReadyRef.current && isCameraReadyRef.current && videoRef.current && handLandmarkerRef.current) {
      if (videoRef.current.currentTime > 0 && !videoRef.current.paused && !videoRef.current.ended) {
        let startTimeMs = performance.now();
        const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
        
        if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            const tip = landmarks[8];
            const targetX = (1 - tip.x) * canvas.width;
            const targetY = tip.y * canvas.height;
            
            targetRef.current = { x: targetX, y: targetY };
            isHandDetectedRef.current = true;
        } else {
            isHandDetectedRef.current = false;
        }
      }
    }

    // --- GAME LOGIC ---

    // 1. Move Head
    const head = snakeRef.current[0];
    let nextX = head.x;
    let nextY = head.y;

    if (isHandDetectedRef.current) {
      nextX += (targetRef.current.x - head.x) * SNAKE_SPEED_MULTIPLIER;
      nextY += (targetRef.current.y - head.y) * SNAKE_SPEED_MULTIPLIER;
    } else {
      wanderAngleRef.current += (Math.random() - 0.5) * 0.2;
      nextX += Math.cos(wanderAngleRef.current) * RANDOM_WANDER_SPEED;
      nextY += Math.sin(wanderAngleRef.current) * RANDOM_WANDER_SPEED;

      if (nextX < 0 || nextX > canvas.width) {
        wanderAngleRef.current = Math.PI - wanderAngleRef.current;
        nextX = Math.max(0, Math.min(canvas.width, nextX));
      }
      if (nextY < 0 || nextY > canvas.height) {
        wanderAngleRef.current = -wanderAngleRef.current;
        nextY = Math.max(0, Math.min(canvas.height, nextY));
      }
    }

    // 2. Update Body (IK Constraint)
    const newSnake = [...snakeRef.current];
    newSnake[0] = { x: nextX, y: nextY };

    for (let i = 1; i < newSnake.length; i++) {
        const prev = newSnake[i - 1];
        const curr = newSnake[i];
        
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > SNAKE_SEGMENT_DISTANCE) {
            const angle = Math.atan2(dy, dx);
            const newX = prev.x - Math.cos(angle) * SNAKE_SEGMENT_DISTANCE;
            const newY = prev.y - Math.sin(angle) * SNAKE_SEGMENT_DISTANCE;
            newSnake[i] = { x: newX, y: newY };
        }
    }
    snakeRef.current = newSnake;

    // 3. Collision & Food Logic
    if (foodRef.current) {
        // Animate food appearance
        if (foodRef.current.scale < 1) {
            foodRef.current.scale += 0.05;
        }

        const dx = head.x - foodRef.current.x;
        const dy = head.y - foodRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < FOOD_SIZE + 5) {
            // EAT!
            
            // Calculate Combo
            const now = Date.now();
            if (now - lastEatTimeRef.current < COMBO_TIMEOUT_MS) {
                comboCountRef.current += 1;
            } else {
                comboCountRef.current = 1;
            }
            lastEatTimeRef.current = now;

            // Score Logic
            scoreRef.current += 1;
            onScoreUpdate(scoreRef.current);

            // Effects
            const vocab = foodRef.current.vocab;
            
            // Speak Cantonese
            audioService.speakCantonese(vocab.cantonese);
            audioService.playEatSound(1);

            createParticles(foodRef.current.x, foodRef.current.y, theme.particleColor);
            
            // Show Jyutping and Meaning
            createFloatingText(
                foodRef.current.x, 
                foodRef.current.y, 
                vocab.jyutping, 
                vocab.english, 
                "#ffffff", 
                32
            );
            
            // Grow snake
            for(let k=0; k<2; k++) {
                snakeRef.current.push(snakeRef.current[snakeRef.current.length - 1]);
            }
            
            spawnFood();
        }
    }

    // 4. Update Particles
    particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
    });
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    // 5. Update Floating Texts
    floatingTextsRef.current.forEach(ft => {
        ft.y -= 1.5; // Float up faster
        ft.life -= 0.015; // Last slightly longer
    });
    floatingTextsRef.current = floatingTextsRef.current.filter(ft => ft.life > 0);


    // --- DRAWING ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background with transparency
    ctx.fillStyle = theme.backgroundColor + "E6"; // ~90% opacity for better contrast with text
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Particles
    ctx.save();
    particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();

    // Draw Food (Vocabulary)
    if (foodRef.current) {
        ctx.save();
        ctx.translate(foodRef.current.x, foodRef.current.y);
        const pulse = (1 + Math.sin(timestamp / 200) * 0.1) * foodRef.current.scale;
        ctx.scale(pulse, pulse);
        
        // Glow
        ctx.shadowBlur = 25;
        ctx.shadowColor = theme.particleColor;
        
        // Emoji
        ctx.font = `${FOOD_SIZE}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(foodRef.current.vocab.emoji, 0, -10);
        
        // Cantonese Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(foodRef.current.vocab.cantonese, 0, 25);
        
        ctx.restore();
    }

    // Draw Snake
    if (snakeRef.current.length > 0) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Spine
        ctx.beginPath();
        ctx.moveTo(snakeRef.current[0].x, snakeRef.current[0].y);
        for (let i = 1; i < snakeRef.current.length; i++) {
             ctx.lineTo(snakeRef.current[i].x, snakeRef.current[i].y);
        }
        ctx.shadowBlur = 20;
        ctx.shadowColor = theme.snakeBodyColor;
        ctx.lineWidth = 0; 
        ctx.stroke(); 

        ctx.shadowBlur = 0; 

        // Segments
        for (let i = snakeRef.current.length - 1; i >= 0; i--) {
            const point = snakeRef.current[i];
            const isHead = i === 0;
            const baseSize = 14;
            const taperFactor = 1 - (i / (snakeRef.current.length + 5));
            const size = Math.max(4, baseSize * taperFactor);

            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = isHead ? theme.snakeHeadColor : theme.snakeBodyColor;
            
            if (isHead) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = theme.snakeHeadColor;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Draw Floating Text (Learning Feedback)
    floatingTextsRef.current.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = ft.life;
        ctx.textAlign = 'center';
        
        // Main Text (Jyutping)
        ctx.font = `bold ${ft.size}px monospace`;
        ctx.fillStyle = theme.particleColor; // Use theme highlight color
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        
        // Sub Text (English)
        if (ft.subText) {
            ctx.font = `italic 18px sans-serif`;
            ctx.fillStyle = "#e2e8f0";
            ctx.lineWidth = 2;
            ctx.strokeText(ft.subText, ft.x, ft.y + 25);
            ctx.fillText(ft.subText, ft.x, ft.y + 25);
        }
        ctx.restore();
    });

    // Draw Debug Target
    if (isHandDetectedRef.current) {
        ctx.beginPath();
        ctx.arc(targetRef.current.x, targetRef.current.y, 20, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.arc(targetRef.current.x, targetRef.current.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    requestRef.current = requestAnimationFrame(updateGame);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <>
      <video 
        ref={videoRef} 
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 pointer-events-none"
        style={{ transform: "scaleX(-1)" }}
        playsInline 
        muted 
        autoPlay 
      />
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full absolute top-0 left-0 touch-none z-10"
      />
    </>
  );
};