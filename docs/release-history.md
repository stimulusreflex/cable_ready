# Release History

## New Release: v5.0.0

* New `cable_car` mode provides access to operation composition from anywhere, paving the way for using CableReady via Ajax actions, Turbo Frames etc
* New `stream_from` helper makes streaming from arbitrary components easier than ever
* New operations: [`console_table`](reference/operations/notifications.md#console_table), [`set_meta`](reference/operations/event-dispatch.md#set_meta)
* New `cable_ready:channel` [generator](usage.md#channel-generator) creates channel classes and client channel subscribers
* New load-time [sanity checker](installation.md#upgrading-package-versions-and-sanity) module provides early warning of gem/npm version issues and an optional [check](installation.md#upgrading-to-v-5-0-0) for new CableReady releases
* Channels and `cable_car` now have `to_json` and `apply!` serialization methods
* Channels now support deferred delivery via ActiveJob thanks to the new [`broadcast_later`](reference/methods.md#broadcast_later-clear-true) and [`broadcast_later_to`](reference/methods.md#broadcast_later_to-model-clear-true) methods
* `dom_id` [method](reference/methods.md#dom_id-record-prefix-nil) upgraded to handle ActiveRecord Models and Relations
* Operations now accept [selector](usage.md#selector-as-optional-first-argument) as an optional first parameter
* `selector` option now accepts ActiveRecord [Models and Relations](usage.md#selector-will-accept-ar-models-and-relations)
* Chained operations now [remember](usage.md#selector-remembers-the-previous-selector) the selector from the previous operation
* Operations now accept an optional `delay` option in `ms`, allowing chained time [staggering](usage.md#staggering-operations)
* Custom operations can access [standardized](customization.md#before-operate-after) `before`, `operate` and `after` methods
* `ApplicationController::Renderers` has new `operations` renderer
* `CableReady.DOMOperations` was deprecated in favor of [`CableReady.operations`](customization.md#custom-operations)
* `play_sound` operation has been [extracted](customization.md#importing-audiooperations) to `@cable_ready/audio_operations`

## v4.5.0

CableReady v4.5.0 has eight [new operations](reference/operations/): `append`, `graft`, `prepend`, `replace`, `replace_state`, `play_sound`, `go` and `scroll_into_view`

