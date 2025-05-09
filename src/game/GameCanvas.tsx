import React, { useEffect, useRef } from "react";
import { createFruit, createHero, createSaw, entities } from "../ecs/world";
import { updatePosition, updateAnimation, render, updateOscillators } from "../ecs/systems";

const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        createHero(100, 100);
        createFruit(200, 100, 'apple');
        createFruit(300, 100, 'bananas');
        createSaw(100, 200, {
            pointA: { x: 100, y: 200 },
            pointB: { x: 300, y: 200 },
            speed: 60
        });

        let lastTime = performance.now();

        function gameLoop(time: number) {
            const delta = time - lastTime;
            lastTime = time;

            let flEntities = entities.filter(e => e.type !== "remove");

            updatePosition(flEntities, delta / 1000);
            updateOscillators(flEntities, delta);
            updateAnimation(flEntities, delta);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            render(flEntities, ctx);

            requestAnimationFrame(gameLoop);
        }

        requestAnimationFrame(gameLoop);
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} style={{ background: "#000" }} />;
};

export default GameCanvas;
