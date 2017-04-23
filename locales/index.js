/**
 * Created by soeholm on 22.04.17.
 */
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/da.js'
import en from './en.json'
import da from './da.json'
import daLocale from 'react-intl/locale-data/da'
import enLocale from 'react-intl/locale-data/en'
import { addLocaleData } from 'react-intl'
const fallbackDa = Object.assign({}, en, da)

addLocaleData(daLocale.concat(enLocale))

export default {
  en: {name: 'English', messages: en},
  da: {name: 'Dansk', messages: fallbackDa},
  supported: ['en', 'da']
}
