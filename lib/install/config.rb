# frozen_string_literal: true

require "cable_ready/installer"

return if CableReady::Installer.pack_path_missing?

step_path = "/app/javascript/config/"
index_src = CableReady::Installer.fetch(step_path, "index.js.tt")
index_path = CableReady::Installer.config_path / "index.js"
cable_ready_src = CableReady::Installer.fetch(step_path, "cable_ready.js.tt")
cable_ready_path = CableReady::Installer.config_path / "cable_ready.js"

empty_directory CableReady::Installer.config_path unless CableReady::Installer.config_path.exist?

CableReady::Installer.copy_file(index_src, index_path) unless index_path.exist?

index_pattern = /import ['"](\.\.\/|\.\/)?config['"]/
index_commented_pattern = /\s*\/\/\s*#{index_pattern}/
index_import = "import \"#{CableReady::Installer.prefix}config\"\n"

if CableReady::Installer.pack.match?(index_pattern)
  if CableReady::Installer.pack.match?(index_commented_pattern)
    lines = CableReady::Installer.pack_path.readlines
    matches = lines.select { |line| line =~ index_commented_pattern }
    lines[lines.index(matches.last).to_i] = index_import
    CableReady::Installer.pack_path.write lines.join
  end
else
  lines = CableReady::Installer.pack_path.readlines
  matches = lines.select { |line| line =~ /^import / }
  lines.insert lines.index(matches.last).to_i + 1, index_import
  CableReady::Installer.pack_path.write lines.join
end
say "✅ CableReady configs will be imported in #{CableReady::Installer.friendly_pack_path}"

# create entrypoint/config/cable_ready.js and make sure it's imported in application.js
CableReady::Installer.copy_file(cable_ready_src, cable_ready_path) unless cable_ready_path.exist?

CableReady::Installer.complete_step :config
