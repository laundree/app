/**
 * Created by soeholm on 25.02.17.
 */

import React from 'react'
import {
    Dimensions,
    ListView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class Table extends React.Component {

    render() {
        if (!this.props.headersData) return <View><Text>Still loading...</Text></View>
        console.log('Rendering table')
        return <View>
            {this.renderHeaders()}
            {this.renderRows()}
        </View>
    }

    renderRows() {
        console.log('Rendering rows')
        return <ListView
            dataSource={ds.cloneWithRows(this.props.data)}
            renderRow={(rowData) => this.renderRow(rowData)}/>
    }

    renderRow(rowData) {
        console.log('Rendering cells')
        return <View style={this.props.tableStyles.rowStyle}>
            {this.renderBetweenMarker(rowData.time)}
            <ListView
                contentContainerStyle={this.props.tableStyles.containerStyle}
                dataSource={ds.cloneWithRows(rowData.cells)}
                renderRow={(cellData) => this.renderCell(cellData)}
                horizontal={true}/>
            {this.renderBetweenMarker()}
        </View>
    }

    renderBetweenMarker(time) {
        console.log('Render between marker')
        if (!this.props.renderBetweenMarkers) return null
        if (!time || !this.props.renderBetweenMarkersAt(time)) {
            console.log('Render empty between marker')
            return this.renderEmptyBetweenMarker()
        }
        console.log('Render between marker with text ' + time)
        return <View style={this.props.tableStyles.markerStyle}>
            <Text style={this.props.tableStyles.markerTextStyle}>{time}</Text>
        </View>
    }

    renderEmptyBetweenMarker() {
        return <View style={this.props.tableStyles.emptyMarkerStyle}>
            <Text></Text>
        </View>
    }

    renderCell(cellData) {
        console.log('Rendering cell: ' + cellData)
        var flattenStyle = require('flattenStyle')
        return <TouchableHighlight
            underlayColor={flattenStyle(this.props.underlayCellStyle(cellData)).backgroundColor}
            activeOpacity={50}
            style={this.props.cellStyle(cellData)}
            onPress={(event) => this.props.onPressCell(cellData)}>
            <Text></Text>
        </TouchableHighlight>
    }

    renderHeaders() {
        console.log('Rendering headers')
        return <View style={this.props.tableStyles.rowStyle}>
            {this.renderBetweenMarker()}
            <ListView
                contentContainerStyle={this.props.tableStyles.containerStyle}
                dataSource={ds.cloneWithRows(this.props.headersData)}
                renderRow={(headerData) => this.renderHeader(headerData)}
                horizontal={true}/>
            {this.renderBetweenMarker()}
        </View>
    }

    renderHeader(headerData) {
        return <View style={[this.props.tableStyles.headerStyle]}>
            <Text>{headerData}</Text>
        </View>
    }

}

Table.propTypes = {
    headersData: React.PropTypes.array,
    data: React.PropTypes.array,
    tableStyles: StyleSheet,
    cellStyle: React.PropTypes.func,
    underlayCellStyle: React.PropTypes.func,
    renderBetweenMarkers: React.PropTypes.bool,
    renderBetweenMarkersAt: React.PropTypes.func,
    onPressCell: React.PropTypes.func.isRequired
}