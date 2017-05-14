import React, { PureComponent } from 'react'
import { MultiGrid, AutoSizer } from 'react-virtualized'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import {darkWhite} from 'material-ui/styles/colors'
import muiThemeable from 'material-ui/styles/muiThemeable'
import 'react-virtualized/styles.css'
import './index.css'
const styles = {
  headerRow: {
    boxShadow: `0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)`,
    cursor: 'pointer'
  },
  icon: {
    width: '100%',
    height: '100%'
  },
  table: {
    outline: 'none'
  }
}

class EditableVirtualizedGrid extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {editable: false, selectedCellColumnIndex: -1, selectedCellRowIndex: -1, selectedColumn: -1}
  }
  getContent(columnIndex, rowIndex) {
    return this.props.data[columnIndex][rowIndex]
  }
  handleTagClick = () => {
    console.log('hi');
    this.setState({editable: true});
  }
  handleClick = (columnIndex, rowIndex) => {
    if (rowIndex === 0) this.setState({ selectedColumn: columnIndex })
    else this.setState({ editable: false, selectedCellColumnIndex: columnIndex, selectedCellRowIndex: rowIndex })
  }
  cellRenderer = ({columnIndex, rowIndex, key, style}) => {
    const selected = columnIndex === this.state.selectedCellColumnIndex && rowIndex === this.state.selectedCellRowIndex
    const columnHighlighted = columnIndex === this.state.selectedColumn
    const editable = this.state.editable && selected
    const content = this.getContent(columnIndex, rowIndex)
    const onTagClick = () => this.handleTagClick()
    const onClick = () => this.handleClick(columnIndex, rowIndex)
    return (
      <div
        key={key}
        className={`cell ${columnIndex % 2 === 0 ? 'column-even' : ''} ${selected ? 'selected-cell' : ''} ${columnHighlighted ? 'selected-column' : ''}`}
        onClick={selected ? null : onClick}
        style={style}
      >
        {selected && <div className='corner' onClick={onTagClick}>
          <ModeEdit color={darkWhite} style={styles.icon} />
        </div>}
        {!editable ? content
        : <input
          defaultValue={content}
          className='cell-edit'
          type='text'
          ref={(input) => this.input = input}
          onBlur={(e) => this.props.setCellData(columnIndex, rowIndex, e.currentTarget.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              this.props.setCellData(columnIndex, rowIndex, e.currentTarget.value)
              this.setState({editable: false})
            }
          }
        }
        />}
      </div>
      )
  }
  noContentRenderer () {
    return <h1>Nothing to see here</h1>
  }
  getColumnWidth () {
    return 100
  }
  render () {
    const { columnCount, rowCount } = this.props
    const gibberish = Math.random()
    return (
      <AutoSizer>
        {({ width, height }) => (
          <MultiGrid
            passThough={gibberish}
            fixedRowCount={1}
            styleTopRightGrid={styles.headerRow}
            cellRenderer={this.cellRenderer}
            columnWidth={this.getColumnWidth}
            columnCount={columnCount}
            height={height}
            noContentRenderer={this.noContentRenderer}
            overscanColumnCount={10}
            overscanRowCount={10}
            rowHeight={56}
            rowCount={rowCount}
            width={width}
            styleBottomRightGrid={styles.table}
          />
        )}
      </AutoSizer>
    )
  }
}
export default muiThemeable()(EditableVirtualizedGrid)
