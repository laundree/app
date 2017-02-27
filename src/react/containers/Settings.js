/**
 * Created by budde on 22/02/2017.
 */
import { connect } from 'react-redux'
import Settings from '../views/Settings'

function mapStateToProps ({currentUser, users}) {
  return {currentUser, users}
}

export default connect(mapStateToProps)(Settings)
