# Advanced React

![](https://i.imgur.com/ZLirEbH.png)

**All notes are from book [Advanced React](https://advanced-react.com/), I highly recommend to buy it for supporting the author**, and you won't regret it, it's a great book.

## Table of Contents

- [Chapter 1: Intro to re-renders](#intro-to-re-renders)
  - [Re-renders](#re-renders)
  - [The big re-renders myth](#the-big-re-renders-myth)
  - [Moving state down](#moving-state-down)
    [The danger of custom hooks](#the-danger-of-custom-hooks)
- [Chapter 2: Elements, children as props and re-renders](#chapter-2-elements-children-as-props-and-re-renders)
  - [What is a component?](#what-is-a-component)
  - [What is an element?](#what-is-an-element)
  - [What is re-render?](#what-is-re-render)
    - [Fiber Tree](#fiber-tree)
    - [Virtual DOM](#virtual-dom)
    - [Diffing](#diffing)
  - [Children as props](#children-as-props)

<a id="intro-to-re-renders"></a>

## Chapter 1: Intro to re-renders

## State updates, nested components, and re-renders

- **Mounting**
  - React creates its component's instance for the first time, initialize its state, runs its hooks and appends elements to the DOM.
- **Unmounting**
  - React detects that a component is no longer needed, it does the final clean-up, destroy its instance and everything associated with it.
- **Re-rendering**
  - React updates an already existing component with some new information.

<a id="re-renders"></a>

### Re-rendering

- React **never goes up** the render tree when it re-renders component.

  - If a state updates somewhere in the middle, only the components **down** the tree will re-redner.

- The only way for a component **at the bottom** to affect top component is:
  - **Call state update at the top component.**
  - **Pass components as functions.**

<a id="the-big-re-renders-myth"></a>

## The big re-renders myth

**Component re-renders when its props changes**, but we need to define **props** here more specifically.

We should say **component re-renders when its state props changes**.

For example:

```javascript
import { ModalDialog } from "./components/basic-modal-dialog";
import { Button } from "./components/button";
import "./styles.scss";

export default function App() {
  // local variable won't work
  let isOpen = false;

  return (
    <div className="layout">
      {/* nothing will happen */}
      <Button onClick={() => (isOpen = true)}>Open dialog</Button>
      {/* will never show up */}
      {isOpen ? <ModalDialog onClose={() => (isOpen = false)} /> : null}
    </div>
  );
}
```

Now, let's use state variables here, and once I changed local variable to state variable, I was able to click the button and showed dialog.

```javascript
import { useState } from "react";
import { ModalDialog } from "./components/basic-modal-dialog";
import { Button } from "./components/button";
import "./styles.scss";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layout">
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
      {isOpen ? <ModalDialog onClose={() => setIsOpen(false)} /> : null}
    </div>
  );
}
```

> [Example from Advanced React](https://advanced-react.com/examples/01/02)

<a id="moving-state-down"></a>

## Moving state down

In previous example, we used `useState` to control modal open functionality, but let's dive more into it, let's say we have other components below it, are they going to re-render?

```javascript
export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layout">
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>

      {isOpen ? <ModalDialog onClose={() => setIsOpen(false)} /> : null}
      <OtherComponent1 />
      <OtherComponent2 />
      <OtherComponent3 />
    </div>
  );
}
```

The answer is **YES**, then here come the questions.

### Question 1: Do we need them to re-render?

No. We do not need those components that are not related to dialog to re-render.

### Question 2: How can we prevent **unnecessary re-render?**

- Approach 1: Use `useMemo`(We are not going to use here.)
- Approach 2: Extract component that depends on that state and the state itself into smaller component.

```javascript
export const ActionButtonOfModalDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>

      {isOpen ? <ModalDialog onClose={() => setIsOpen(false)} /> : null}
    </>
  );
};
```

```javascript
export default function App() {
  return (
    <div className="layout">
      <ActionButtonOfModalDialog />
      <OtherComponent1 />
      <OtherComponent2 />
      <OtherComponent3 />
    </div>
  );
}
```

<a id="the-danger-of-custom-hooks"></a>

## The danger of custom hooks

Sometimes we want to create our custom hooks to make our code more cleaner.

If we extract state into a custom hook as it controls the open, close and check isOpen functionality.

```javascript
// useModalDialog

export const useModalDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    return {
        isOpen,
        open:() => setIsOpen(true)
        close:() => setIsOpen(false)
    }
}
```

And we apply to the `App`

```javascript
export default function App() {
  const { isOpen, open, close } = useModalDialog();

  return (
    <div className="layout">
      <Button onClick={open}>Open dialog</Button>
      {isOpen ? <ModalDialog onClose={close} /> : null}
      <OtherComponent1 />
      <OtherComponent2 />
      <OtherComponent3 />
    </div>
  );
}
```

### Question: Would custom hook trigger re-render?

**Yes**, it still triggers re-render, eventhough we just extract them and create a custom hook, the state is still inside of `App`.

### Question: How to fix it?

We can use our custom hook inside the `ActionButtonOfModalDialog` as we make the state lives in the component.

```javascript
export const ActionButtonOfModalDialog = () => {
  const { isOpen, open, close } = useModalDialog();

  return (
    <>
      <Button onClick={open}>Open dialog</Button>

      {isOpen ? <ModalDialog onClose={close} /> : null}
    </>
  );
};
```

<a id="chapter-2-elements-children-as-props-and-re-renders"></a>

## Chapter 2: Elements, children as props and re-renders.

## Elements, Components and re-renders

<a id="what-is-a-component"></a>

### What is a component?

- A component is a function which returns elements and React converts into DOM elements.
- We can see a prop is the first argument of the component.

```javascript
const Parent = (props) => {
  return <Child />;
};
```

<a id="what-is-an-element"></a>

### What is an element?

- An element is an **object** that defines a component that needs to be rendered on the screen.
- Element could be just a normal **DOM elements**, like the example below `<Greeting/>` returns `<h1>` arrtibute.
- JSX is syntax sugar for the `React.createElement` function.

For example:

```javascript
// With JSX

const Greeting = ({name}) => {
    return (
      <h1>Hello <i>{name}</i> </h1>
    );
}

export defualt function App() {
    return <Greeting name={Alen}/>
}
```

```javascript
// Without JSX

const Greeting = ({ name }) => {
  return createElement("h1", "Hello ", createElement("i", null, name));
};

export default function App() {
  return createElenment(Greeting, { name: "Alen" });
}
```

Below are explanations from React official doc.

- **createElement** returns a React element object with a few properties:
- **type:** The type you have passed.
- **props:** The props you have passed except for `ref` and `key`. If the type is a component with legacy `type.defaultProps`, then any missing or undefined `props` will get the values from `type.defaultProps`.
- **ref:** The `ref` you have passed. If missing, `null`.
- **key:** The key you have passed, coerced to a string. If missing, `null`.

[React Official Doc: createElement](https://react.dev/reference/react/createElement#creating-an-element-without-jsx)

<a id="what-is-re-render"></a>

### What is re-render

- React calls functions and executes everything that needs to be executed in the process, from the return of functions, React builds a tree of those objects.
- Here we needs to understand several important concepts:

<a id="fiber-tree"></a>

#### Fiber Tree

- A Fiber is a JavaScript object that contains information about a component, its input, and its output.
- It represents a unit of work in React's rendering process.
- Each component in a React application has a corresponding Fiber.
- How does fiber tree work?
  - **Breaking Down Work:**
    - breaks down this big list into smaller tasks. Each Fiber represents one of these tasks.
  - **Incremental Rendering:**
    - Works on a few tasks, then pause and check if there's something more urgent to handle (like user interactions), and then resume the rendering tasks.
  - **Structure:**
    - The Fiber Tree has a root and branches. Each Fiber links to its parent, its siblings, and its child, it includes additional technical details needed for React's internal processes.
  - **Reconciliation:**
    - When **state or props of a component change**, React creates new Fibers and compares them with the existing ones.

<a id="virtual-dom"></a>

#### Virtual DOM

The Virtual DOM is a **lightweight copy** or representation of the actual Document Object Model (DOM) of a webpage.

<a id="diffing"></a>

#### Diffing

- **"Diffing"** in the context of web development, especially with frameworks like React, refers to the process of **comparing two virtual DOM trees to identify what has changed**.
- The Concept of Diffing:
  - **Two Virtual DOM Trees:**
    - Two versions of the Virtual DOM: one represents the **current state of the UI**, and the other represents the **new state after some changes** (like user interactions or data updates).
  - **Identifying Changes:**
    - Figuring out which components in the virtual DOM have changed, been added, or removed.
  - **Efficient Comparison:**
    - If the type of an element has changed, it will rebuild the whole subtree to avoid complex calculations.
  - **Minimizing Real DOM Manipulation:**
    - To minimize the updates that need to be made to the actual DOM, which is a costly operation in terms of performance.

---

Now let's use an example and explain be bit more.

```javascript
const MovingBlock = ({ position }: { position: number }) => (
  <div className="movable-block" style={{ top: position }}>
    {position}
  </div>
);

const getPosition = (val: number) => 150 - val / 2;

export default function App() {
  const [position, setPosition] = useState(150);

  const onScroll = (e: any) => {
    // calculate position based on the scrolled value
    const calculated = getPosition(e.target.scrollTop);
    // save it to state
    setPosition(calculated);
  };

  return (
    <div className="scrollable-block" onScroll={onScroll}>
      {/* pass position value to the new movable component */}
      <MovingBlock position={position} />
      <VerySlowComponent />
      <BunchOfStuff />
      <OtherStuffAlsoComplicated />
    </div>
  );
}
```

In example above, when state has changed, all components are going to re-render, how can we prevent unnecessary re-render?

- Step 1: Extract irrelevant components and store as a variable.
- Step 2: Create another component and move state management and relevant component inside of it.
- Step 3: Pass the variable that store all irrelevant components as props.

```javascript
const MovingBlock = ({ position }) => (
  <div className="movable-block" style={{ top: position }}>
    {position}
  </div>
);

const getPosition = (val) => 150 - val / 2;

const ScrollableWithMovingBlock = ({ content }) => {
  const [position, setPosition] = useState(150);

  const onScroll = (e: any) => {
    const calculated = getPosition(e.target.scrollTop);
    setPosition(calculated);
  };

  return (
    <div className="scrollable-block" onScroll={onScroll}>
      <MovingBlock position={position} />
      {content}
    </div>
  );
};

export default function App() {
  const otherComponents = (
    <>
      <VerySlowComponent />
      <BunchOfStuff />
      <OtherStuffAlsoComplicated />
    </>
  );

  return <ScrollableWithMovingBlock content={otherComponents} />;
}
```

Why this does not trigger re-render?

When `setPosition` is triggered, React will compare all object definations that the function returns, meaning that React will check if `content` object is the same as before and after,in this example, only `<MovingBlock position={position}/>` will re-render.

---

<a id="children-as-props"></a>

### Children as props

Props are an object that we pass as the first argument to the component function, **children** are props and behave like any other prop when they are passed via `JSX` nesting syntax.

From code above, we can leverage JSX syntax to something like this.

```javascript
const MovingBlock = ({ position }) => (
  <div className="movable-block" style={{ top: position }}>
    {position}
  </div>
);

const getPosition = (val) => 150 - val / 2;

const ScrollableWithMovingBlock = ({ children }) => {
  const [position, setPosition] = useState(150);

  const onScroll = (e: any) => {
    const calculated = getPosition(e.target.scrollTop);
    setPosition(calculated);
  };

  return (
    <div className="scrollable-block" onScroll={onScroll}>
      <MovingBlock position={position} />
      {children}
    </div>
  );
};

export default function App() {
  return (
    <ScrollableWithMovingBlock>
      <VerySlowComponent />
      <BunchOfStuff />
      <OtherStuffAlsoComplicated />
    </ScrollableWithMovingBlock>
  );
}
```
