const plugins = {}

const pluginStore = new Proxy(plugins, {
  get: (target, name) => {
    return name in target
      ? target[name]
      : () => {
          console.error(
            `CableReady: No plugin registered for ${name}. Make sure to call CableReady.registerPlugin during initialization. For example:\n\nimport CableReady from 'cable_ready'\nimport ${name} from '${name}'\nCableReady.registerPlugin('${name}', ${name})`
          )
        }
  }
})

const register = (plugin, func) => {
  plugins[plugin] = func
}

export { register }
export default pluginStore
