const plugins = {}

const pluginStore = new Proxy(plugins, {
  get: (target, name) => {
    return name in target
      ? target[name]
      : () => {
          console.error(`CableReady: No plugin registered for ${name}`)
        }
  }
})

const register = (plugin, func) => {
  plugins[plugin] = func
}

export { register }
export default pluginStore
