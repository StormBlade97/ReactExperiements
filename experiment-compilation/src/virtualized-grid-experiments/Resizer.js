import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Radium from 'radium';

const styles ={
  resizer: {
    width: '4px',
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(100,181,246,1)',
    zIndex: 1,
    cursor: 'col-resize',
    opacity: 0,
    ':hover': {
      opacity: 1
    },
  },
  visible: {
    opacity: 1,
    transition: 'opacity 1s ease',
    
  }
}
class Resizer extends Component {
  constructor(props) {
    super(props)
    this.state = {deltaX: 0, dragging: false}
  }
  handleDragStart = () => {
    this.setState({ dragging: true, deltaX: 0 })
  }
  handleDragEnd = (e, ui) => {
    this.setState({dragging: false})
    this.handleDrag(e, ui)
    this.props.onResize(this.state.deltaX)
  }
  handleDrag = (e, ui) => {
    //controlled
    this.setState((prevState) => {return {deltaX: prevState.deltaX + ui.deltaX}})
  }
  render() {
    return (
      <Draggable
      axis='x'
      onStart={this.handleDragStart}
      onDrag={this.handleDrag}
      onStop={this.handleDragEnd}
      position={{x: 0, y: 0}}
      >
         <div style={[styles.resizer, this.state.dragging && styles.visible]}/> 
      </Draggable>
    );
  }
}
export default Radium(Resizer)