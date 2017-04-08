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

const storageKey = '@LaundreeStorage'

function saveUserIdAndToken (userId, token) {
  console.log('Saving credentials')
  return AsyncStorage.multiSet([[`${storageKey}:userId`, userId], [`${storageKey}:token`, token]])
}

function loadUserIdAndToken () {
  return AsyncStorage
    .multiGet([`${storageKey}:userId`, `${storageKey}:token`])
    .then(values => values.reduce((o, [key, val]) => {
      o[key.substr(storageKey.length + 1)] = val
      return o
    }, {}))
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

  _disconnectSocket () {
    if (!this._socket) return
    console.log('Disconnecting socket')
    this._socket.disconnect()
  }

  _setupAuth (userId, token) {
    console.log('Setting up auth', userId, token)
    if (!(userId && token)) {
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
    this._socket.on('connect', () => console.log('Socket connected'))
    this.sdk.setupRedux(this.store, this._socket) // Possible event emitter leak
    this._auth = {userId, token}
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

  updateAuth (userId, secret) {
    return Promise.all([saveUserIdAndToken(userId, secret), this._setupAuth(userId, secret)])
      .then(() => this.emit('authChange'))
  }

  refresh () {
    if (!this._auth) return this._setupAuth()
    this._setupAuth(this._auth.userId, this._auth.token)
    this.emit('refresh')
  }

  logOut () {
    return clearUserIdAndToken().then(() => {
      this._setupAuth()
      this.emit('authChange')
    })
  }
}

export default function fetchStateHandler () {
  return loadUserIdAndToken()
    .then(credentials => new StateHandler(credentials))
}

