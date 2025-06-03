import { useEffect, useRef, useState } from "react";
import { usePreventBrowserDefaults } from "../hooks/usePreventBrowserDefaults";
import Droppable from "../components/Droppable";
import Hero from "../components/Hero";
import Bullet from "../components/Bullet";
import ScoreBoard from "../components/ScoreBoard";
import GamePad from "../components/GamePad";
import { GameState, useGameState } from "../contexts/useGameState";
import Modal from "../components/Modal";
import PauseCard from "../components/PauseCard";
import Vault from "../components/Vault";
import Intro from "../components/Intro";
import Bindings from "../components/Bindings";
import { Entity, initGame, updateInitAnimation, resolveInputKeys, updatePosition, clearRemoved } from "../ecs/all";


const GameHtml = () => {
    usePreventBrowserDefaults();
    const boardRef = useRef<HTMLDivElement>(null);
    const entitiesRef = useRef<Entity[]>([]);
    const [_, setRender] = useState(performance.now());
    const { state, setState } = useGameState();

    useEffect(() => {
        let request: any;
        let lastTime = performance.now();
        const entities = entitiesRef.current;
        const board = boardRef.current;


        function gameLoop(time: number) {
            const delta = time - lastTime;
            lastTime = time;

            initGame(entities, board)
            updateInitAnimation(entities, delta / 1000)
            clearRemoved(entities);
            updatePosition(entities, delta / 1000)

            setRender(performance.now());
            request = requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(request);
        };
    }, []);

    useEffect(() => {
        const keysSet = new Set<string>();
        const handleKeyDown = (event: KeyboardEvent) => {
            keysSet.add(event.key);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            keysSet.delete(event.key);
        };

        let interval = setInterval(() => {
            resolveInputKeys(entitiesRef.current, [...keysSet])
        }, 1);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            clearInterval(interval);
        };
    }, []);

    return (
        <div
            className="bg-[#1E1E1E] flex justify-center h-screen"
        >
            <div
                ref={boardRef}
                className="relative w-[450px] border-white border-8 !box-content rounded-[2px] h-[calc(100%-16px)] bg-white overflow-hidden"
                style={{ boxShadow: 'inset 6px 6px 0px rgba(0, 0, 0, 0.4)' }}
            >

                <div
                    className="absolute left-0 top-0 graph w-full h-full"
                    style={{
                        backgroundPositionY: entitiesRef.current[0]?.position?.y,
                        backgroundPositionX: entitiesRef.current[0]?.position?.x
                    }}
                />

                <Droppable />


                {
                    entitiesRef.current.map((entity, idx) => {
                        const entities = [];




                        if (entity.type == 'player') {
                            let { firing, position, glide } = entity;
                            if (!position) return;


                            entities.push(
                                <Hero
                                    key={`entity_${idx}`}
                                    firing={firing == true}
                                    x={position.x}
                                    y={position.y}
                                    flying={glide == true}
                                />
                            )
                        }

                        if (entity.type == 'bullet') {
                            let { position } = entity;
                            if (!position) return;

                            entities.push(
                                <Bullet
                                    key={`entity_${idx}`}
                                    x={position.x}
                                    y={position.y}
                                />
                            )
                        }

                        return entities;
                    })
                }


                <>
                    <ScoreBoard
                        onClickPlay={() => { setState(GameState.Paused) }}
                        onClickVault={() => { setState(GameState.ShowVault) }}
                        onClickPad={() => { setState(GameState.ShowBindings) }}
                    />

                    <GamePad />
                    {
                        GameState.Paused == state &&
                        <Modal>
                            <PauseCard
                                onClickPlay={() => { setState(GameState.Playing) }}
                                onClickHome={() => { setState(GameState.Home) }}
                                onClickRestart={() => { setState(GameState.Restart) }}
                            />
                        </Modal>
                    }
                    {
                        GameState.ShowVault == state &&
                        <Modal>
                            <Vault
                                onCancel={() => { setState(GameState.Playing) }}
                            />
                        </Modal>
                    }

                    {
                        GameState.ShowBindings == state &&
                        <Modal>
                            <Bindings
                                onCancel={() => { setState(GameState.Playing) }}
                            />
                        </Modal>
                    }

                    {
                        GameState.Home == state &&
                        <Modal>
                            <Intro
                                onClickPlay={() => { setState(GameState.Playing) }}
                            />
                        </Modal>
                    }
                </>

            </div>
        </div>
    )
}

export default GameHtml





/**


[ ] board
    - entity
    - component
    - singleton
[ ] 





[x] start 
[x] play/pause
[x] show short cuts
[ ] you lose


*/