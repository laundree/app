/**
 * Created by budde on 20/02/2017.
 */
import { createStore } from 'redux'
import { redux, Sdk } from 'laundree-sdk'
import io from 'socket.io-client'
import uuid from 'uuid'
import { AsyncStorage } from 'react-native'
import EventEmitter from 'events'
import config from './config'
import OneSignal from 'react-native-onesignal'
import ReactNativeI18n from 'react-native-i18n'

const storageKey = '@LaundreeStorage'

function saveUserIdAndToken (userId, token) {
  console.log('Saving credentials')
  return AsyncStorage.multiSet([[`${storageKey}:userId`, userId], [`${storageKey}:token`, token]])
}
function saveOneSignalId (id) {
  return AsyncStorage.setItem(`${storageKey}:oneSignalId`, id)
}

function loadOneSignalId (id) {
  return AsyncStorage.getItem(`${storageKey}:oneSignalId`)
}

function removeOneSignalId () {
  return AsyncStorage.removeItem(`${storageKey}:oneSignalId`)
}

function saveNotificationSetting (enabled) {
  return AsyncStorage.setItem(`${storageKey}:notifications`, enabled ? '1' : '0')
}

async function loadNotificationSetting () {
  return (await AsyncStorage.getItem(`${storageKey}:notifications`)) === '1'
}

function removeNotificationSetting () {
  return AsyncStorage.removeItem(`${storageKey}:notifications`)
}

async function loadUserIdAndToken () {
  const values = await AsyncStorage
    .multiGet([`${storageKey}:userId`, `${storageKey}:token`])
  return values.reduce((o, [key, val]) => {
    o[key.substr(storageKey.length + 1)] = val
    return o
  }, {})
}

function clearUserIdAndToken () {
  return AsyncStorage
    .multiRemove([`${storageKey}:userId`, `${storageKey}:token`])
}

class StateHandler extends EventEmitter {

  constructor ({userId, token}) {
    super()
    this._authenticated = false
    this._setupAuth(userId, token)
  }

  get locale () {
    if (!ReactNativeI18n.locale) return 'en'
    return ReactNativeI18n.locale.split('-')[0]
  }

  get store () {
    if (this._store) return this._store
    const store = createStore(redux.reducers, {})
    this._store = store
    return store
  }

  get sdk () {
    if (this._sdk) return this._sdk
    this._sdk = new Sdk(config.laundree.host)
    return this._sdk
  }

  get notificationSetting () {
    return loadNotificationSetting()
  }

  async saveNotificationSetting (enabled) {
    await saveNotificationSetting(enabled)
    console.log('save setting', enabled)
    await OneSignal.setSubscription(enabled)
  }

  _disconnectSocket () {
    if (!this._socket) return
    console.log('Disconnecting socket')
    this._socket.disconnect()
  }

  _setupAuth (userId, token) {
    console.log('Setting up auth', userId, token)
    if (!(userId && token)) {
      OneSignal.setSubscription(false)
      this.sdk.updateAuth({})
      this._disconnectSocket()
      this._auth = null
      return
    }
    this.sdk.updateAuth({userId, token})
    this._disconnectSocket()
    const path = `${config.laundree.host}/redux?userId=${userId}&token=${token}`
    console.log('Connecting socket to path', path)
    this._socket = io(path)
    this._socket.on('actions', actions => {
      console.log('Dispatching actions ', actions)
      actions.forEach(action => action && this.store.dispatch(action))
    })
    this._socket.on('disconnect', () => console.log('Socket disconnected'))
    this._socket.on('error', err => console.log('Socket errored', err))
    this._socket.on('connect', () => {
      console.log('Socket connected')
      this.emit('socketConnect')
    })
    this._socket.on('reconnect', () => {
      console.log('Socket reconnected')
      this.emit('socketConnect')
      this.emit('socketReconnect')
    })
    this.sdk.setupRedux(this.store, this._socket) // Possible event emitter leak
    this._auth = {userId, token}
  }

  async updateOneSignalId (id) {
    console.log('Updating id', id)
    if (!this._auth.userId) {
      return
    }
    const currentId = await loadOneSignalId()
    if (currentId === id) {
      return
    }
    await this.sdk.user(this._auth.userId).addOneSignalPlayerId(id)
    saveOneSignalId(id)
    saveNotificationSetting(true)
  }

  get isAuthenticated () {
    return Boolean(this._auth)
  }

  loginEmailPassword (email, password) {
    return this.sdk.token
      .createTokenFromEmailPassword(`app-${uuid.v4()}`, email, password)
      .then(({secret, owner: {id}}) => this.updateAuth(id, secret))
      .then(() => this.emit('authChange'))
  }

  async updateAuth (userId, secret) {
    await Promise.all([saveUserIdAndToken(userId, secret), this._setupAuth(userId, secret)])
    this.emit('authChange')
  }

  refresh () {
    if (!this._auth) return this._setupAuth()
    this._setupAuth(this._auth.userId, this._auth.token)
    this.emit('refresh')
  }

  async logOut () {
    await Promise.all([clearUserIdAndToken(), removeOneSignalId(), removeNotificationSetting()])
    this._setupAuth()
    this.emit('authChange')
  }
}

export default function fetchStateHandler () {
  return loadUserIdAndToken()
    .then(credentials => new StateHandler(credentials))
}
