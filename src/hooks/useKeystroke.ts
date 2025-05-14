import { useState, useEffect, useRef } from "react";

export function useKeystroke(): string | null {
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const keyDownRef = useRef<boolean>(false); // prevents repeat firing

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!keyDownRef.current) {
        keyDownRef.current = true;
        setKeyPressed(event.key);
      }
    };

    const handleKeyUp = () => {
      keyDownRef.current = false;
      setKeyPressed(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keyPressed;
}
