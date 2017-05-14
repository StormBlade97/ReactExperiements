import logo from './logo.svg'
import Paper from 'material-ui/Paper'
import React, { Component } from 'react'
import Radium from 'radium'
import { orange500, orange100 } from 'material-ui/styles/colors'

const style = {
  base: {
    width: '300px',
    height: '300px',
    backgroundColor: orange500,
    boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
    borderRadius: '5%',
    transition: 'transform 1s ease, background-color 0.5s linear, box-shadow 1s linear, border-radius 1s linear',

    ':hover': {
      borderRadius: '20%',
      backgroundColor: orange100,
      transform: 'scale(1.1) translateY(50%) translateX(50%)',
      boxShadow: `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)`
    }
  }

}

class App extends Component {
  render () {
    return (
      <div>
        <div style={style.base} />
      </div>
    )
  }
}
export default Radium(App)
