/**
 * Created by soeholm on 22.02.17.
 */
import { connect } from 'react-redux'
import Timetable from '../views/Timetable'

function mapStateToProps ({currentUser, users, laundries, machines, bookings}) {
    return {currentUser, users, laundries, machines, bookings}
}

export default connect(mapStateToProps)(Timetable)
