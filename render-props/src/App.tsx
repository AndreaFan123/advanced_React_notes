import "./App.css";
import { MouseTracker } from "./MouseTracker";

function App() {
  return (
    <div>
      <MouseTracker
        renderMousePosition={({ x, y }) => (
          <h1>
            Mouse at position:
            <br /> x: {x}, y: {y}
          </h1>
        )}
      />
    </div>
  );
}

export default App;

/**
 * Children as props
 * function App() {
  return (
    <div>
      <MouseTracker>
        {({ x, y }) => (
          <h1>
            Mouse at position:
            <br /> x: {x}, y: {y}
          </h1>
        )}
      </MouseTracker>
    </div>
  );
}

export default App;
 */
