/**
 * Created by budde on 27/02/2017.
 */
import { StyleSheet, Platform, Navigator, Dimensions } from 'react-native'

const constants = {
  colorRed: '#e55564',
  appBackgroundColor: '#66d3d3',
  defaultTextColor: '#03414C',
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  inputHeight: 60
}

export const fancyButton = StyleSheet.create({
  button: {
    borderRadius: 3,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.inputHeight
  },
  enabled: {
    backgroundColor: '#28aaba'
  },
  disabled: {
    backgroundColor: '#d1d1d1'
  }
})

export const fancyFacebookButton = StyleSheet.create({
  button: {
    backgroundColor: '#0F6084'
  }
})

export const fancyGoogleButton = StyleSheet.create({
  button: {
    backgroundColor: '#7D1919'
  }
})

export const fancyImageTextButton = StyleSheet.create({
  button: {
    backgroundColor: '#7d3362'
  },
  view: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  image: {
    height: 20,
    width: 20,
    margin: 10,
    marginRight: 15,
    marginLeft: 15
  },
  text: {
    color: '#fff'
  },
  enabled: {
    color: '#fff'
  },
  disabled: {
    color: '#e2e2e2'
  }
})

export const fancyImageButton = StyleSheet.create({
  button: {
    backgroundColor: '#7d3362'
  },
  view: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 20,
    width: 20,
    margin: 10,
    marginRight: 15,
    marginLeft: 15
  },
  enabled: {
    color: '#fff'
  },
  disabled: {
    color: '#e2e2e2'
  }
})

export const fancyTextButton = StyleSheet.create({
  text: {
    color: '#fff'
  },
  enabled: {
    color: '#fff'
  },
  disabled: {
    color: '#e2e2e2'
  }
})

export const fancyTextInput = StyleSheet.create({
  label: {
    height: 20,
    color: constants.defaultTextColor
  },
  textInput: {
    height: constants.inputHeight,
    borderRadius: 3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#fff'
  },
  container: {
    alignSelf: 'stretch'
  }
})

export const app = StyleSheet.create({
  mainContainer: {
    backgroundColor: constants.appBackgroundColor,
    flex: 1
  }
})

export const authWebView = StyleSheet.create({
  webView: {
    backgroundColor: constants.appBackgroundColor
  },
  view: {
    flex: 1
  },
  button: {
    backgroundColor: constants.colorRed
  }
})

export const loggedInApp = StyleSheet.create({
  mainContainer: {
    backgroundColor: constants.appBackgroundColor,
    flex: 1,
    paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight + constants.statusBarHeight

  },
  navigationBar: {
    backgroundColor: constants.colorRed
  },
  navBarContainer: {
    backgroundColor: constants.colorRed,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minWidth: 40
  },
  navBarTitle: {
    fontSize: 20,
    color: '#fff'
  },
  navBarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginLeft: 10
  },
  content: {
    borderWidth: 1
  }
})

export const login = StyleSheet.create({
  divider: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  dividerText: {
    fontWeight: 'bold',
    color: constants.defaultTextColor
  },
  header: {
    alignItems: 'center',
    paddingBottom: 5
  },
  headerText: {
    color: constants.defaultTextColor,
    fontSize: 20
  },
  socialLogin: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  socialButton: {
    width: constants.inputHeight,
    paddingTop: 10,
    paddingBottom: 5,
    marginLeft: 30,
    marginRight: 30
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  login: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  input: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 10,
    width: Dimensions.get('window').width
  },
  buttonInput: {
    paddingLeft: 200,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 10
  },
  infoContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 5
  },
  infoTitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center'
  },
  infoLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center'
  }
})

export const loginApp = StyleSheet.create({
  mainContainer: {
    paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight + constants.statusBarHeight,
    backgroundColor: constants.appBackgroundColor,
    flex: 1
  },
  navigationBar: {
    backgroundColor: constants.colorRed
  },
  navBarContainer: {
    backgroundColor: constants.colorRed,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minWidth: 40
  },
  navBarTitle: {
    fontSize: 20,
    color: '#fff'
  }
})

export const qrCodeScanner = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    textAlign: 'center',
    maxWidth: 200,
    paddingBottom: 20,
    paddingTop: 20
  },
  image: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    maxWidth: 200,
    maxHeight: 200
  }
})

export const qrCodeScannerCamera = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  camera: {
    flex: 1,
    alignSelf: 'stretch'
  }
})

export const settings = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    backgroundColor: constants.colorRed
  }
})

export const timetableTable = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    marginLeft: 10,
    marginRight: 10
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
  freeCellStyleGrey: {
    backgroundColor: '#4B9997',
    borderColor: '#5CA09E'
  },
  bookedCellStyle: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#a04444',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a04444'
  },
  myBookedCellStyle: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#49a044',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#49a044'
  },
  markerStyle: {
    width: 20,
    marginTop: -9,
    height: 20
  },
  emptyMarkerStyle: {
    width: 20,
    marginTop: -9,
    height: 20
  },
  markerTextStyle: {
    textAlign: 'center'
  }
})

export const timetable = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#66D3D3'
  },
  dateView: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  arrowHeader: {
    fontSize: 20,
    textAlign: 'center'
  },
  dateHeader: {
    fontSize: 20,
    textAlign: 'center',
    width: Dimensions.get('window').width / 2
  },
  dateNavigator: {
    flex: 2
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: 50
  }
})
