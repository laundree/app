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
import Table from './Table'

class Timetable extends React.Component {

    render() {
        return <View style={{
            paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight,
            paddingBottom: Navigator.NavigationBar.Styles.General.NavBarHeight,
            marginTop: 10, marginBottom: 10
        }}>
            {this.renderTitle()}
            {this.renderTable()}
        </View>
    }

    renderTitle() {
        return <View style={styles.row}>
            <View style={styles.dateView}>
                <Text style={styles.dateHeader}>
                    {moment().format('dddd D[/]M, YYYY')}
                </Text>
            </View>
        </View>
    }

    renderTable() {
        return <View>
            <Table
                headersData={this.props.machines}
                data={[{time: '8', cells: ['mybooking','free']},
                    {time: '8.5', cells: ['free','free']},
                    {time: '9', cells: ['mybooking','booked']},
                    {time: '9.5', cells: ['mybooking','booked']},
                    {time: '10', cells: ['free','free']},
                    {time: '10.5', cells: ['free','free']},
                    {time: '11', cells: ['free','free']},
                    {time: '11.5', cells: ['free','free']},
                    {time: '12', cells: ['free','free']},
                    {time: '12.5', cells: ['free','free']},
                    {time: '13', cells: ['free','free']},
                    {time: '13.5', cells: ['free','free']},
                    {time: '14', cells: ['free','free']},
                    {time: '14.5', cells: ['free','free']},
                    {time: '15', cells: ['free','free']},
                    {time: '15.5', cells: ['free','free']},
                    {time: '16', cells: ['free','free']},
                    {time: '16.5', cells: ['free','free']},
                    {time: '17', cells: ['free','free']},
                    {time: '17.5', cells: ['free','free']},
                    {time: '18', cells: ['free','free']},
                    {time: '18.5', cells: ['free','free']},
                    {time: '19', cells: ['free','free']},
                    {time: '19.5', cells: ['free','free']},
                    {time: '20', cells: ['free','free']},
                    {time: '20.5', cells: ['free','free']},
                    {time: '21', cells: ['free','free']},
                    {time: '21.5', cells: ['free','free']}]}
                tableStyles={this.tableStyles}
                cellStyle={(cellData) => this.cellStyle(cellData)}
                underlayCellStyle={(cellData) => this.underlayCellStyle(cellData)}
                renderBetweenMarkers={true}
                renderBetweenMarkersAt={(time) => this.renderBetweenMarkersAt(time)}
                onPressCell={(cellData) => this.onPressCell(cellData)}
            />
        </View>
    }

    cellStyle(cellData) {
        //console.log('Determining cell style')
        switch (cellData) {
            case 'free':
                //console.log('Using free cell style')
                return this.tableStyles.freeCellStyle
            case 'booked':
                //console.log('Using booked cell style')
                return this.tableStyles.bookedCellStyle
            case 'mybooking':
                //console.log('Using my booked cell style')
                return this.tableStyles.myBookedCellStyle
            default:
                console.error('Unknown cell. Using free cell style')
                return this.tableStyles.freeCellStyle
        }
    }

    underlayCellStyle(cellData) {
        //console.log('Determining underlay cell style')
        switch (cellData) {
            case 'free':
                //console.log('Using free cell style')
                return this.tableStyles.highlightFreeCellStyle
            case 'booked':
                //console.log('Using booked cell style')
                return this.tableStyles.highlightBookedCellStyle
            case 'mybooking':
                //console.log('Using my booked cell style')
                return this.tableStyles.highlightMyBookedCellStyle
            default:
                console.error('Unknown cell. Using free cell style')
                return this.tableStyles.highlightFreeCellStyle
        }

    }

    renderBetweenMarkersAt(time) {
        //console.log('Checking if should render between marker at time ' + time)
        let value = parseFloat(time);
        return value !== 8 && value % 1 == 0
    }

    onPressCell(cellData) {
        console.log('Pressed slot with ' + cellData)
    }

    tableStyles = StyleSheet.create({
        containerStyle: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: Dimensions.get('window').width,
            marginLeft: 10,
            marginRight: 10,
        },
        headerStyle: {
            flex: 1,
            height: 50,
            borderWidth: 1,
            borderColor: '#7DD8D5',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#4DC4C1'
        },
        rowStyle: {
            flexDirection: 'row',
            width: Dimensions.get('window').width,
            height: 50
        },
        freeCellStyle: {
            flex: 1,
            height: 50,
            borderWidth: 1,
            borderColor: '#7DD8D5',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#4DC4C1'
        },
        highlightFreeCellStyle: {
            backgroundColor: '#57CCC9'
        },
        bookedCellStyle: {
            flex: 1,
            height: 50,
            borderWidth: 1,
            borderColor: '#7DD8D5',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#a04444'
        },
        highlightBookedCellStyle: {
            backgroundColor: '#a04444'
        },
        myBookedCellStyle: {
            flex: 1,
            height: 50,
            borderWidth: 1,
            borderColor: '#7DD8D5',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#49a044'
        },
        highlightMyBookedCellStyle: {
            backgroundColor: '#49a044'
        },
        markerStyle: {
            width: 20,
            marginTop: -9,
            height: 20,
            backgroundColor: '#4DC4C1',
        },
        emptyMarkerStyle: {
            width: 20,
            marginTop: -9,
            height: 20,
        },
        markerTextStyle: {
            textAlign: 'center'
        }
    })

}

export default class TimetableWrapper extends React.Component {

    componentDidMount() {
        this.props.stateHandler.sdk.listMachines(this.props.laundryId)
    }

    render() {
        let machines = this.machines;
        if (!machines) {
            console.log('Rendering empty TimeTable, since no machines available')
            return this.renderEmpty()
        }
        console.log('Machines length: ' + machines.length)
        console.log('Machines: ' + machines)
        return this.laundry && machines.length ? this.renderTables() : this.renderEmpty();
    }

    renderTables() {
        return <View style={styles.container}>
            <Timetable currentUser={this.props.currentUser}
                       users={this.props.users}
                       laundries={this.props.laundries}
                       machines={this.machines}
                       bookings={this.props.bookings}
                       stateHandler={this.props.stateHandler}/>
        </View>
    }

    renderEmpty() {
        console.log('Rendering empty page')
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

    get machines() {
        if (!this.laundry) return undefined
        console.log('Laundry is not undefined: ' + this.laundry)
        let machines = this.laundry.machines.map(id => {
            console.log('Saw machine: ' + this.props.machines[id])
            return this.props.machines[id]
        })
        return machines.filter(machine => machine !== null && machine !== undefined)
    }

    get laundry() {
        if (this.user) {
            laundryId = this.user.laundries[0]
            if (laundryId) return this.props.laundries[laundryId]
        }
        return undefined
    }

    get user() {
        return this.props.users[this.props.currentUser]
    }

    get isOwner() {
        if (this.laundry) return this.laundry.owners.indexOf(this.props.currentUser) >= 0
        return undefined
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
    dateView: {
        flex: 1,
        width: Dimensions.get('window').width
    },
    dateHeader: {
        fontSize: 20,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        height: 50
    }
})