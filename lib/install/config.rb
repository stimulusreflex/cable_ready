# frozen_string_literal: true

require "cable_ready/installer"

return if pack_path_missing?

step_path = "/app/javascript/config/"
index_src = fetch(step_path, "index.js.tt")
index_path = config_path / "index.js"
cable_ready_src = fetch(step_path, "cable_ready.js.tt")
cable_ready_path = config_path / "cable_ready.js"

empty_directory config_path unless config_path.exist?

copy_file(index_src, index_path) unless index_path.exist?

index_pattern = /import ['"](\.\.\/|\.\/)?config['"]/
index_commented_pattern = /\s*\/\/\s*#{index_pattern}/
index_import = "import \"#{prefix}config\"\n"

if pack.match?(index_pattern)
  if pack.match?(index_commented_pattern)
    lines = pack_path.readlines
    matches = lines.select { |line| line =~ index_commented_pattern }
    lines[lines.index(matches.last).to_i] = index_import
    pack_path.write lines.join
  end
else
  lines = pack_path.readlines
  matches = lines.select { |line| line =~ /^import / }
  lines.insert lines.index(matches.last).to_i + 1, index_import
  pack_path.write lines.join
end
say "✅ CableReady configs will be imported in #{friendly_pack_path}"

# create entrypoint/config/cable_ready.js and make sure it's imported in application.js
copy_file(cable_ready_src, cable_ready_path) unless cable_ready_path.exist?

complete_step :config
