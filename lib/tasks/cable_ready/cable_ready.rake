include Rails.application.routes.url_helpers

CR_STEPS = {
  "action_cable" => "Action Cable",
  "webpacker" => "Webpacker",
  "npm_packages" => "CableReady npm package",
  "importmap" => "Import Maps",
  "esbuild" => "esbuild",
  "config" => "Client initialization",
  "initializers" => "CableReady initializer",
  "development" => "development environment configuration",
  "spring" => "Launch spring, ruiner of days, into the sun",
  "mrujs" => "Swap out UJS for mrujs",
  "example" => "Create an example page",
  "broadcaster" => "Make CableReady available to channels, controllers, jobs and models",
  "yarn" => "Resolve npm dependency changes",
  "bundle" => "Resolve gem dependency changes",
  "vite" => "Vite",
  "compression" => "Compress WebSockets traffic with gzip"
}

CR_FOOTGUNS = {
  "webpacker" => ["npm_packages", "webpacker", "config", "action_cable", "development", "initializers", "broadcaster", "example", "spring", "yarn", "bundle"],
  "esbuild" => ["npm_packages", "esbuild", "config", "action_cable", "development", "initializers", "broadcaster", "example", "spring", "yarn", "bundle"],
  "vite" => ["npm_packages", "vite", "config", "action_cable", "development", "initializers", "broadcaster", "example", "spring", "yarn", "bundle"],
  "shakapacker" => ["npm_packages", "shakapacker", "config", "action_cable", "development", "initializers", "broadcaster", "example", "spring", "yarn", "bundle"],
  "importmap" => ["config", "action_cable", "importmap", "development", "initializers", "broadcaster", "example", "spring", "bundle"]
}

def run_install_template(template, force: false, trace: false, timeout: 1)
  if Rails.root.join("tmp/cable_ready_installer/halt").exist?
    FileUtils.rm(Rails.root.join("tmp/cable_ready_installer/halt"))
    puts "CableReady installation halted. Please fix the issues above and try again."
    exit
  end
  if Rails.root.join("tmp/cable_ready_installer/#{template}").exist? && !force
    puts "👍 #{CR_STEPS[template]}"
    return
  end

  system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{File.expand_path("../../install/#{template}.rb", __dir__)} SKIP_SANITY_CHECK=true #{"--trace" if trace}"

  puts "#{icon} #{CR_STEPS[template]}" unless Rails.root.join("tmp/cable_ready_installer/halt").exist?
end

