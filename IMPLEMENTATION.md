# CableReady Language Implementation Project

We believe that CableReady can become the universal standard tool for developers to dynamically control client browsers from the server. While the project has roots in the Ruby on Rails community, the JS client is unopinionated about how the simple JSON structure that it consumes was created.

We would like to announce support for Python, Go, C#, Java, PHP and NodeJS server libraries in early 2022. While there's a broad set of features a server library could implement, there's a baseline that we'd like to make sure all implementations can offer.

## Background

CableReady was started in 2017 by Nate Hopkins. It predates LiveView and the HTML-on-the-wire trend by 18 months. It sees roughly 15,000 downloads per week and offers 36 different [operations](https://cableready.stimulusreflex.com/v/v5/reference/operations).

CableReady is currently a client-side JS module and a server-side Ruby module.

## Key concepts

- available everywhere
- multiple operations per payload
- schemaless
- simple JSON wire format
- method chaining
- transport agnostic
- extensible via custom operations

### Available everywhere

Rails developers can access a `cable_ready` singleton from just about anywhere in their application, and we believe it's a big part of the secret sauce. While every language and framework has their own idioms, we encourage implementors to remove barriers and make it easy to call CableReady anywhere it could be useful.

https://cableready.stimulusreflex.com/v/v5/cableready-everywhere

### Operations and their options

Operations are the basic atomic unit of activity in CableReady. Each operation typically has a very specific focus and often mimics the DOM JS spec for the activity in question. Operations have options passed to them which specify their exact behavior.

Multiple operations can be prepared together. They will be executed in the order that they were created. Different operation types can be mixed together in one payload.

The Ruby implementation offers two interfaces; the (original) primary mechanism delivers the operations to a WebSocket channel in what we refer to as a "broadcast". The other - known as "cable car" - returns a JSON string that can be sent, persisted or displayed for any purpose.

### Schemaless

CableReady operations each have their own mandatory and optional options, along with options that are provided to every operation by the library. However, arbitrary additional options can be passed to an operation and they will be passed to the client. This makes it easy for CableReady to form the basis of much larger projects, such as StimulusReflex.

### JSON wire format

As of v5.0, the CableReady JSON wire format is an array of objects, where each object represents one operation. It's intentionally very simple.

```json
[{\"message\":\"Hello!\",\"operation\":\"consoleLog\"}]
```

Each operation has **camelCased** key/value pairs that convey options. Every operation must have an `operation` value, or the client will raise an exception.

### Method chaining

Developer experience is a high priority. We take pride in the readability and expressiveness offered by our server API. The basic pseudocode structure we provide looks like:

```rb
cable_ready[:foo].operation(options).broadcast
```

In other words, the first method `cable_ready` starts a method chain by returning `self`, and then each operation is a method that also returns the chain started by the initial method. In this way, you can chain together as many operations as you like. Finally, we have a `broadcast` method which takes the current chain and broadcasts it via WebSockets to the `:foo` channel.

We also have our "cable car" interface which emits JSON when `to_json` is called. This makes it perfect for responding to Ajax fetch requests:

```rb
cable_car.operation(options).to_json
```

The `cable_car` might be assembled in steps, perhaps via a control loop:

```rb
inspiration = cable_car.console_log(message: "Hello there!").dispatch_event(name: "fred", detail: {inspiring: true})
3.times do |i|
  inspiration.console_log(message: "Still here: #{i}")
end
inspiration.to_json
```

The main expectation that should hold between languages is that you will start the chain with a command, add one or many operation methods, and then execute the chain.

### Transport agnostic

CableReady started its life as a WebSocket library, but the neutral JSON format has potential far beyond just WebSocket usage. We now frequently return CableReady JSON payloads via Ajax as well. There's nothing stopping you from embedding payloads into a DOM element attribute, for example.

We believe that a minimally viable CableReady server library must be able to produce compatible JSON. There's no hard requirement that it interface with WebSockets, although we do find this to be a major sweet spot and will do our best to provide support.

### Custom operations

While CableReady ships with an impressive number of operations out of the box, users should be able to add their own operations. Admittedly, the method used to dynamically create all of the methods for each operation is the [most sophisticated](https://github.com/stimulusreflex/cable_ready/blob/master/lib/cable_ready/operation_builder.rb) one in our framework, but again, we're here to help.

https://cableready.stimulusreflex.com/v/v5/customization#custom-operations

# Get involved!

We have a wonderful community with over 1600 folks on our Discord server, helping people get started. Come join https://discord.gg/stimulus-reflex and drop by the #cable_ready channel with any questions.