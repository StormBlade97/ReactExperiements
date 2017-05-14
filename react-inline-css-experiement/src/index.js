import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import injectTouchTapEvent from './injectTouchTapEvent'
injectTouchTapEvent()

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
