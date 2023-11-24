import "./App.css";
import { useMousePosition } from "./useMousePosition";

export default function App() {
  const { x, y } = useMousePosition();

  return (
    <div>
      <h1>
        Mouse at position:
        <br /> x: {x}, y: {y}
      </h1>
    </div>
  );
}
