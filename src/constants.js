/**
 * Created by budde on 25/02/2017.
 */
import {Platform} from 'react-native'

export default { // TDOO make this a stylesheet
  colorRed: '#e55564',
  appBackgroundColor: '#66d3d3',
  defaultTextColor: '#03414C',
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0
}
