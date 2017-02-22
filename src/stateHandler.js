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
      this._authenticated = false
      return
    }
    this.sdk.updateAuth({userId, token})
    this._disconnectSocket()
    const path = `${config.laundree.host}/redux?userId=${userId}&token=${token}`
    console.log('Connecting socket to path', path)
    this._socket = io(path)
    this._socket.on('actions', actions => {
      console.log('Dispatching actions ', actions)
      actions.forEach(action => this.store.dispatch(action))
    })
    this._socket.on('disconnect', () => console.log('Socket disconnected'))
    this._socket.on('error', err => console.log('Socket errored', err))
    this._socket.on('connect', () => console.log('Socket connected'))
    this.sdk.setupRedux(this.store, this._socket) // Possible event emitter leak
    this._authenticated = true
  }

  get isAuthenticated () {
    return this._authenticated
  }

  loginEmailPassword (email, password) {
    return this.sdk.token
      .createTokenFromEmailPassword(`app-${uuid.v4()}`, email, password)
      .then(({secret, owner: {id}}) => Promise.all([saveUserIdAndToken(id, secret), this._setupAuth(id, secret)]))
      .then(() => this.emit('authChange'))
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

