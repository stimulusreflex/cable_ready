def run_install_template(template)
  system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{File.expand_path("../install/#{template}.rb", __dir__)}"
end

def check_cable_and_redis
  run_install_template("check_cable_and_redis")
end

namespace :cable_ready do
  desc "Install CableReady into the app"
  task :install do
    if Rails.root.join("config/importmap.rb").exist?
      Rake::Task["cable_ready:install:importmap"].invoke
    elsif Rails.root.join("package.json").exist?
      Rake::Task["cable_ready:install:node"].invoke
    else
      puts "You must either be running with node (package.json) or importmap-rails (config/importmap.rb) to use this gem."
    end
  end

  namespace :install do
    desc "Install CableReady into the app with asset pipeline"
    task :importmap do
      check_cable_and_redis
      run_install_template("cable_ready_with_importmap")
      run_install_template("cable_ready_entrypoint")
    end

    desc "Install CableReady into the app with node"
    task :node do
      check_cable_and_redis
      run_install_template("cable_ready_with_node")
      run_install_template("cable_ready_entrypoint")
    end
  end
end
