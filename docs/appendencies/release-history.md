# Release History

## v5.0.0

#### New

* New [`cable_car`](/guide/cable-car#introducing-cable_car) mode provides a transport-agnostic operation queueing API
* New [`cable_ready_stream_from`](/guide/cable-ready-stream-from) helper allows broadcasting without any Channel setup
* New [`CableReady::Updatable`](/guide/updatable) module
* New `cable_ready:channel` [generator](/guide/working-with-cableready#channel-generator) creates Ruby and JavaScript Channel classes
* New `operations` renderer in `ApplicationController::Renderers`
* New load-time [sanity checker](/hello-world/installation#upgrading-package-versions-and-sanity) module provides early warning of gem/npm version issues
* New operations
  * [`console_table`](/reference/operations/notifications#console-table)
  * [`redirect_to`](/reference/operations/browser-manipulations#redirect-to)
  * [`set_title`](/reference/operations/browser-manipulations#set-title)
  * [`set_meta`](/reference/operations/event-dispatch#set-meta)


#### Changed

* Operations now execute in the [order](/guide/working-with-cableready#operation-execution-order) that they are created, regardless of type
* Simplified JSON wire format is easier to parse and port to other languages 🤩
* Channels and `cable_car` operation queues now support serialization
* Channels now support deferred delivery via ActiveJob thanks to the new [`broadcast_later`](/reference/methods#broadcast-later-clear-true) and [`broadcast_later_to`](/reference/methods#broadcast-later-to-model-clear-true) methods
* `dom_id` [method](/reference/methods#dom-id-record-prefix-nil) upgraded to handle ActiveRecord Models and Relations
* Objects passed as selectors to an operation can now expose a `to_dom_selector` or `to_dom_id` method
* Operations now accept [selector](/guide/working-with-cableready#selector-as-optional-first-argument) as an optional first parameter
* `selector` option now accepts ActiveRecord [Models and Relations](/guide/working-with-cableready#selector-will-accept-ar-models-and-relations)
* Chained operations now [remember](/guide/working-with-cableready#selector-remembers-the-previous-selector) the selector from the previous operation
* Operations now accept an optional `delay` option in `ms`, allowing chained time [staggering](/guide/working-with-cableready#staggering-operations)
* Operations can now be added to [named batches](/guide/working-with-cableready#operation-batches) via the `batch` option
* Custom operations implement [standardized](/guide/customization#before-operate-after) `before`, `operate` and `after`

#### Deprecated

* `CableReady.DOMOperations` was deprecated in favor of [`CableReady.operations`](/guide/customization#custom-operations)

#### Moved

* The `play_sound` operation has been [extracted](/guide/customization#importing-audiooperations) to [`@cable_ready/audio_operations`](https://github.com/cableready/audio_operations)
* The `invoke_method` operation has been extracted to [`@cable_ready/invoke_operations`](https://github.com/cableready/invoke_operations)
* The `<cable-ready>` element has been extracted to [`@cable_ready/element`](https://github.com/cableready/element)


## v4.5.0

CableReady v4.5.0 has eight [new operations](/reference/operations/): `append`, `graft`, `prepend`, `replace`, `replace_state`, `play_sound`, `go` and `scroll_into_view`
