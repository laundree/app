/**
 * Created by budde on 27/02/2017.
 */
import { StyleSheet, Platform, Navigator } from 'react-native'

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
    paddingTop: 10,
    paddingBottom: 10
  },
  dividerText: {
    fontWeight: 'bold',
    color: constants.defaultTextColor
  },
  socialLogin: {
    padding: 5
  },
  socialButton: {
    paddingTop: 30,
    paddingBottom: 10
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
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingTop: 10
  },
  buttonInput: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingTop: 30
  }
})

export const loginApp = StyleSheet.create({
  mainContainer: {
    paddingTop: constants.statusBarHeight,
    backgroundColor: constants.appBackgroundColor,
    flex: 1
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
