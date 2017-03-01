/**
 * Created by soeholm on 25.02.17.
 */

import React from 'react'
import {
  ListView,
  Text,
  View
} from 'react-native'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class Table extends React.Component {

  render () {
    if (!this.props.headersData) return <View><Text>Still loading...</Text></View>
    // console.log('Rendering table')
    return <View>
      {this.renderHeaders()}
      {this.renderRows()}
    </View>
  }

  renderHeaders () {
    // console.log('Rendering headers')
    return <View style={this.props.tableStyles.rowStyle}>
      {this.props.renderBetweenMarker()}
      <ListView
        contentContainerStyle={this.props.tableStyles.containerStyle}
        dataSource={ds.cloneWithRows(this.props.headersData)}
        renderRow={(headerData) => this.renderHeader(headerData)}
        horizontal/>
      {this.props.renderBetweenMarker()}
    </View>
  }

  renderHeader (headerData) {
    return <View style={[this.props.tableStyles.headerStyle]}>
      <Text>{headerData.name}</Text>
    </View>
  }

  renderRows () {
    // console.log('Rendering rows')
    return <ListView
      dataSource={ds.cloneWithRows(this.props.data)}
      renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, rowId)}/>
  }

  renderRow (rowData, rowId,) {
    console.log('Rendering cells', rowData, rowId)
    return <View style={this.props.tableStyles.rowStyle}>
      {this.props.renderBetweenMarker(rowId)}
      <ListView
        contentContainerStyle={this.props.tableStyles.containerStyle}
        dataSource={ds.cloneWithRows(this.props.headersData)}
        renderRow={(cellData, sectionId, columnId) => this.props.renderCell(cellData, columnId, rowId)}
        horizontal/>
      {this.props.renderBetweenMarker()}
    </View>
  }

}

Table.propTypes = {
  headersData: React.PropTypes.array,
  data: React.PropTypes.array,
  tableStyles: React.PropTypes.object,
  renderBetweenMarker: React.PropTypes.func,
  renderCell: React.PropTypes.func.isRequired
}