/**
 * Created by soeholm on 06.04.17.
 */
import { connect } from 'react-redux'
import BookingList from '../views/BookingList'

function mapStateToProps ({machines, bookings, userBookings}) {
  return {
    machines,
    bookings,
    userBookings: userBookings ? userBookings.bookings : null}
}

export default connect(mapStateToProps)(BookingList)
