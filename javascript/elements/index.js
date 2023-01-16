import StreamFromElement from './stream_from_element'
import UpdatesForElement from './updates_for_element'

import { registerInnerUpdates } from '../updatable/inner_updates_compat'

export const defineElements = () => {
  registerInnerUpdates()

  StreamFromElement.define()
  UpdatesForElement.define()
}
