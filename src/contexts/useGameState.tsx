import { useState, createContext, useContext, ReactNode } from "react";

export enum GameState {
  Home,
  Playing,
  Paused,
  ShowVault,
  ShowBindings,
  Restart,
  GameOver,
}

const GameStateContext = createContext<{
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
} | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(GameState.Playing);

  return (
    <GameStateContext.Provider value={{ state, setState }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("GameStateContext is not available");
  return context;
}
