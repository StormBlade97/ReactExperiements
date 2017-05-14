// under construction
import React from 'react'
import { storiesOf, action, addDecorator } from '@kadira/storybook'
import { muiTheme } from 'storybook-addon-material-ui'
import EditableSortableVirtualizedGrid from '../virtualized-grid-experiments/EditableSortableVirtualizedGrid'
import { arrayMove } from 'react-sortable-hoc'
import _ from 'lodash'

const generateData = (columnCount, rowCount) => {
  let array = []
  let jarray = []
  for (let i = 0; i <= columnCount; i++) {
    jarray = []
    for (let j = 0; j < rowCount; j++) {
      jarray.push(`C${i}:R${j}`)
    }
    array.push(jarray)
  }
  return { data: array }
}
const styles = {
  fullscreen: {
    width: '100%',
    height: '100vh'
  }
}

class EditableSortableVirtualizedGridDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = generateData(100, 10000)
  }
  setCellData = (columnIndex, rowIndex, newData) => {
    this.setState((state) => {
      let data = state.data
      let column = data[columnIndex]
      column.splice(rowIndex, 1, newData)
      data.splice(columnIndex, 1, column)
      return {
        data: data,
        edited: true
      }
    })
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    console.log('onSortEnd')
    if (oldIndex !== newIndex) {
      let {data} = this.state;
      this.setState({
        data: arrayMove(data, oldIndex, newIndex),
      });
    }
  };
  render () {
    return (
      <div style={styles.fullscreen}>
        <EditableSortableVirtualizedGrid
          columnCount={100}
          rowCount={10000}
          data={this.state.data}
          setCellData={this.setCellData}
          onSortEnd={this.onSortEnd}
      />
      </div>
    )
  }
}

storiesOf('Editable Sortable virtualized grid', module)
.addDecorator(muiTheme())
.add('default', () => (
  <div style={styles.fullscreen}>
    <EditableSortableVirtualizedGridDemo />
  </div>
))
