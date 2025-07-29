import { useEffect, useState } from "react";

const TAILWIND_SM_BREAKPOINT = 640;

const useIsSmallScreen = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth < TAILWIND_SM_BREAKPOINT;
};

export default useIsSmallScreen;
