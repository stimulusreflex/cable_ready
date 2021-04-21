let activeElement

export default {
  get element () {
    return activeElement
  },
  set (element) {
    activeElement = element
  }
}
