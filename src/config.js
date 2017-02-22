import extend from 'extend'

function safeRequireDefault () {
  try {
    return require('../config/default.json')
  } catch (e) {
    return {}
  }
}
function safeRequireLocal () {
  try {
    return require('../config/local.json')
  } catch (e) {
    return {}
  }
}
const target = {}
extend(true, target, safeRequireDefault(), safeRequireLocal())
console.log(target)
export default target
