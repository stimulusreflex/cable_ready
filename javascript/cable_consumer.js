let consumer

const wait = () => new Promise(resolve => setTimeout(resolve))

const retryGetConsumer = async () => {
  if (!consumer) {
    await wait()
    return await retryGetConsumer()
  } else {
    return consumer
  }
}

export default {
  setConsumer (value) {
    consumer = value
  },

  getConsumer () {
    return new Promise(async (resolve, reject) => {
      consumer = await retryGetConsumer()
      resolve(consumer)
    })
  }
}
