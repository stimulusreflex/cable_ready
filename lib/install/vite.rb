# frozen_string_literal: true

require "cable_ready/installer"

return if CableReady::Installer.pack_path_missing?

# verify that all critical dependencies are up to date; if not, queue for later
lines = CableReady::Installer.package_json.readlines
if !lines.index { |line| line =~ /^\s*["']@hotwired\/stimulus["']:/ }
  CableReady::Installer.add_package "@hotwired/stimulus@^3.2"
else
  say "⏩ @hotwired/stimulus npm package is already present. Skipping."
end

if !lines.index { |line| line =~ /^\s*["']stimulus-vite-helpers["']: ["']\^3["']/ }
  CableReady::Installer.add_package "stimulus-vite-helpers@^3"
else
  say "⏩ @stimulus-vite-helpers npm package is already present. Skipping."
end

step_path = "/app/javascript/controllers/"
application_js_src = CableReady::Installer.fetch(step_path, "application.js.tt")
application_js_path = CableReady::Installer.controllers_path / "application.js"
index_src = CableReady::Installer.fetch(step_path, "index.js.vite.tt")
index_path = CableReady::Installer.controllers_path / "index.js"

# create entrypoint/controllers, as well as the index, application and application_controller
empty_directory CableReady::Installer.controllers_path unless CableReady::Installer.controllers_path.exist?

copy_file(application_js_src, application_js_path) unless application_js_path.exist?
copy_file(index_src, index_path) unless index_path.exist?

controllers_pattern = /import ['"](\.\.\/)?controllers['"]/
controllers_commented_pattern = /\s*\/\/\s*#{controllers_pattern}/
prefix = "..\/" # standard:disable Style/RedundantStringEscape

if CableReady::Installer.pack.match?(controllers_pattern)
  if CableReady::Installer.pack.match?(controllers_commented_pattern)
    proceed = if CableReady::Installer.options.key? "uncomment"
      CableReady::Installer.options["uncomment"]
    else
      !no?("✨ Do you want to import your Stimulus controllers in application.js? (Y/n)")
    end

    if proceed
      # uncomment_lines only works with Ruby comments 🙄
      lines = CableReady::Installer.pack_path.readlines
      matches = lines.select { |line| line =~ controllers_commented_pattern }
      lines[lines.index(matches.last).to_i] = "import \"#{prefix}controllers\"\n"
      CableReady::Installer.pack_path.write lines.join
      say "✅ Stimulus controllers imported in #{CableReady::Installer.friendly_pack_path}"
    else
      say "🤷 your Stimulus controllers are not being imported in your application.js. We trust that you have a reason for this."
    end
  else
    say "✅ Stimulus controllers imported in #{CableReady::Installer.friendly_pack_path}"
  end
else
  lines = CableReady::Installer.pack_path.readlines
  matches = lines.select { |line| line =~ /^import / }
  lines.insert lines.index(matches.last).to_i + 1, "import \"#{prefix}controllers\"\n"
  CableReady::Installer.pack_path.write lines.join
  say "✅ Stimulus controllers imported in #{CableReady::Installer.friendly_pack_path}"
end

CableReady::Installer.complete_step :vite
