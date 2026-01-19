'use client';

import { useEffect, useRef } from 'react';

export function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

        // Configuration des Blobs INTENSE (Couleurs plus saturées et opaques)

        const blobs = [

          { x: Math.random() * width, y: Math.random() * height, vx: 0.3, vy: 0.2, r: 350, color: 'rgba(79, 70, 229, 0.5)' }, // Indigo VIF

          { x: Math.random() * width, y: Math.random() * height, vx: -0.3, vy: 0.3, r: 300, color: 'rgba(6, 182, 212, 0.5)' }, // Cyan VIF

          { x: Math.random() * width, y: Math.random() * height, vx: 0.2, vy: -0.2, r: 250, color: 'rgba(192, 38, 211, 0.5)' }, // Fuchsia VIF

          { x: Math.random() * width, y: Math.random() * height, vx: -0.2, vy: -0.3, r: 320, color: 'rgba(225, 29, 72, 0.45)' }, // Rose VIF

          { x: Math.random() * width, y: Math.random() * height, vx: 0.4, vy: 0.1, r: 280, color: 'rgba(245, 158, 11, 0.5)' }, // Amber VIF

        ];

    

        const resize = () => {

          width = window.innerWidth;

          height = window.innerHeight;

          canvas.width = width;

          canvas.height = height;

        };

        

        window.addEventListener('resize', resize);

        resize();

    

        const animate = () => {

          ctx.clearRect(0, 0, width, height);

          

          // Fond Blanc Pur pour contraste maximal avec les blobs

          ctx.fillStyle = '#FFFFFF';

          ctx.fillRect(0, 0, width, height);

    

    

          // Grille de fond subtile (Only draw on larger screens or reduce frequency)

          if (width > 768) {

            ctx.beginPath();

            ctx.strokeStyle = 'rgba(0,0,0,0.03)';

            ctx.lineWidth = 1;

            const gridSize = 50;

            for (let x = 0; x <= width; x += gridSize) {

              ctx.moveTo(x, 0);

              ctx.lineTo(x, height);

            }

            for (let y = 0; y <= height; y += gridSize) {

              ctx.moveTo(0, y);

              ctx.lineTo(width, y);

            }

            ctx.stroke();

          }

    

          // Dessin des Blobs SANS le filtre blur coûteux (géré par CSS)

          blobs.forEach(blob => {

            // Mouvement

            blob.x += blob.vx;

            blob.y += blob.vy;

    

            // Rebond sur les bords

            if (blob.x < -blob.r || blob.x > width + blob.r) blob.vx *= -1;

            if (blob.y < -blob.r || blob.y > height + blob.r) blob.vy *= -1;

    

            // Dessin

            ctx.beginPath();

            ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);

            ctx.fillStyle = blob.color;

            ctx.fill();

          });

    

          animationFrameId = requestAnimationFrame(animate);

        };

    

        animate();

    

        return () => {

          window.removeEventListener('resize', resize);

          cancelAnimationFrame(animationFrameId);

        };

      }, []);

    

        return (

    

          <canvas 

    

            ref={canvasRef} 

    

            className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-80 blur-[80px] md:blur-[120px] translate-z-0 will-change-contents"

    

          />

    

        );

    

      }

    

      

    