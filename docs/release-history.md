# Release History

## New Release: v5.0.0

* New [`cable_car`](cable-car.md#introducing-cable_car) mode provides a transport-agnostic operation queueing API, allowing for [CableReady via Ajax](cable-car.md#ajax-mode), [Mrujs](https://mrujs.com) and Turbo Frames
* New [`stream_from`](stream_from.md) helper allows broadcasting without any Channel setup
* [`console_table`](reference/operations/notifications.md#console_table), [`redirect_to`](reference/operations/browser-manipulations.md#redirect_to) and [`set_meta`](reference/operations/event-dispatch.md#set_meta) bring total to [36 operations](reference/operations/)
* Simplified JSON wire format is easier to parse and port to other languages __🤩
* Operations now execute in the [order](usage.md#operation-execution-order) that they are created, regardless of type
* New load-time [sanity checker](installation.md#upgrading-package-versions-and-sanity) module provides early warning of gem/npm version issues and an optional [check](installation.md#upgrading-to-v-5-0-0) for new CableReady releases
* Channels and `cable_car` operation queues now support serialization
* Channels now support deferred delivery via ActiveJob thanks to the new [`broadcast_later`](reference/methods.md#broadcast_later-clear-true) and [`broadcast_later_to`](reference/methods.md#broadcast_later_to-model-clear-true) methods
* `dom_id` [method](reference/methods.md#dom_id-record-prefix-nil) upgraded to handle ActiveRecord Models and Relations
* Objects passed as selectors to an operation can now expose a `to_dom_selector` or `to_dom_id` method
* Operations now accept [selector](usage.md#selector-as-optional-first-argument) as an optional first parameter
* `selector` option now accepts ActiveRecord [Models and Relations](usage.md#selector-will-accept-ar-models-and-relations)
* Chained operations now [remember](usage.md#selector-remembers-the-previous-selector) the selector from the previous operation
* Operations now accept an optional `delay` option in `ms`, allowing chained time [staggering](usage.md#staggering-operations)
* Operations can now be added to [named batches](usage.md#operation-batches) via the `batch` option
* Custom operations implement [standardized](customization.md#before-operate-after) `before`, `operate` and `after`
* New `cable_ready:channel` [generator](usage.md#channel-generator) creates Ruby and JS Channel classes
* `ApplicationController::Renderers` has new `operations` renderer
* `CableReady.DOMOperations` was deprecated in favor of [`CableReady.operations`](customization.md#custom-operations)
* `play_sound` operation has been [extracted](customization.md#importing-audiooperations) to `@cable_ready/audio_operations`

## v4.5.0

CableReady v4.5.0 has eight [new operations](reference/operations/): `append`, `graft`, `prepend`, `replace`, `replace_state`, `play_sound`, `go` and `scroll_into_view`

