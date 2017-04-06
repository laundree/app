/**
 * Created by soeholm on 06.04.17.
 */
import { connect } from 'react-redux'
import BookingList from '../views/BookingList'

function mapStateToProps ({machines, bookings}) {
  return {machines, bookings}
}

export default connect(mapStateToProps)(BookingList)
