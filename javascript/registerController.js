export const registerController = consumer => {
  async function loadStreamFromController () {
    try {
      const { Application } = await import('stimulus')
      const cable_ready_stream_from_controller = await import(
        './controllers/cable_ready_stream_from_controller'
      )
      const application = Application.start()
      application.consumer = consumer;

      application.register(
        'cable-ready-stream-from',
        cable_ready_stream_from_controller.default
      )
    } catch (e) {
      console.log(
        'Stimulus is not available. Not loading stream_from controller.'
      )
    }
  }

  loadStreamFromController()
}
