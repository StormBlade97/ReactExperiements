import React, { PureComponent } from 'react'
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'
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
const Item = ({columnIndex, className, rowIndex, key, style, content}) => (
   <div
        key={key}
        className={`cell ${columnIndex % 2 === 0 ? 'column-even' : ''} ${className}`}
        style={style}
      >
        {content}
      </div>
);
const SortableItem = SortableElement(Item)
const SortableGrid = SortableContainer(Grid)

class SortableVirtualizedGrid extends PureComponent {
  constructor (props) {
    super(props)
  }
  noContentRenderer () {
    return <h1>Nothing to see here</h1>
  }
  getContent(columnIndex, rowIndex) {
    return this.props.data[columnIndex][rowIndex]
  }
  getColumnWidth () {
    return 100
  }
  cellRenderer = (props) => {
    const content =  this.getContent(props.columnIndex, 0)
    return (
      <SortableItem content={content} {...props} index={props.columnIndex}/>
    )
  }
  bodyCellRenderer = (props) => {
    const content =  this.getContent(props.columnIndex, props.rowIndex + 1)
    return <Item {...props} content={content}/>
  }
  render () {
    const gibberish = Math.random()
    const rowHeight = 56
    return (
        <AutoSizer>
          {({width, height}) => 
            (<ScrollSync>
              {({onScroll, scrollLeft}) => 
                  (<div>
                    <SortableGrid
                      axis='x'
                      lockAxis='x'
                      passThough={gibberish}
                      cellRenderer={this.cellRenderer}
                      columnWidth={100}
                      columnCount={this.props.columnCount}
                      height={rowHeight}
                      rowHeight={rowHeight}
                      rowCount={1}
                      width={width - scrollbarSize()}
                      style={styles.tableHeader}
                      onSortEnd={this.props.onSortEnd}
                      onScroll={onScroll}
                      scrollLeft={scrollLeft}
                    />
                    <Grid
                      height={height - rowHeight}
                      style={{...styles.tableBody, top: rowHeight}}
                      rowCount={this.props.rowCount}
                      columnCount={this.props.columnCount}
                      rowHeight={rowHeight}
                      columnWidth={100}
                      cellRenderer={this.bodyCellRenderer}
                      width={width}
                      onScroll={onScroll}
                    />
                  </div>)
                }
            </ScrollSync>)}
      </AutoSizer>
    )
  }
}
export default muiThemeable()(SortableVirtualizedGrid)
