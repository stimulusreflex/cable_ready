module CableReady
  class InstallerHelper
    def self.type
      if Rails.root.join("config/importmap.rb").exist?
        :importmap
      elsif Rails.root.join("package.json").exist?
        if Rails.root.join("config/webpacker.yml").exist? || Rails.root.join("config/webpacker.yaml").exist?
          :webpack
        else
          :esbuild
        end
      end
    end

    def self.importmap?
      type == :importmap
    end

    def self.esbuild?
      type == :esbuild
    end

    def self.webpack?
      type == :webpack
    end

    def self.javascript_path
      defined?(Webpacker) ? Webpacker.config.source_path.to_s.gsub("#{Rails.root}/", "") : "app/javascript"
    end

    def self.cable_ready_gem_version
      CableReady::VERSION.gsub(".pre", "-pre")
    end
  end
end
