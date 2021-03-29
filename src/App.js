import React from "react"
import { useSelector, useDispatch } from "react-redux"
import logo from "./logo.svg"
import increment, { incrementAsync, decrement } from "./actions"
import Counter from "./Counter"
import "./App.scss"
import Home from "./pages/Home/Home"

function App() {
  // const dispatch = useDispatch();
  // const counter = useSelector((state) => state.count);

  return (
    <div className='App'>
      <Home />

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter
          value={counter}
          onIncrement={() => dispatch(increment())}
          onDecrement={() => dispatch(decrement())}
          onIncrementAsync={() => dispatch(incrementAsync())}
        />
      </header> */}
    </div>
  )
}

export default App
