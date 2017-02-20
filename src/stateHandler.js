/**
 * Created by budde on 20/02/2017.
 */
import { createStore } from 'redux'
import { redux, Sdk } from 'laundree-sdk'
import EventEmitter from 'events'
import uuid from 'uuid'
import {AsyncStorage} from 'react-native'
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

class StateHandler extends EventEmitter {
  get store () {
    if (this._store) return this._store
    this._store = createStore(redux.reducers, {})
    return this._store
  }

  get sdk () {
    if (this._sdk) return this._sdk
    this._sdk = new Sdk('http://localhost:3000')
    return this._sdk
  }
  saveUserIdAndToken (userId, token) {
    return AsyncStorage.multiSet([`${storageKey}:userId`, userId], [`${storageKey}:token`, token])
  }
  loginEmailPassword (email, password) {
    return this.sdk.token
      .createTokenFromEmailPassword(`app-${uuid.v4()}`, email, password)
      .then(({secret, owner: {id}}) => this.saveUserIdAndToken(id, secret))
  }
}

module.exports = StateHandler
