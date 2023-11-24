import { useState, useEffect } from "react";

interface MouseTrackerProps {
  renderMousePosition: (state: { x: number; y: number }) => JSX.Element;
}

export const MouseTracker: React.FC<MouseTrackerProps> = ({
  renderMousePosition,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return renderMousePosition(mousePosition);
};

/**
 * Children as props
 * import { useState, useEffect } from "react";

interface MouseTrackerProps {
  children: (state: { x: number; y: number }) => JSX.Element;
}

export const MouseTracker: React.FC<MouseTrackerProps> = ({
  children,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return children(mousePosition);
};
 */
