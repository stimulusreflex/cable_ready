import { dispatch } from '../util'

export default {
  pushState: config => {
    const { state, title, url } = config
    dispatch(document, 'cable-ready:before-push-state', config)
    history.pushState(state || {}, title || '', url)
    dispatch(document, 'cable-ready:after-push-state', config)
  }
}
