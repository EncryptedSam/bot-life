import { useEffect } from "react";

export function usePreventBrowserDefaults() {
  useEffect(() => {
    const preventZoom = (e: WheelEvent | KeyboardEvent) => {
      if (
        (e instanceof WheelEvent && e.ctrlKey) ||
        (e instanceof KeyboardEvent &&
          (e.ctrlKey || e.metaKey) &&
          ["+", "-", "=", "0"].includes(e.key))
      ) {
        e.preventDefault();
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    window.addEventListener("wheel", preventZoom, { passive: false });
    window.addEventListener("keydown", preventZoom);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      window.removeEventListener("wheel", preventZoom);
      window.removeEventListener("keydown", preventZoom);
    };
  }, []);
}
