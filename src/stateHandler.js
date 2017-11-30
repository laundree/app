// @flow
import { AsyncStorage, NetInfo } from 'react-native'
import { createStore } from 'redux'
import { redux, Sdk } from 'laundree-sdk'
import io from 'socket.io-client'
import EventEmitter from 'events'
import config from './config'
import OneSignal from 'react-native-onesignal'
import type { Store } from 'redux'
import type { State, Action } from 'laundree-sdk/lib/redux'
import {getLanguages} from 'react-native-i18n'
import Analytics from 'react-native-firebase-analytics'
import type { LocaleType } from '../locales'
import { toLocaleType } from '../locales'
const storageKey = '@LaundreeStorage'

function updateUserIdAndToken (auth: ?Auth): Promise<*> {
  if (!auth) {
    return AsyncStorage.multiRemove([`${storageKey}:userId`, `${storageKey}:token`])
  }
  const {userId, token} = auth
  return AsyncStorage.multiSet([[`${storageKey}:userId`, userId], [`${storageKey}:token`, token]])
}

function saveOneSignalId (id) {
  return AsyncStorage.setItem(`${storageKey}:oneSignalId`, id)
}

function loadOneSignalId () {
  return AsyncStorage.getItem(`${storageKey}:oneSignalId`)
}

function removeOneSignalId () {
  return AsyncStorage.removeItem(`${storageKey}:oneSignalId`)
}

function saveNotificationSetting (enabled: boolean) {
  return AsyncStorage.setItem(`${storageKey}:notifications`, enabled ? '1' : '0')
}

async function loadNotificationSetting (): Promise<boolean> {
  return (await AsyncStorage.getItem(`${storageKey}:notifications`)) === '1'
}

function removeNotificationSetting () {
  return AsyncStorage.removeItem(`${storageKey}:notifications`)
}

/**
 * Retrieves auth information from phone's internal storage
 */
async function loadUserIdAndToken (): Promise<?Auth> {
  const values = await AsyncStorage
    .multiGet([`${storageKey}:userId`, `${storageKey}:token`])
  const auth = values.reduce((o, [key, val]) => {
    o[key.substr(storageKey.length + 1)] = val
    return o
  }, {})
  if (!auth.userId || !auth.token) {
    return null
  }
  return auth
}

function clearUserIdAndToken () {
  return AsyncStorage
    .multiRemove([`${storageKey}:userId`, `${storageKey}:token`])
}

type Auth = { userId: string, token: string }

export class StateHandler extends EventEmitter {
  _store: ?Store<State, Action>
  _sdk: Sdk
  _socket: any
  _auth: ?Auth

  constructor (auth: ?Auth) {
    super()
    this._setupConnectionListener()
    this._setupAuth(auth)
  }

  get locale (): LocaleType {
    console.log('lOLOL')
    console.log(getLanguages())
    return 'en'

    if (!ReactNativeI18n.locale) return 'en'
    const localeCandidate = ReactNativeI18n.locale.split('-')[0]
    return toLocaleType(localeCandidate, 'en')
  }

  get store (): Store<State, Action> {
    if (this._store) return this._store
    const store = createStore(redux.reducer)
    this._store = store
    return store
  }

  authenticator = async () => {
    if (this._auth) {
      return {type: 'basic', username: this._auth.userId, password: this._auth.token}
    } else {
      return {type: 'unauthenticated'}
    }
  }

  get sdk (): Sdk {
    if (this._sdk) return this._sdk
    this._sdk = new Sdk(config.api.host, this.authenticator)
    return this._sdk
  }

  fetchNotificationSettings () {
    return loadNotificationSetting()
  }

  async saveNotificationSetting (enabled: boolean) {
    await saveNotificationSetting(enabled)
    console.log('save setting', enabled)
    await OneSignal.setSubscription(enabled)
  }

  _disconnectSocket () {
    if (!this._socket) return
    console.log('Disconnecting socket')
    this._socket.disconnect()
  }

  _setupAuth (auth: ?Auth) {
    console.log('Setting up auth', auth)
    Analytics.setUserId(auth && auth.userId)
    if (!auth) {
      OneSignal.setSubscription(false)
      this._disconnectSocket()
      this._auth = null
      this._store = null
      return
    }
    const {userId, token} = auth
    this._disconnectSocket()
    const path = `${config.socket.host}/redux?userId=${userId}&token=${token}`
    console.log('Connecting socket to path', path)
    this._socket = io(path)
    this._socket.on('actions', actions => {
      // $FlowFixMe This is right
      actions.forEach(action => action && this.store.dispatch(action))
    })
    this._socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })
    this._socket.on('error', err => console.log('Socket errored', err))
    this._socket.on('connect', () => {
      console.log('Socket connected')
      this.emit('connected')
    })
    this._socket.on('reconnect', () => {
      console.log('Socket reconnected')
      this.emit('reconnected')
    })
    this.sdk.setupRedux(this.store, this._socket) // Possible event emitter leak
    this._auth = {userId, token}
  }

  async updateOneSignalId (id: string) {
    console.log('Updating id', id)
    const currentId = await loadOneSignalId()
    if (currentId === id) {
      return
    }
    if (!this._auth) {
      return
    }
    await this.sdk.api.user.addOneSignalPlayerId(this._auth.userId, {playerId: id})
    saveOneSignalId(id)
    saveNotificationSetting(true)
  }

  get isAuthenticated (): boolean {
    return Boolean(this._auth)
  }

  async updateAuth (auth: ?Auth) {
    await Promise.all([updateUserIdAndToken(auth), this._setupAuth(auth)])
    this.emit('authChange')
  }

  refresh () {
    this._setupAuth(this._auth)
    this.emit('refresh')
  }

  async logOut () {
    await Promise.all([clearUserIdAndToken(), removeOneSignalId(), removeNotificationSetting()])
    this._setupAuth()
    this.emit('authChange')
  }

  connectionChanged (isConnected: boolean) {
    console.log('Internet connection changed', isConnected)
    this.emit('connectionChange', isConnected)
  }

  _setupConnectionListener () {
    console.log('Setting up connection listener')

    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First connection', isConnected)
      this.emit('connectionChange', isConnected)
    })

    NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => this.connectionChanged(isConnected))
  }
}

export default async function fetchStateHandler (): Promise<StateHandler> {
  const credentials = await loadUserIdAndToken()
  return new StateHandler(credentials)
}
