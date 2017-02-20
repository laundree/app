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
        var isBooked = true;
        var isMine = true;
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

    renderRow(rowData, rowId) {
        return <View style={styles.row}>
            <Text style={[styles.hour,styles.itemHour]}>{rowData}</Text>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderItem(rowData, itemData)}
                horizontal={true}
            />
        </View>
    }

    renderHeaderItem(itemData) {
        return <View style={[styles.cell,styles.header]}>
                <Text>{itemData}</Text>
            </View>
    }

    renderHeader() {
        console.log(styles.hour);
        return <View style={styles.row}>
            <Text style={styles.hour}></Text>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderHeaderItem(itemData)}
                horizontal={true}
            />
        </View>
    }

    render() {
        return <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.timeSlots}
            renderHeader={() => this.renderHeader()}
            renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, rowId)}
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
        return <View style={Object.assign({},styles.container)}>
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
        height: 50
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
    hour: {
        width: 20
    },
    itemHour: {
        backgroundColor: '#4DC4C1',
        height: 20,
        textAlign: 'center'
    }
});