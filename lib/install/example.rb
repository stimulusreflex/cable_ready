# frozen_string_literal: true

require "cable_ready/installer"

proceed = false

if !Rails.root.join("app/controllers/examples_controller.rb").exist?
  puts

  proceed = if options.key? "example"
    options["example"]
  else
    !no?("✨ Generate an example page with a quick demo? You can remove it later with a single commend. (Y/n)")
  end
end

if proceed
  generate("cable_ready:example")
end

complete_step :example
