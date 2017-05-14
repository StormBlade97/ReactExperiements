import React, { PureComponent } from 'react'
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized'
import Resizer from './Resizer'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import {darkWhite} from 'material-ui/styles/colors'
import muiThemeable from 'material-ui/styles/muiThemeable'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import 'react-virtualized/styles.css'
import './index.css'
const styles = {
  icon: {
    width: '100%',
    height: '100%'
  },
  tableHeader: {
    outline: 'none',
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    boxShadow: `0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)`,
    cursor: 'pointer',
  },
  tableBody: {
    outline: 'none',
    position: 'absolute',
    left: 0
  }
}

const DragHandle = SortableHandle(() => <div className='drag-handle'></div>); // This can be any component you want
const Item = ({columnIndex, className, rowIndex, key, style, content, parent, onResize, ...rest}) => (
  <div
    className={`cell ${columnIndex % 2 === 0 ? 'column-even' : ''} ${className}`}
    style={style}
    {...rest}
    onDragStart={(e) => e.preventDefault()}
  >
    <Resizer onResize={onResize}/>
    <DragHandle />
    {content}
  </div>
);
const SortableItem = SortableElement(Item)
const SortableGrid = SortableContainer(Grid, {withRef: true})

class EditableSortableVirtualizedGrid extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      editable: false,
      selectedCellColumnIndex: -1,
      selectedCellRowIndex: -1,
      selectedColumn: -1,
      widths: _.fill(new Array(100), 100)
    }
  }
  getContent(columnIndex, rowIndex) {
    return this.props.data[columnIndex][rowIndex]
  }
  handleTagClick = () => {
    this.setState({editable: true});
  }
  handleCellClick = (columnIndex, rowIndex) => {
    this.setState({ editable: false, selectedCellColumnIndex: columnIndex, selectedCellRowIndex: rowIndex })
  }
  handleHeaderCellClick = (columnIndex) => {
    this.setState({ selectedColumn: columnIndex })
  }
  handleSortEnd = (...args) => {
    const callback = () => {
      this.SortableGrid.getWrappedInstance().recomputeGridSize()
      this.Grid.recomputeGridSize()
    }
    this.props.onSortEnd(...args)
    this.handleHeaderCellClick(args[0].newIndex)
    // array move the size array!
    this.setState({widths: arrayMove(this.state.widths, args[0].oldIndex, args[0].newIndex)}, callback)
  }
  handleResize = (deltaX, columnIndex) => {
    const callback = () => {
      this.SortableGrid.getWrappedInstance().recomputeGridSize()
      this.Grid.recomputeGridSize()
    }
    let newSize = this.state.widths[columnIndex] + deltaX;
    if (newSize < 50) newSize = 50
    this.setState((state) =>  {
      let widths = state.widths
      let oldSize = widths[columnIndex]
      widths.splice(columnIndex, 1, newSize)
      return {widths}
    }, callback)
  }
  cellRenderer = ({key, isScrolling, isVisible, ...props}) => {
    const selected = props.columnIndex === this.state.selectedColumn
    const content = this.getContent(props.columnIndex, props.rowIndex)
    const onClick = () => this.handleHeaderCellClick(props.columnIndex)
    const onResize = (deltaX) => this.handleResize(deltaX, props.columnIndex)
    return <SortableItem
            {...props}
            onResize={onResize}
            index={props.columnIndex}
            key={key}
            className={`${selected && 'selected-column'} header-cell`}
            content={content}
            onClick={onClick}
            />
  }
  bodyCellRenderer = ({columnIndex, rowIndex, key, style}) => {
    const selected = columnIndex === this.state.selectedCellColumnIndex && rowIndex === this.state.selectedCellRowIndex
    const columnHighlighted = columnIndex === this.state.selectedColumn
    const editable = this.state.editable && selected
    const content = this.getContent(columnIndex, rowIndex + 1)
    const onTagClick = () => this.handleTagClick()
    const onClick = () => this.handleCellClick(columnIndex, rowIndex)
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
          onBlur={(e) => this.props.setCellData(columnIndex, rowIndex +1, e.currentTarget.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              this.props.setCellData(columnIndex, rowIndex +1, e.currentTarget.value)
              this.setState({editable: false})
            }
          }
        }
        />}
      </div>
      )
  }
  getWidth = ({index}) => {
    return (this.state.widths[index]) || 100;
  }
  noContentRenderer () {
    return <h1>Nothing to see here</h1>
  }
  render () {
    const rowHeight = 56
    const gibberish = Math.random()
    return (
     <AutoSizer>
          {({width, height}) => 
            (<ScrollSync>
              {({onScroll, scrollLeft}) => 
                  (<div>
                    <SortableGrid
                      className='resize-bound' //for resizing purpose only
                      ref={(instance) => this.SortableGrid = instance}
                      helperClass='helper-sortable'
                      axis='x'
                      lockAxis='x'
                      useDragHandle
                      passThough={gibberish}
                      cellRenderer={this.cellRenderer}
                      columnWidth={this.getWidth}
                      columnCount={this.props.columnCount}
                      height={rowHeight}
                      rowHeight={rowHeight}
                      rowCount={1}
                      width={width - scrollbarSize()}
                      style={styles.tableHeader}
                      onSortEnd={this.handleSortEnd}
                      onScroll={onScroll}
                      scrollLeft={scrollLeft}
                    />
                    <Grid
                      ref={(instance) => this.Grid = instance}
                      passThough={gibberish}
                      height={height - rowHeight}
                      style={{...styles.tableBody, top: rowHeight}}
                      rowCount={this.props.rowCount}
                      columnCount={this.props.columnCount}
                      rowHeight={rowHeight}
                      columnWidth={this.getWidth}
                      cellRenderer={this.bodyCellRenderer}
                      width={width}
                      onScroll={onScroll}
                      scrollLeft={scrollLeft}
                    />
                  </div>)
                }
            </ScrollSync>)}
      </AutoSizer>
    )
  }
}
export default muiThemeable()(EditableSortableVirtualizedGrid)
