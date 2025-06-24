import { useCallback, useEffect, useRef, useState } from "react";
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
import { Entity, initGame, updateInitAnimation, resolveInputKeys, updatePosition, clearRemoved, deployDrops, resolvePlayerDropCollision, resolveBulletDropCollision, resolveHurt, updateStressAndEnergy, resetGame } from "../ecs/all";
import { useTabFocus } from "../hooks/useTabFocus";
import { DirectionKey } from "../components/JoyStick";
import CountDown from "../components/CountDown";

const GameHtml = () => {
    usePreventBrowserDefaults();
    const boardRef = useRef<HTMLDivElement>(null);
    const entitiesRef = useRef<Entity[]>([]);
    const pressedRef = useRef<string[]>([]);

    const [_, setRender] = useState(performance.now());

    useEffect(() => {
        let request: any;
        let lastTime = performance.now();
        const entities = entitiesRef.current;
        const board = boardRef.current;


        function gameLoop(time: number) {
            const delta = time - lastTime;
            lastTime = time;

            const gameboard = entities[1];
            let isPlaying = true;

            if (gameboard && gameboard.state) {
                if (gameboard.state == 'playing' || gameboard.state == 'restarted') {
                    isPlaying = true;
                } else {
                    isPlaying = false;
                }
            }

            if (isPlaying) {
                resetGame(entities, board)
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
            resolveInputKeys(entitiesRef.current, [...keysSet, ...pressedRef.current])
        }, 1);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            clearInterval(interval);
        };
    }, [pressedRef]);


    useTabFocus(
        (isFoused) => {
            if (!isFoused) {
                const gameboard = entities[1];
                gameboard.state = 'paused';
            }
        }
    )

    const handleGameState = (value: Entity['state']) => {
        let entities = entitiesRef.current;
        const gameboard = entities[1];

        if (gameboard) {
            gameboard.state = value;
        }
    }

    const handleBullet = (value: 'pressed' | 'released') => {
        if (value == 'pressed' && !pressedRef.current.includes('f')) {
            pressedRef.current.push('f');
        }

        if (value == 'released') {
            const index = pressedRef.current.indexOf("f");
            if (index !== -1) pressedRef.current.splice(index, 1);
        }
    }

    const handleGlide = (value: 'pressed' | 'released') => {
        if (value == 'pressed' && !pressedRef.current.includes(' ')) {
            pressedRef.current.push(' ');
        }

        if (value == 'released') {
            const index = pressedRef.current.indexOf(" ");
            if (index !== -1) pressedRef.current.splice(index, 1);
        }
    }

    const handleJoyStick = useCallback((value: DirectionKey[]) => {
        const current = pressedRef.current;

        value.forEach((key) => {
            if (!current.includes(key)) {
                current.push(key);
            }
        });

        for (let i = current.length - 1; i >= 0; i--) {
            //@ts-ignore
            if (!value.includes(current[i])) {
                current.splice(i, 1);
            }
        }
    }, []);


    let entities = entitiesRef.current;

    const gameboard = entities[1];
    let timeDiff: number = 0;
    if (typeof gameboard?.initTime == 'number' && !gameboard?.initialized) {
        timeDiff = (performance.now() - gameboard.initTime) / 1000;
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

                {
                    !gameboard?.initialized && gameboard?.state == 'playing' &&

                    <CountDown
                        number={timeDiff + 1 > 3 ? 3 : timeDiff + 1}
                    />
                }


                {

                    gameboard?.state == 'playing' &&
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

                    <GamePad
                        onTouchBullet={handleBullet}
                        onTouchGlide={handleGlide}
                        onTouchStick={handleJoyStick}
                    />
                    {
                        gameboard?.state == 'paused' &&
                        <Modal>
                            <PauseCard
                                onClickPlay={() => { handleGameState('playing') }}
                                onClickHome={() => { handleGameState('home') }}
                                onClickRestart={() => { handleGameState('restarted') }}
                            />
                        </Modal>
                    }
                    {
                        gameboard?.state == 'vaultOpen' &&
                        <Modal>
                            <Vault
                                onCancel={() => { handleGameState('playing') }}
                            />
                        </Modal>
                    }

                    {
                        gameboard?.state == 'bindingsOpen' &&
                        <Modal>
                            <Bindings
                                onCancel={() => { handleGameState('playing') }}
                            />
                        </Modal>
                    }

                    {
                        gameboard?.state == 'home' &&
                        <Intro
                            onClickPlay={() => { handleGameState('restarted') }}
                        />
                    }
                </>

            </div>
        </div>
    )
}

export default GameHtml



