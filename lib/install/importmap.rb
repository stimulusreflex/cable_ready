# frozen_string_literal: true

require "cable_ready/installer"

return if pack_path_missing?

if !importmap_path.exist?
  halt "#{friendly_importmap_path} is missing. You need a valid importmap config file to proceed."
  return
end

importmap = importmap_path.read

backup(importmap_path) do
  if !importmap.include?("pin_all_from \"#{entrypoint}/controllers\"")
    append_file(importmap_path, <<~RUBY, verbose: false)
      pin_all_from "#{entrypoint}/controllers", under: "controllers"
    RUBY
    say "✅ pin controllers folder"
  end

  if !importmap.include?("pin_all_from \"#{entrypoint}/channels\"")
    append_file(importmap_path, <<~RUBY, verbose: false)
      pin_all_from "#{entrypoint}/channels", under: "channels"
    RUBY
    say "✅ pin channels folder"
  end

  if !importmap.include?("pin_all_from \"#{entrypoint}/config\"")
    append_file(importmap_path, <<~RUBY, verbose: false)
      pin_all_from "#{entrypoint}/config", under: "config"
    RUBY
    say "✅ pin config folder"
  end

  if !importmap.include?("pin \"@rails/actioncable\"")
    append_file(importmap_path, <<~RUBY, verbose: false)
      pin "@rails/actioncable", to: "actioncable.esm.js", preload: true
    RUBY
    say "✅ pin Action Cable"
  end

  if !importmap.include?("pin \"cable_ready\"")
    append_file(importmap_path, <<~RUBY, verbose: false)
      pin "cable_ready", to: "cable_ready.js", preload: true
    RUBY
    say "✅ pin CableReady"
  end

  if !importmap.include?("pin \"morphdom\"")
    append_file(importmap_path, <<~RUBY, verbose: false)
      pin "morphdom", to: "https://ga.jspm.io/npm:morphdom@2.6.1/dist/morphdom.js", preload: true
    RUBY
    say "✅ pin morphdom"
  end
end

application_js_src = fetch("/", "app/javascript/controllers/application.js.tt")
application_js_path = controllers_path / "application.js"
index_src = fetch("/", "app/javascript/controllers/index.js.importmap.tt")
index_path = controllers_path / "index.js"

# create entrypoint/controllers, as well as the index, application and application_controller
empty_directory controllers_path unless controllers_path.exist?

# configure Stimulus application superclass to import Action Cable consumer
backup(application_js_path) do
  if application_js_path.exist?
    friendly_application_js_path = application_js_path.relative_path_from(Rails.root).to_s
    if application_js_path.read.include?("import consumer")
      say "✅ #{friendly_application_js_path} is present"
    else
      inject_into_file application_js_path, "import consumer from \"../channels/consumer\"\n", after: "import { Application } from \"@hotwired/stimulus\"\n", verbose: false
      inject_into_file application_js_path, "application.consumer = consumer\n", after: "application.debug = false\n", verbose: false
      say "✅ #{friendly_application_js_path} has been updated to import the Action Cable consumer"
    end
  else
    copy_file(application_js_src, application_js_path)
  end
end

if index_path.exist?
  friendly_index_path = index_path.relative_path_from(Rails.root).to_s
  if index_path.read == index_src.read
    say "✅ #{friendly_index_path} is present"
  else
    backup(index_path, delete: true) do
      copy_file(index_src, index_path, verbose: false)
    end
    say "✅ #{friendly_index_path} has been created"
  end
else
  copy_file(index_src, index_path)
end

complete_step :importmap
