export let consumer

const wait = () => new Promise(resolve => setTimeout(resolve))

const retryGetConsumer = async () => {
  if (!consumer) {
    await wait()
    return retryGetConsumer()
  } else {
    return consumer
  }
}

export default {
  setConsumer (value) {
    consumer = value
  },

  async getConsumer () {
    return new Promise((resolve, reject) => {
      consumer = retryGetConsumer()
      resolve(consumer)
    })
  }
}
