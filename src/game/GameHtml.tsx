import { useEffect, useRef, useState } from "react";
import { usePreventBrowserDefaults } from "../hooks/usePreventBrowserDefaults";
import Droppable from "../components/Droppable";
import Hero from "../components/Hero";
import Bullet from "../components/Bullet";
import ScoreBoard from "../components/ScoreBoard";
import GamePad from "../components/GamePad";
import Modal from "../components/Modal";
import PauseCard from "../components/PauseCard";
import Vault from "../components/Vault";
import Intro from "../components/Intro";
import Bindings from "../components/Bindings";
import { Entity, initGame, updateInitAnimation, resolveInputKeys, updatePosition, clearRemoved, deployDrops, resolvePlayerDropCollision, resolveBulletDropCollision, resolveHurt, updateStressAndEnergy } from "../ecs/all";
import { useTabFocus } from "../hooks/useTabFocus";

const GameHtml = () => {
    usePreventBrowserDefaults();
    const boardRef = useRef<HTMLDivElement>(null);
    const entitiesRef = useRef<Entity[]>([]);
    const [_, setRender] = useState(performance.now());

    useEffect(() => {
        let request: any;
        let lastTime = performance.now();
        const entities = entitiesRef.current;
        const board = boardRef.current;


        function gameLoop(time: number) {
            const delta = time - lastTime;
            lastTime = time;

            const gameboard = entities[0];
            let isPlaying = true;

            if (gameboard && gameboard.state) {
                isPlaying = gameboard.state == 'playing' ? true : false;
            }

            if (isPlaying) {
                initGame(entities, board)
                updateInitAnimation(entities, delta / 1000)
                clearRemoved(entities);
                deployDrops(entities);
                updateStressAndEnergy(entities, delta / 1000);
                updatePosition(entities, delta / 1000)
                resolvePlayerDropCollision(entities);
                resolveBulletDropCollision(entities);
                resolveHurt(entities, delta / 1000)
            }

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


    useTabFocus(
        () => { },
        () => {
            const gameboard = entities[0];
            gameboard.state = 'paused';
        }
    )

    const handleGameState = (value: Entity['state']) => {
        let entities = entitiesRef.current;
        const gameboard = entities[0];

        if (gameboard) {
            gameboard.state = value;
        }
    }


    let entities = entitiesRef.current;

    const gameboard = entities[0];
    let isPlaying = false;
    let showHome = true;
    let paused = false;
    let showVault = false;
    let showBindings = false;


    if (gameboard && gameboard.state) {
        isPlaying = gameboard.state == 'playing';
        showHome = gameboard.state == 'home';
        showBindings = gameboard.state == 'bindingsOpen';
        showVault = gameboard.state == 'vaultOpen';
        paused = gameboard.state == 'paused';
    }

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
                        backgroundPositionY: entitiesRef.current[0]?.position?.y
                    }}
                />

                {/* <Droppable x={0} y={10} /> */}

                {
                    entitiesRef.current.map((entity, idx) => {
                        const entities = [];

                        if (entity.type == 'drop') {
                            const gameboard = entitiesRef.current[1];
                            let { position, item, hurtEffect } = entity;
                            if (!position) return;
                            if (!hurtEffect) return;
                            if (!item) return;
                            if (!gameboard.dropsLife) return;

                            entities.push(<Droppable
                                type={item}
                                key={`entity_${idx}`}
                                x={position.x}
                                y={position.y}
                                hp={gameboard.dropsLife[item] / 1000 * 100}
                                hurt={(hurtEffect?.flashValue / hurtEffect?.max) * 1}
                            />);
                        }

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
                    {
                        entities[1] &&
                        entities[1].type == 'gameboard' &&
                        typeof entities[1].bullets == 'number' &&
                        typeof entities[1].money == 'number' &&
                        typeof entities[1].stress == 'number' &&
                        typeof entities[1].energy == 'number' &&
                        <ScoreBoard
                            data={{
                                bullets: { acquired: entities[1].bullets, segments: 5, total: 1000 },
                                energy: { acquired: entities[1].energy, segments: 5, total: 1000 },
                                money: { acquired: entities[1].money, segments: 5, total: 1000 },
                                stress: { acquired: entities[1].stress, segments: 5, total: 1000 },
                            }}

                            onClickPlay={() => { handleGameState('paused') }}
                            onClickVault={() => { handleGameState('vaultOpen') }}
                            onClickPad={() => { handleGameState('bindingsOpen') }}
                        />
                    }

                    <GamePad />
                    {
                        paused &&
                        <Modal>
                            <PauseCard
                                onClickPlay={() => { handleGameState('playing') }}
                                onClickHome={() => { handleGameState('home') }}
                                onClickRestart={() => { handleGameState('restarted') }}
                            />
                        </Modal>
                    }
                    {
                        showVault &&
                        <Modal>
                            <Vault
                                onCancel={() => { handleGameState('playing') }}
                            />
                        </Modal>
                    }

                    {
                        showBindings &&
                        <Modal>
                            <Bindings
                                onCancel={() => { handleGameState('playing') }}
                            />
                        </Modal>
                    }

                    {
                        showHome &&
                        <Modal>
                            <Intro
                                onClickPlay={() => { handleGameState('playing') }}
                            />
                        </Modal>
                    }
                </>

            </div>
        </div>
    )
}

export default GameHtml



