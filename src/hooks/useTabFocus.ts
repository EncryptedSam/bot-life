import { useEffect, useRef } from "react";

export function useTabFocus(onFocus: () => void, onBlur: () => void) {
  const isDocumentVisible = useRef<boolean>(!document.hidden);

  useEffect(() => {
    const handleFocus = () => {
      if (!document.hidden && !isDocumentVisible.current) {
        isDocumentVisible.current = true;
        onFocus();
      }
    };

    const handleBlur = () => {
      if (isDocumentVisible.current) {
        isDocumentVisible.current = false;
        onBlur();
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
  }, [onFocus, onBlur]);
}
