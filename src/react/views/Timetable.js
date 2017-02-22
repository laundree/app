/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
    Dimensions,
    ListView,
    Navigator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native'
import moment from 'moment'

class Timetable extends React.Component {

    constructor() {
        super()
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

        this.state = {
            timeSlots: ds.cloneWithRows([8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5
            ]),
            machines: ds.cloneWithRows(['Washing machine', 'Tumble dryer']),
            offset: null,
            dates: ds.cloneWithRows([moment(),
                moment().add(1,'days')])
        }
    }

    renderItem(rowData, itemData) {
        let isBooked = false
        let isMine = false
        if (isBooked && isMine) {
            return <TouchableHighlight
                style={styles.highlightItem}
                onPress={(event) => this.onPress(event, rowData, itemData, isBooked)}>
                <View style={[styles.cell, styles.item, styles.ownBookedItem]}>
                    <Text />
                </View>
            </TouchableHighlight>
        } else if (isBooked) {
            return <TouchableHighlight
                style={styles.highlightItem}
                onPress={(event) => this.onPress(event, rowData, itemData, isBooked)}>
                <View style={[styles.cell, styles.item, styles.bookedItem]}>
                    <Text />
                </View>
            </TouchableHighlight>
        }
        return <TouchableHighlight
            style={styles.highlightItem}
            onPress={(event) => this.onPress(event, rowData, itemData, isBooked)}>
            <View style={[styles.cell, styles.item]}>
                <Text />
            </View>
        </TouchableHighlight>
    }

    renderRow(rowData, rowId) {
        let showHour = parseFloat(rowData) % 1 === 0 && parseFloat(rowData) !== 8
        let hourData = showHour ? rowData : ''
        let style = showHour ? styles.itemHour : styles.emptyHour
        return <View style={styles.row}>
            <View>
                <Text style={[styles.hour, style]}>{hourData}</Text>
            </View>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderItem(rowData, itemData)}
                horizontal
            />
            <View>
                <Text style={[styles.hour, style]}>{hourData}</Text>
            </View>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderItem(rowData, itemData)}
                horizontal
            />
        </View>
    }

    renderHeaderItem(itemData) {
        return <View style={[styles.cell, styles.header]}>
            <Text style={styles.headerText}>{itemData}</Text>
        </View>
    }

    renderHeader() {
        return <View style={styles.row}>
            <Text style={styles.hour}/>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderHeaderItem(itemData)}
                horizontal
            />
            <Text style={styles.hour}/>
            <ListView
                contentContainerStyle={styles.itemContainer}
                dataSource={this.state.machines}
                renderRow={(itemData) => this.renderHeaderItem(itemData)}
                horizontal
            />
        </View>
    }
    get user () {
        return this.props.users && this.props.users[this.props.currentUser]
    }

    renderUser () {
        if (!this.user) {
            console.log('User not available')
            return null
        }
        return <Text>
            {this.user.displayName}
        </Text>
    }

    renderDateRow(rowData) {
        return <Text style={styles.dateHeader}>
            {rowData.toString()}
        </Text>
    }

    render() {
        return <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled={true}
            style={{paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight}}>
            <View style={{marginTop: 10, marginBottom: 10}}>
                <View style={styles.row}>
                    <ListView
                        horizontal={true}
                        contentContainerStyle={styles.dateView}
                        dataSource={this.state.dates}
                        renderRow={(rowData) => this.renderDateRow(rowData)}
                     />
                    {/*<View style={styles.dateView}>
                        <Text style={styles.dateHeader}>I dag</Text>
                    </View>
                    <View style={styles.dateView}>
                        <Text style={styles.dateHeader}>Torsdag d. 23 februar</Text>
                    </View>*/}
                </View>
                {this.renderHeader()}
                <ListView
                    contentContainerStyle={styles.listViewContainer}
                    dataSource={this.state.timeSlots}
                    renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, rowId)}
                    initialListSize={15}
                />
            </View>
        </ScrollView>
    }

    onPress(event, rowData, itemData, isBooked) {
        let booked = isBooked ? 'booked' : 'not booked'
        console.log('Pressed ' + booked + ' slot with ' + rowData + ', ' + itemData)
    }

}

export default class TimetableWrapper extends React.Component {
    get isOwner() {
        // TODO: return this.props.laundry.owners.indexOf(this.props.currentUser) >= 0
        return false
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
            <Timetable currentUser={this.props.currentUser}
                       users={this.props.users}
                       laundries={this.props.laundries}
                       machines={this.props.machines}
                       bookings={this.props.bookings}
                       stateHandler={this.props.stateHandler}/>
        </View>
    }

    render() {
        // TODO: return this.props.laundry.machines.length ? this.renderTables() : this.renderEmpty();
        return this.renderTables()
    }
}

TimetableWrapper.propTypes = {
    currentUser: React.PropTypes.string,
    users: React.PropTypes.object,
    laundries: React.PropTypes.object,
    machines: React.PropTypes.object,
    bookings: React.PropTypes.object,
    stateHandler: React.PropTypes.object.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#66D3D3'
    },
    listViewContainer: {
        width: Dimensions.get('window').width * 2,
        height: 1400
    },
    dateView: {
        flex: 1,
        width: Dimensions.get('window').width * 2
    },
    dateHeader: {
        fontSize: 20,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * 2,
        height: 50
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        backgroundColor: '#57CCC9'
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
        backgroundColor: '#4DC4C1'
    },
    headerText: {
        textAlign: 'center'

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
})
