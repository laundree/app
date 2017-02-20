/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react';
import {
    Dimensions,
    ListView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

const TimetableHeader = (props) => {
    return <View style={{marginBottom: 10}}>
        <Text style={styles.dateHeader}>Monday 20, February 2017</Text>
    </View>
}

class TimetableTable extends React.Component {

    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            timeSlots: ds.cloneWithRows([8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5
            ]),
            machines: ds.cloneWithRows(['Washing machine','Tumble dryer'])
        }
    }

    renderItem(rowData, itemData) {
        var isBooked = false;
        var isMine = false;
        if (isBooked && isMine) {
            return <TouchableHighlight style={styles.highlightItem} onPress={(event) => this.onPress(event, rowData, itemData, isBooked)}>
                <View style={[styles.cell,styles.item,styles.ownBookedItem]}>
                    <Text></Text>
                </View>
            </TouchableHighlight>
        } else if (isBooked) {
            return <TouchableHighlight style={styles.highlightItem} onPress={(event) => this.onPress(event, rowData, itemData, isBooked)}>
                <View style={[styles.cell,styles.item,styles.bookedItem]}>
                    <Text></Text>
                </View>
            </TouchableHighlight>
        }
        return <TouchableHighlight style={styles.highlightItem} onPress={(event) => this.onPress(event, rowData, itemData, isBooked)}>
            <View style={[styles.cell,styles.item]}>
                <Text></Text>
            </View>
        </TouchableHighlight>
    }

    renderRow(rowData,rowId) {
        var showHour = parseFloat(rowData) % 1 == 0 && parseFloat(rowData) != 8;
        var hourData = showHour ? rowData : '';
        var style = showHour ? styles.itemHour : styles.emptyHour;
        return <View style={styles.row}>
            <View>
                <Text style={[styles.hour,style]}>{hourData}</Text>
            </View>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderItem(rowData, itemData)}
                horizontal={true}
            />
            <View>
                <Text style={[styles.hour,style]}>{hourData}</Text>
            </View>
        </View>
    }

    renderHeaderItem(itemData) {
        return <View style={[styles.cell,styles.header]}>
                <Text style={styles.headerText}>{itemData}</Text>
            </View>
    }

    renderHeader() {
        return <View style={styles.row}>
            <Text style={styles.hour}></Text>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderHeaderItem(itemData)}
                horizontal={true}
            />
            <Text style={styles.hour}></Text>
        </View>
    }

    onRenderSectionHeader(sectionData) {
        return this.renderHeader();
    }

    render() {
        return <ListView
            contentContainerStyle={styles.list}
            renderSectionHeader={(sectionData, sectionId) => this.onRenderSectionHeader(sectionData)}
            dataSource={this.state.timeSlots}
            renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData,rowId)}
        />
        //TODO set initiallistsize correctly
    }

    onPress(event, rowData, itemData, isBooked) {
        var booked = isBooked ? "booked" : "not booked"
        console.log("Pressed " + booked + " slot with " + rowData + ", " + itemData);
        //this.setState({showQr: false});
    }

}

class Timetable extends React.Component {
    render() {
        return <View style={{marginTop: 10, marginBottom: 10}}>
            <TimetableHeader />
            <TimetableTable />
        </View>
    }
}

export default class TimetableWrapper extends React.Component {
    get isOwner() {
        // TODO: return this.props.laundry.owners.indexOf(this.props.currentUser) >= 0
        return 0 >= 0
    }

    renderEmpty() {
        return <View style={styles.container}>
            <Text>
                There are no machines registered.
            </Text>
            {this.isOwner ? <Text>
                    Go to the website and register machines.
                </Text> : <Text>
                    Ask your administrator to register machines.
                </Text>}
        </View>
    }

    renderTables() {
        return <View style={styles.container}>
            <Timetable />
        </View>
    }

    render() {
        // TODO: return this.props.laundry.machines.length ? this.renderTables() : this.renderEmpty();
        return true ? this.renderTables() : this.renderEmpty();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#66D3D3'
    },
    dateHeader: {
        fontSize: 20,
        textAlign: 'center'
    },
    list: {
        justifyContent: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        height: 50,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: 50,
        marginLeft: 10,
        marginRight: 10
    },
    cell: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#7DD8D5',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        backgroundColor: '#57CCC9',
    },
    highlightItem: {
      flex: 1
    },
    ownBookedItem: {
        backgroundColor: '#49A044'
    },
    bookedItem: {
        backgroundColor: '#A04444'
    },
    header: {
        backgroundColor: '#4DC4C1',
    },
    headerText: {
        textAlign: 'center',

    },
    hour: {
        width: 20,
        marginTop: -9
    },
    itemHour: {
        backgroundColor: '#4DC4C1',
        height: 20,
        textAlign: 'center'
    },
    emptyHour: {
        height: 20,
        textAlign: 'center'
    }
});