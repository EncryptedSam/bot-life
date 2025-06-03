import { useEffect, useRef, useState } from "react";
import { usePreventBrowserDefaults } from "../hooks/usePreventBrowserDefaults";
import { AnyEntity } from "../ecs/components";
import { cleanupRemovedEntities, initGame, processKeysInput, updatePosition } from "../ecs/systems";
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


const GameHtml = () => {
    usePreventBrowserDefaults();
    const entities = useRef<AnyEntity[]>([]);
    const { state, setState } = useGameState();
    const [_, setRender] = useState(performance.now());

    useEffect(() => {
        let lastTime = performance.now();

        let request: any;

        function gameLoop(time: number) {
            const delta = time - lastTime;
            lastTime = time;

            initGame(entities);
            cleanupRemovedEntities(entities);
            updatePosition(entities, delta / 1000);
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
            processKeysInput(entities, [...keysSet]);
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
                className="relative w-[450px] border-white border-8 !box-content rounded-[2px] h-[calc(100%-16px)] bg-white overflow-hidden"
                style={{ boxShadow: 'inset 6px 6px 0px rgba(0, 0, 0, 0.4)' }}
            >

                <div className="absolute left-0 bottom-0 graph w-full h-full moving-background" />

                <Droppable />


                {
                    entities.current.map((entity, idx) => {
                        const entities = [];


                        if (entity.type == 'hero') {

                            entities.push(
                                <Hero
                                    key={`entity_${idx}`}
                                    firing={entity.state == 'firing'}
                                    x={entity.position.x}
                                    y={entity.position.y}
                                    flying={entity.flying}
                                />
                            )
                        }

                        if (entity.type == 'bullet') {
                            entities.push(
                                <Bullet
                                    key={`entity_${idx}`}
                                    x={entity.position.x}
                                    y={entity.position.y}
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
                            {/* <YouLose /> */}
                        </Modal>
                    }



                    {/* <Modal> */}
                    {/* <Bindings /> */}
                    {/* <YouLose /> */}
                    {/* </Modal> */}
                </>


                {/* 
                <div className="absolute flex items-center justify-center top-0 left-0 w-full h-full z-20" >
                  <div
                    className="absolute bg-white opacity-[0.6] w-full h-full top-0 left-0"
                  />
                </div> 
              */}


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