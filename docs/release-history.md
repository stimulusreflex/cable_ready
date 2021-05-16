# Release History

## New Release: v5.0.0

* New operations: `console_table`, `set_meta`
* `play_sound` operation has been extracted to `@cable_ready/audio_operations`
* `CableReady.DOMOperations` has been deprecated in favor of `CableReady.operations`
* Custom operations can access standardized `before`, `operate` and `after` methods
* New `cable_car` mode provides access to operation composition from anywhere, paving the way for using CableReady via Ajax actions, Turbo Frames etc
* New `stream_from` helper makes streaming from arbitrary components easier than ever
* Load-time sanity checker module provides early warning of gem/npm version issues
* Load-time check for new CableReady releases
* `dom_id` method upgraded to handle ActiveRecord Models and Relations
* Operations now accept an optional CSS selector as first parameter
* `selector` option now accepts ActiveRecord Models and Relations
* Operations now accept an optional `delay` option in `ms`, allowing staggering
* `cable_ready:channel` generator creates channel class and client consumer
* Channels now support `broadcast_later` and `broadcast_later_to`
* Chained operations now remember the selector from the previous operation
* Channels and `cable_car` now have `to_json` and `apply!` serialization methods
* `ApplicationController::Renderers` has new `operations` renderer

## v4.5.0

CableReady v4.5.0 has eight [new operations](reference/operations/): `append`, `graft`, `prepend`, `replace`, `replace_state`, `play_sound`, `go` and `scroll_into_view`

