import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play, Trophy } from 'lucide-react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
  };

  const generateFood = useCallback((): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food is not on snake
      if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Body collision
      if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const timer = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(timer);
  }, [moveSnake]);

  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
    }
  }, [isGameOver, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff'; // Glitch Magenta
    ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
    
    // Food Glitch Effect
    if (Math.random() > 0.9) {
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(food.x * cellSize - 4, food.y * cellSize + 2, 4, cellSize - 4);
    }

    // Snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : 'white';
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      
      // Snake Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      for (let j = 0; j < cellSize; j += 4) {
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize + j, cellSize, 1);
      }
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] font-retro">
        <div className="flex flex-col">
          <span className="text-glitch-cyan/40 text-[8px] uppercase tracking-tighter">DATA_HARVESTED</span>
          <span className="text-xl font-bold text-glitch-cyan glitch-text">{score.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-glitch-magenta/40 text-[8px] uppercase tracking-tighter">MAX_INTEGRITY</span>
          <div className="flex items-center gap-2 text-glitch-magenta text-xl font-bold">
            {highScore.toString().padStart(6, '0')}
          </div>
        </div>
      </div>

      <div className="relative crt-border overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center p-8 text-center font-retro"
            >
              {isGameOver ? (
                <>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mb-8"
                  >
                    <h2 className="text-3xl font-black text-glitch-magenta glitch-text mb-4">SYSTEM_FAILURE</h2>
                    <p className="text-glitch-cyan/60 text-[8px] leading-relaxed">ENTITY_COLLISION_DETECTED<br/>REBOOT_SEQUENCE_REQUIRED</p>
                  </motion.div>
                  <button
                    onClick={resetGame}
                    className="px-8 py-4 border-4 border-glitch-magenta bg-glitch-magenta text-black font-black hover:bg-black hover:text-glitch-magenta transition-all"
                  >
                    _REBOOT
                  </button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-10"
                  >
                    <h2 className="text-2xl font-black text-glitch-cyan glitch-text mb-6">AWAITING_INPUT</h2>
                    <div className="grid grid-cols-3 gap-1 mb-6 max-w-[120px] mx-auto opacity-50">
                       <div /> <kbd className="p-2 border border-glitch-cyan text-[8px]">^</kbd> <div />
                       <kbd className="p-2 border border-glitch-cyan text-[8px]">&lt;</kbd> <kbd className="p-2 border border-glitch-cyan text-[8px]">v</kbd> <kbd className="p-2 border border-glitch-cyan text-[8px]">&gt;</kbd>
                    </div>
                  </motion.div>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="group relative px-10 py-5 border-4 border-glitch-cyan bg-glitch-cyan text-black font-black hover:bg-black hover:text-glitch-cyan transition-all overflow-hidden"
                  >
                    <span className="relative z-10 font-retro">_INITIALIZE</span>
                    <div className="absolute top-0 left-[-100%] group-hover:left-[100%] w-full h-full bg-white/20 transition-all duration-500 skew-x-12" />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center opacity-20 hover:opacity-100 transition-opacity">
        {!isGameOver && !isPaused && (
           <button
           onClick={() => setIsPaused(true)}
           className="text-[8px] text-glitch-cyan font-retro border border-glitch-cyan px-4 py-2"
         >
           [HALT_SYSTEM]
         </button>
        )}
      </div>
    </div>
  );
};
