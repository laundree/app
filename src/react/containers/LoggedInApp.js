/**
 * Created by budde on 22/02/2017.
 */
import { connect } from 'react-redux'
import LoggedInApp from '../views/LoggedInApp'

function mapStateToProps ({currentUser, users}) {
  return {currentUser, users}
}

export default connect(mapStateToProps)(LoggedInApp)
