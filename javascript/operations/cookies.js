import { dispatch } from '../util'

export default {
  setCookie: config => {
    const { cookie } = config
    dispatch(document, 'cable-ready:before-set-cookie', config)
    document.cookie = cookie
    dispatch(document, 'cable-ready:after-set-cookie', config)
  }
}
