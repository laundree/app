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

const {range} = require('../../utils/array')
const today = moment().startOf('day')


class Timetable extends React.Component {

    render() {
        return <View style={{
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
                    {today.format('dddd D[/]M, YYYY')}
                </Text>
            </View>
        </View>
    }

    renderTable() {
        return <View>
            <Table
                headersData={this.props.machines}
                data={range(0,48)}
                tableStyles={this.tableStyles}
                cellStyle={(cellData) => this.cellStyle(cellData)}
                underlayCellStyle={(cellData) => this.underlayCellStyle(cellData)}
                renderBetweenMarkers={true}
                renderBetweenMarkersAt={(time) => this.renderBetweenMarkersAt(time)}
                onPressCell={(cellData) => this.onPressCell(cellData)}
                renderCell={(cellData,columnId,rowId) => this.renderCell(cellData, columnId, rowId)}
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
        let value = parseFloat(time/2);
        return value % 1 == 0
    }

    onPressCell(cellData) {
        console.log('Pressed slot with ' + cellData)
    }

    renderCell(cellData, columnId, rowId) {
        let bookingId = this.bookingId(cellData.id,rowId)
        console.log('Booking id: ' + bookingId)
        let booking = this.props.bookings[bookingId];
        if (booking) {
            let isMine = booking.owner === this.props.user.id
            let style = isMine ? this.tableStyles.myBookedCellStyle : this.tableStyles.bookedCellStyle
            let underlayColor = isMine ? '#49a044' : '#a04444'
            return <TouchableHighlight
                style={style}
                underlayColor={underlayColor}
                onPress={(event) => this.onPressCell(cellData)}>
                <Text></Text>
            </TouchableHighlight>
        }
        return <TouchableHighlight
            underlayColor={'#57CCC9'}
            style={this.tableStyles.freeCellStyle}
            onPress={(event) => this.onPressCell(cellData)}>
            <Text></Text>
        </TouchableHighlight>
    }

    bookingId(machineId, rowId) {
        return this.bookings[`${machineId}:${rowId}`]
    }

    get bookings() {
        return Object.keys(this.props.bookings)
            .map(key => this.props.bookings[key])
            .map(({from, to, machine, id}) => ({
                from: moment(from),
                to: moment(to),
                machine,
                id
            }))
            .filter(({from, to}) => to.isSameOrAfter(today, 'd') && from.isSameOrBefore(today, 'd'))
            .reduce((obj, {from, to, machine, id}) => {
                const fromY = today.isSame(from, 'd') ? this.dateToY(from) : 0
                const toY = today.isSame(to, 'd') ? this.dateToY(to) : 48
                range(fromY, toY).forEach((y) => {
                    let key = `${machine}:${y}`;
                    console.log('Booking key: ' + key)
                    obj[key] = id
                })
                return obj
            }, {})
    }

    dateToY(date) {
        return Math.floor((date.hours() * 60 + date.minutes()) / 30)
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
        bookedCellStyle: {
            flex: 1,
            height: 50,
            borderWidth: 1,
            borderColor: '#7DD8D5',
            justifyContent: 'center',
            alignItems: 'center',
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

        //Retrieve machines
        this.props.stateHandler.sdk.listMachines(this.laundryId)

        //Retrieve bookings
        console.log('Retrieving bookings',today)
        var tomorrow = today.clone().add(1,'day')

        this.props.stateHandler.sdk.listBookingsInTime(this.laundryId, {
            year: today.year(),
            month: today.month(),
            day: today.date()
        }, {
            year: tomorrow.year(),
            month: tomorrow.month(),
            day: tomorrow.date()
        })
    }

    get laundryId() {
        return this.props.laundry.id
    }

    render() {
        let machines = this.machines
        console.log('Machines: ' + machines)
        if (!machines) {
            console.log('Rendering empty TimeTable, since no machines available')
            return this.renderEmpty()
        }
        return this.renderTables()
    }

    renderTables() {
        return <View style={styles.container}>
            <Timetable user={this.props.user}
                       laundry={this.props.laundry}
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
        if (!this.props.laundry) return undefined
        let machines = this.props.laundry.machines.map(id => {
            return this.props.machines[id]
        })
        return machines.filter(machine => machine !== null && machine !== undefined)
    }

    get isOwner() {
        if (this.props.laundry) return this.props.laundry.owners.indexOf(this.props.user) >= 0
        return undefined
    }
}

TimetableWrapper.propTypes = {
    user: React.PropTypes.object.isRequired,
    laundry: React.PropTypes.object.isRequired,
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