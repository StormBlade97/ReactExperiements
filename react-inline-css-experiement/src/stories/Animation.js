// key frame animations
import React, { Component } from 'react'
import Radium, { Plugins } from 'radium'
import { blue500, red500, lime500, yellow500, indigo500 } from 'material-ui/styles/colors'
import { bounce } from 'react-animations'

const morph = Radium.keyframes({
  '0%': {
  },
  '25%': {
    transform: 'rotate(90deg) scale(.2)'
  },
  '50%': {
    transform: 'rotate(180deg) scale(.0)'

  },
  '75%': {
    transform: 'rotate(270deg) scale(.2)'

  },
  '100%': {
    transform: 'rotate(360deg) scale(1)'
  }
}, 'morph')

const style = {
  root: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    backgroundColor: lime500,
    animation: `x 10s infinite linear`,
    animationName: morph,
    width: '500px',
    height: '500px'
  }
}
class Animation extends Component {
  render () {
    return (
      <div style={style.root} />
    )
  }
}

export default Radium(Animation)
