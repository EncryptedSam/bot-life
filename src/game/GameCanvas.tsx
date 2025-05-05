import React, { useEffect, useRef } from "react";
import { createHero, entities } from "../ecs/world";
import { updatePosition, updateAnimation, render } from "../ecs/systems";

const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        createHero();

        let lastTime = performance.now();

        function gameLoop(time: number) {
            const delta = time - lastTime;
            lastTime = time;

            updatePosition(entities, delta / 1000);
            updateAnimation(entities, delta);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            render(entities, ctx);

            requestAnimationFrame(gameLoop);
        }

        requestAnimationFrame(gameLoop);
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} style={{ background: "#000" }} />;
};

export default GameCanvas;