namespace :cable_ready do
  desc "✨ Install CableReady ✨"
  task :install do
    FileUtils.mkdir_p(Rails.root.join("tmp/cable_ready_installer/templates"))
    FileUtils.mkdir_p(Rails.root.join("tmp/cable_ready_installer/working"))
    install_complete = Rails.root.join("tmp/cable_ready_installer/complete")

    footgun = nil
    options = {}

    ARGV.each do |arg|
      # make sure we have a valid build tool specified, or proceed to automatic detection
      if ["webpacker", "esbuild", "vite", "shakapacker", "importmap"].include?(arg)
        footgun = arg
      else
        kv = arg.split("=")
        if kv.length == 2
          kv[1] = if kv[1] == "true"
            true
          else
            (kv[1] == "false") ? false : kv[1]
          end
          options[kv[0]] = kv[1]
        end
      end
    end

    options_path = Rails.root.join("tmp/cable_ready_installer/options")
    options.reverse_merge!({"timeout" => 1})
    options_path.write(options.to_yaml)

    if defined?(StimulusReflex)
      puts "✨ \e[38;5;220mStimulusReflex\e[0m is present in this project ✨"
      puts
      puts "CableReady will be installed with StimulusReflex. Just run: \e[38;5;231mrails stimulus_reflex:install\e[0m"
      puts
      puts "Get help on Discord: \e[4;97mhttps://discord.gg/stimulus-reflex\e[0m. \e[38;5;196mWe are here for you.\e[0m 💙"
      puts
      exit
    end

    if install_complete.exist?
      puts "✨ \e[38;5;220mCableReady\e[0m is already installed ✨"
      puts
      puts "To restart the installation process, run: \e[38;5;231mrails cable_ready:install:restart\e[0m"
      puts
      puts "To get started, check out \e[4;97mhttps://cableready.stimulusreflex.com/cableready-101\e[0m"
      puts "or get help on Discord: \e[4;97mhttps://discord.gg/stimulus-reflex\e[0m. \e[38;5;196mWe are here for you.\e[0m 💙"
      puts
      exit
    end

    # if there is an installation in progress, continue where we left off
    cached_entrypoint = Rails.root.join("tmp/cable_ready_installer/entrypoint")

    if cached_entrypoint.exist?
      entrypoint = File.read(cached_entrypoint)
      puts "✨ Resuming \e[38;5;220mCableReady\e[0m installation ✨"
      puts
      puts "If you have any setup issues, please consult \e[4;97mhttps://cableready.stimulusreflex.com/setup\e[0m"
      puts "or get help on Discord: \e[4;97mhttps://discord.gg/stimulus-reflex\e[0m. \e[38;5;196mWe are here for you.\e[0m 💙"
      puts
      puts "Resuming installation into \e[1m#{entrypoint}\e[22m"
      puts "Run \e[1;94mrails cable_ready:install:restart\e[0m to restart the installation process"
      puts
    else
      puts "✨ Installing \e[38;5;220mCableReady\e[0m ✨"
      puts
      puts "If you have any setup issues, please consult \e[4;97mhttps://cableready.stimulusreflex.com/setup\e[0m"
      puts "or get help on Discord: \e[4;97mhttps://discord.gg/stimulus-reflex\e[0m. \e[38;5;196mWe are here for you.\e[0m 💙"
      if Rails.root.join(".git").exist?
        puts
        puts "We recommend running \e[1;94mgit commit\e[0m before proceeding. A diff will be generated at the end."
      end

      if options.key? "entrypoint"
        entrypoint = options["entrypoint"]
      else
        entrypoint = [
          "app/javascript",
          "app/frontend"
        ].find { |path| File.exist?(Rails.root.join(path)) } || "app/javascript"

        puts
        puts "Where do JavaScript files live in your app? Our best guess is: \e[1m#{entrypoint}\e[22m 🤔"
        puts "Press enter to accept this, or type a different path."
        print "> "
        input = $stdin.gets.chomp
        entrypoint = input unless input.blank?
      end
      File.write(cached_entrypoint, entrypoint)
    end

    # verify their bundler before starting, unless they explicitly specified on CLI
    if !footgun
      # auto-detect build tool based on existing packages and configuration
      if Rails.root.join("config/importmap.rb").exist?
        footgun = "importmap"
      elsif Rails.root.join("package.json").exist?
        package_json = File.read(Rails.root.join("package.json"))
        footgun = "webpacker" if package_json.include?('"@rails/webpacker":')
        footgun = "esbuild" if package_json.include?('"esbuild":')
        footgun = "vite" if package_json.include?('"vite":')
        footgun = "shakapacker" if package_json.include?('"shakapacker":')
        if !footgun
          puts "❌ You must be using a node-based bundler such as esbuild, webpacker, vite or shakapacker (package.json) or importmap (config/importmap.rb) to use CableReady."
          exit
        end
      else
        puts "❌ You must be using a node-based bundler such as esbuild, webpacker, vite or shakapacker (package.json) or importmap (config/importmap.rb) to use CableReady."
        exit
      end

      puts
      puts "It looks like you're using \e[1m#{footgun}\e[22m as your bundler. Is that correct? (Y/n)"
      print "> "
      input = $stdin.gets.chomp
      if input.downcase == "n"
        puts
        puts "CableReady installation supports: esbuild, webpacker, vite, shakapacker and importmap."
        puts "Please run \e[1;94mrails cable_ready:install [bundler]\e[0m to install CableReady."
        exit
      end
    end

    File.write("tmp/cable_ready_installer/footgun", footgun)
    FileUtils.touch("tmp/cable_ready_installer/backups")
    File.write("tmp/cable_ready_installer/template_src", File.expand_path("../../generators/cable_ready/templates/", __dir__))

    # do the things
    CR_FOOTGUNS[footgun].each do |template|
      run_install_template(template, local: !!options["local"], trace: !!options["trace"], timeout: options["timeout"].to_i)
    end

    puts
    puts "🎉 \e[1;92mCableReady has been successfully installed!\e[22m 🎉"
    puts
    puts "👉 \e[4;97mhttps://cableready.stimulusreflex.com/cableready-101\e[0m"
    puts
    puts "Join over 2000 CableReady developers on Discord: \e[4;97mhttps://discord.gg/stimulus-reflex\e[0m"
    puts

    backups = File.readlines("tmp/cable_ready_installer/backups").map(&:chomp)

    if backups.any?
      puts "🙆  The following files were modified during installation:"
      puts
      backups.each { |backup| puts "  #{backup}" }
      puts
      puts "Each of these files has been backed up with a .bak extension. Please review the changes carefully."
      puts "If you're happy with the changes, you can delete the .bak files."
      puts
    end

    if Rails.root.join(".git").exist?
      system "git diff > tmp/cable_ready_installer.diff"
      puts "🏮 A diff of all changes has been saved to \e[1mtmp/cable_ready_installer.diff\e[22m"
      puts
    end

    if Rails.root.join("app/controllers/examples_controller.rb").exist?
      launch = Rails.root.join("bin/dev").exist? ? "bin/dev" : "rails s"
      puts "🚀 Launch \e[1;94m#{launch}\e[0m to access your example page at ⚡ \e[4;97mhttp://localhost:3000/example\e[0m ⚡"
      puts "Once you're finished with the example, you can remove it with \e[1;94mrails destroy cable_ready:example\e[0m"
      puts
    end

    FileUtils.touch(install_complete)
    `pkill -f spring` if Rails.root.join("tmp/cable_ready_installer/kill_spring").exist?
    exit
  end

  namespace :install do
    desc "Restart CableReady installation"
    task :restart do
      FileUtils.rm_rf Rails.root.join("tmp/cable_ready_installer")
      system "rails cable_ready:install #{ARGV.join(" ")}"
      exit
    end

    desc "Re-run specific CableReady install steps" unless defined?(StimulusReflex)
    task :step do
      def warning(step = nil)
        return if step.include?("=")
        if step
          puts "⚠️ #{step} is not a valid step. Valid steps are: #{CR_STEPS.keys.join(", ")}"
        else
          puts "❌ You must specify a step to re-run. Valid steps are: #{CR_STEPS.keys.join(", ")}"
          puts "Example: \e[1;94mrails cable_ready:install:step initializers\e[0m"
        end
      end

      warning if ARGV.empty?

      ARGV.each do |step|
        CR_STEPS.include?(step) ? run_install_template(step, force: true) : warning(step)
      end
      exit
    end
  end
end
