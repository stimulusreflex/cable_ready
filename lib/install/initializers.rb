# frozen_string_literal: true

require "cable_ready/installer"

cr_initializer_src = CableReady::Installer.fetch("/", "config/initializers/cable_ready.rb")
cr_initializer_path = Rails.root.join("config/initializers/cable_ready.rb")

if !cr_initializer_path.exist?
  copy_file(cr_initializer_src, cr_initializer_path, verbose: false)
  say "✅ CableReady initializer created at config/initializers/cable_ready.rb"
else
  say "⏩ config/initializers/cable_ready.rb already exists. Skipping."
end

CableReady::Installer.complete_step :initializers
