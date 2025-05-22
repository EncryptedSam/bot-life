import { useEffect } from "react";

function useDimensionObserver(
  id: string,
  callback: (args: { width: number; height: number }) => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with id "${id}" not found`);
      return;
    }

    // Initialize ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        callback({ width, height });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [id, ...dependencies]);
}

export default useDimensionObserver;
