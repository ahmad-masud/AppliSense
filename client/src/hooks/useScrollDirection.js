import { useState, useEffect, useCallback } from "react";

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.pageYOffset;
    const direction = scrollY > lastScrollY ? "down" : "up";
    if (
      direction !== scrollDirection &&
      (scrollY - lastScrollY > 1 || scrollY - lastScrollY < -5)
    ) {
      setScrollDirection(direction);
    }
    setLastScrollY(scrollY);
  }, [lastScrollY, scrollDirection]);

  useEffect(() => {
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [updateScrollDirection]);

  return scrollDirection;
}
