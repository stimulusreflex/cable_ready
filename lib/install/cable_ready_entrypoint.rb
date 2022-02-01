if (js_entrypoint_path = Rails.root.join("app/javascript/application.js")).exist?
  entrypoint_content = File.read(js_entrypoint_path)

  say "Import CableReady"
  append_to_file js_entrypoint_path, %(import CableReady from "cable_ready"\n)

  say "Initializing CableReady with ActionCable consumer"

  # Check if there's a channels file, i.e. we're in a webpacker or esbuild setup
  if Rails.root.join("app/javascript/channels/index.js").exist?
    unless entrypoint_content.match?(/import consumer/)
      append_to_file js_entrypoint_path, %(import consumer from "./channels/consumer"\n)
    end

    append_to_file js_entrypoint_path, %(CableReady.initialize({ consumer })\n)

  # else we could use the cable.consumer from turbo-rails, if present
  elsif entrypoint_content.match?(/import.*@hotwired\/turbo-rails/)
    unless entrypoint_content.match?(/import.*cable.*@hotwired\/turbo-rails/)
      append_to_file js_entrypoint_path, %(import { cable } from "@hotwired\/turbo-rails"\n)
    end

    append_to_file js_entrypoint_path, <<~JS
      (async () => {
        const consumer = await cable.getConsumer()
        CableReady.initialize({ consumer });
      })()
    JS

  # else remind the user to initialize CableReady
  else
    say "Please initialize CableReady in #{js_entrypoint_path} with an ActionCable consumer.", :red
  end
else
  say "You must import and initialize cable_ready in your JavaScript entrypoint file", :red
end
