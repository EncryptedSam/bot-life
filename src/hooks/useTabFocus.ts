import { useEffect, useRef } from "react";

export function useTabFocus(callback: (isFocused: boolean) => void) {
  const isDocumentVisible = useRef<boolean>(!document.hidden);

  useEffect(() => {
    const handleFocus = () => {
      if (!document.hidden && !isDocumentVisible.current) {
        isDocumentVisible.current = true;
        callback(true);
      }
    };

    const handleBlur = () => {
      if (isDocumentVisible.current) {
        isDocumentVisible.current = false;
        callback(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      } else {
        handleFocus();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [callback]);
}
