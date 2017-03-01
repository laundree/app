/**
 * Created by soeholm on 22.02.17.
 */
import { connect } from 'react-redux'
import Timetable from '../views/Timetable'

function mapStateToProps ({machines, bookings}) {
  return {machines, bookings}
}

export default connect(mapStateToProps)(Timetable)
