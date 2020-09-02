import { dispatch } from '../util'

export default {
  consoleLog: config => {
    const { message, level } = config
    level && ['warn', 'info', 'error'].includes(level)
      ? console[level](message)
      : console.log(message)
  },

  notification: config => {
    const { title, options } = config
    dispatch(document, 'cable-ready:before-notification', config)
    let permission
    Notification.requestPermission().then(result => {
      permission = result
      if (result === 'granted') new Notification(title || '', options)
      dispatch(document, 'cable-ready:after-notification', {
        ...config,
        permission
      })
    })
  }
}
