import React from 'react'
import { storiesOf, action, addDecorator } from '@kadira/storybook'
import { muiTheme } from 'storybook-addon-material-ui'
import EditableVirtualizedGrid from '../virtualized-grid-experiments/EditableVirtualizedGrid'
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
class EditableVirtualizedGridDemo extends React.Component {
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
  render () {
    return (
      <div style={styles.fullscreen}>
        <EditableVirtualizedGrid
          columnCount={100}
          rowCount={10000}
          data={this.state.data}
          setCellData={this.setCellData}
      />
      </div>
    )
  }
}
storiesOf('Editable virtualized grid', module)
.addDecorator(muiTheme())
.add('default state', () => (
  <EditableVirtualizedGridDemo />
))
