/**
 * Created by budde on 20/02/2017.
 */
import { createStore } from 'redux'
import { redux, Sdk } from 'laundree-sdk'
import io from 'socket.io-client'
import uuid from 'uuid'
import { AsyncStorage } from 'react-native'
import EventEmitter from 'events'
/*
 console.log('Did mount')
 const s = socket('http://localhost:3000/redux')
 const store = createStore(redux.reducers, {})
 s.on('actions', actions => {
 console.log('Dispatching actions ', actions)
 actions.forEach(action => store.dispatch(action))
 })
 const sdk = new Sdk('http://localhost:3000')
 sdk.setupRedux(store, s)
 sdk.setupInitialEvents()

 */
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
    this._sdk = new Sdk('http://localhost:3000')
    return this._sdk
  }

  _disconnectSocket () {
    if (!this._socket) return
    this._socket.disconnect()
  }

  _setupAuth (userId, token) {
    if (!(userId && token)) {
      this.sdk.updateAuth({})
      this._disconnectSocket()
      this._authenticated = false
      return
    }
    this.sdk.updateAuth({userId, token})
    this._disconnectSocket()
    this._socket = io(`http://localhost:3000/redux?userId=${userId}&token=${token}`)
    this._socket.on('actions', actions => {
      console.log('Dispatching actions ', actions)
      actions.forEach(action => this.store.dispatch(action))
    })
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

