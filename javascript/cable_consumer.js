let consumer

const BACKOFF = [25, 50, 75, 100, 200, 250, 500, 800, 1000, 2000]

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const getConsumerWithRetry = async (retry = 0) => {
  if (consumer) return consumer

  if (retry >= BACKOFF.length) {
    throw new Error("Couldn't obtain a Action Cable consumer within 5s")
  }

  await wait(BACKOFF[retry])

  return await getConsumerWithRetry(retry + 1)
}

export default {
  setConsumer (value) {
    consumer = value
  },

  get consumer () {
    return consumer
  },

  async getConsumer () {
    return await getConsumerWithRetry()
  }
}
