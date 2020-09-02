import { dispatch } from '../util'

export default {
  dispatchEvent: config => {
    const { element, name, detail } = config
    dispatch(element, name, detail)
  }
}
