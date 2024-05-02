# frozen_string_literal: true

require "cable_ready/installer"

return if CableReady::Installer.pack_path_missing?

mrujs_path = CableReady::Installer.config_path / "mrujs.js"

proceed = false

if !File.exist?(mrujs_path)
  proceed = if CableReady::Installer.options.key? "mrujs"
    CableReady::Installer.options["mrujs"]
  else
    !no?("✨ Would you like to install and enable mrujs? It's a modern, drop-in replacement for rails-ujs (Y/n)")
  end
end

if proceed
  if CableReady::Installer.bundler == "importmap"

    if !CableReady::Installer.importmap_path.exist?
      CableReady::Installer.halt "#{friendly_CableReady::Installer.importmap_path} is missing. You need a valid importmap config file to proceed."
      return
    end

    importmap = CableReady::Installer.importmap_path.read

    if !importmap.include?("pin \"mrujs\"")
      append_file(CableReady::Installer.importmap_path, <<~RUBY, verbose: false)
        pin "mrujs", to: "https://ga.jspm.io/npm:mrujs@0.10.1/dist/index.module.js"
      RUBY
      say "✅ pin mrujs"
    end

    if !importmap.include?("pin \"mrujs/plugins\"")
      append_file(CableReady::Installer.importmap_path, <<~RUBY, verbose: false)
        pin "mrujs/plugins", to: "https://ga.jspm.io/npm:mrujs@0.10.1/plugins/dist/plugins.module.js"
      RUBY
      say "✅ pin mrujs plugins"
    end
  else
    # queue mrujs for installation
    if !CableReady::Installer.package_json.read.include?('"mrujs":')
      CableReady::Installer.add_package "mrujs@^0.10.1"
    end

    # queue @rails/ujs for removal
    if CableReady::Installer.package_json.read.include?('"@rails/ujs":')
      CableReady::Installer.drop_package "@rails/ujs"
    end
  end

  step_path = "/app/javascript/config/"
  mrujs_src = CableReady::Installer.fetch(step_path, "mrujs.js.tt")

  # create entrypoint/config/mrujs.js if necessary
  copy_file(mrujs_src, mrujs_path) unless mrujs_path.exist?

  # import mrujs config in entrypoint/config/index.js
  index_path = CableReady::Installer.config_path / "index.js"
  index = index_path.read
  friendly_index_path = index_path.relative_path_from(Rails.root).to_s
  mrujs_pattern = /import ['"].\/mrujs['"]/
  mrujs_import = "import '.\/mrujs'\n" # standard:disable Style/RedundantStringEscape

  if !index.match?(mrujs_pattern)
    append_file(index_path, mrujs_import, verbose: false)
  end
  say "✅ mrujs imported in #{friendly_index_path}"

  # remove @rails/ujs from application.js
  rails_ujs_pattern = /import Rails from ['"]@rails\/ujs['"]/

  lines = CableReady::Installer.pack_path.readlines
  if lines.index { |line| line =~ rails_ujs_pattern }
    gsub_file pack_path, rails_ujs_pattern, "", verbose: false
    say "✅ @rails/ujs removed from #{CableReady::Installer.friendly_pack_path}"
  end

  # set Action View to generate remote forms when using form_with
  application_path = Rails.root.join("config/application.rb")
  application_pattern = /^[^#]*config\.action_view\.form_with_generates_remote_forms = true/
  defaults_pattern = /config\.load_defaults \d\.\d/

  lines = application_path.readlines
  CableReady::Installer.backup(application_path) do
    if !lines.index { |line| line =~ application_pattern }
      if (index = lines.index { |line| line =~ /^[^#]*#{defaults_pattern}/ })
        gsub_file application_path, /\s*#{defaults_pattern}\n/, verbose: false do
          <<-RUBY
  \n#{lines[index]}
      # form_with helper will generate remote forms by default (mrujs)
      config.action_view.form_with_generates_remote_forms = true
          RUBY
        end
      else
        insert_into_file application_path, after: "class Application < Rails::Application" do
          <<-RUBY

      # form_with helper will generate remote forms by default (mrujs)
      config.action_view.form_with_generates_remote_forms = true
          RUBY
        end
      end
    end
    say "✅ form_with_generates_remote_forms set to true in config/application.rb"
  end

  # remove turbolinks from Gemfile because it's incompatible with mrujs (and unnecessary)
  turbolinks_pattern = /^[^#]*gem ["']turbolinks["']/

  lines = CableReady::Installer.gemfile_path.readlines
  if lines.index { |line| line =~ turbolinks_pattern }
    CableReady::Installer.remove_gem :turbolinks
  else
    say "✅ turbolinks is not present in Gemfile"
  end
end

CableReady::Installer.complete_step :mrujs
