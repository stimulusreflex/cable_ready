let missingElement = 'warn'

export default {
  get behavior () {
    return missingElement
  },
  set (value) {
    if (['warn', 'ignore', 'event', 'exception'].includes(value))
      missingElement = value
    else
      console.warn("Invalid 'onMissingElement' option. Defaulting to 'warn'.")
  }
}
