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
    return <View>
        <Text>Monday 20, February 2017</Text>

    </View>
}

class TimetableTable extends React.Component {

    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var bookings = {};
        var booking = {};
        booking[0] = 'bob';
        bookings[8] = booking;

        booking = {};
        booking[0] = 'alice';
        bookings[9] = booking;

        booking = {}
        booking[0] = 'alice'
        booking[1] = 'charlie'
        bookings[10] = booking;

        var timeSlots = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
        this.state = {
            bookings: bookings,
            timeSlots: ds.cloneWithRows(timeSlots),
            machines: ds.cloneWithRows([0,1])
        }
    }

    renderItem(rowData, itemData) {
        var booking = this.state.bookings[parseInt(rowData)];
        console.log("bookings: " + this.state.bookings)

        return <TouchableHighlight onPress={(event) => this.onPress(event)}>
            <View style={styles.item}>
                <Text>{booking ? booking[parseInt(itemData)] : ''}</Text>
            </View>
        </TouchableHighlight>
    }

    renderRow(rowData, rowId) {
        return <View style={styles.itemContainer}>
            <Text style={styles.itemHour}>{rowData}</Text>
            <ListView
                contentContainerStyle={styles.itemList}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderItem(rowData, itemData)}
                horizontal={true}
            />
        </View>
    }

    render() {
        return <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.timeSlots}
            renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, rowId)}
        />
        //TODO set initiallistsize correctly
    }

    onPress(e) {
        console.log("Pressed booking slot");
        //this.setState({showQr: false});
    }

}

class Timetable extends React.Component {
    render() {
        return <View>
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
    list: {
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#CCC',
        borderWidth: 1,
        borderBottomWidth: 0,
        width: Dimensions.get('window').width - 20,
        height: 100
    },
    item: {
        backgroundColor: '#CCC',
        width: 100,
        height: 100
    },
    itemHour: {
        backgroundColor: '#CCC',
        width: 100,
        height: 100,
    }
});