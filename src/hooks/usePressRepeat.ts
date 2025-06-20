import { useEffect, useRef } from "react";

type UsePressRepeatProps = {
  onChange: (status: "pressed" | "released") => void;
  interval?: number;
};

export const usePressRepeat = ({
  onChange,
  interval = 50,
}: UsePressRepeatProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isActive = useRef(false);

  const start = () => {
    if (isActive.current) return;
    isActive.current = true;
    onChange("pressed");
    timerRef.current = setInterval(() => onChange("pressed"), interval);
  };

  const stop = () => {
    if (!isActive.current) return;
    isActive.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    onChange("released");
  };

  useEffect(() => {
    const handleGlobalUp = () => stop();
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    window.addEventListener("touchcancel", handleGlobalUp);

    return () => {
      stop();
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
      window.removeEventListener("touchcancel", handleGlobalUp);
    };
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchEnd: stop,
    onTouchCancel: stop,
  };
};
