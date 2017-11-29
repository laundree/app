/**
 * Created by soeholm on 22.04.17.
 */
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/da.js'
import en from './en.json'
import daJson from './da.json'
import daLocale from 'react-intl/locale-data/da'
import enLocale from 'react-intl/locale-data/en'
import { addLocaleData } from 'react-intl'

const da = Object.assign({}, en, daJson)

addLocaleData(daLocale.concat(enLocale))

export type LocaleType = 'en' | 'da'

export const supported: LocaleType[] = ['en', 'da']

export const messages: {LocaleType: {[string]: string}} = {en, da}

export function toLocaleType (l: string, def: LocaleType): LocaleType {
  switch (l) {
    case 'en':
    case 'da':
      return l
    default:
      return def
  }
}
