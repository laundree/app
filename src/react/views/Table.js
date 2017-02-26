/**
 * Created by soeholm on 25.02.17.
 */

import React from 'react'
import {
    Dimensions,
    ListView,
    StyleSheet,
    Text,
    View,
} from 'react-native'


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class Table extends React.Component {

    render() {
        if (!this.props.headersData) return <View><Text>Still loading...</Text></View>
        //console.log('Rendering table')
        return <View>
            {this.renderHeaders()}
            {this.renderRows()}
        </View>
    }

    renderHeaders() {
        //console.log('Rendering headers')
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
            <Text>{headerData.name}</Text>
        </View>
    }

    renderRows() {
        //console.log('Rendering rows')
        return <ListView
            dataSource={ds.cloneWithRows(this.props.data)}
            renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, rowId)}/>
    }

    renderRow(rowData, rowId) {
        console.log('Rendering cells', rowData, rowId)
        return <View style={this.props.tableStyles.rowStyle}>
            {this.renderBetweenMarker(rowId)}
            <ListView
                contentContainerStyle={this.props.tableStyles.containerStyle}
                dataSource={ds.cloneWithRows(this.props.headersData)}
                renderRow={(cellData,sectionId,columnId) => this.props.renderCell(cellData, columnId, rowId)}
                horizontal={true}/>
            {this.renderBetweenMarker()}
        </View>
    }

    renderBetweenMarker(rowId) {
        //console.log('Render between marker')
        if (!this.props.renderBetweenMarkers) return null
        if (!rowId || !this.props.renderBetweenMarkersAt(rowId)) {
            //console.log('Render empty between marker')
            return this.renderEmptyBetweenMarker()
        }
        //console.log('Render between marker with text ' + time)
        return <View style={this.props.tableStyles.markerStyle}>
            <Text style={this.props.tableStyles.markerTextStyle}>{rowId/2}</Text>
        </View>
    }

    renderEmptyBetweenMarker() {
        return <View style={this.props.tableStyles.emptyMarkerStyle}>
            <Text></Text>
        </View>
    }

}

Table.propTypes = {
    headersData: React.PropTypes.array,
    data: React.PropTypes.array,
    tableStyles: React.PropTypes.object,
    cellStyle: React.PropTypes.func,
    underlayCellStyle: React.PropTypes.func,
    renderBetweenMarkers: React.PropTypes.bool,
    renderBetweenMarkersAt: React.PropTypes.func,
    onPressCell: React.PropTypes.func.isRequired,
    renderCell: React.PropTypes.func.isRequired
}