# frozen_string_literal: true

require "rails/generators/rails/resource/resource_generator"
require "rake"

class CableReady::ScaffoldGenerator < Rails::Generators::ResourceGenerator
  include Rails::Generators::ResourceHelpers

  source_root File.expand_path("templates", __dir__)
  remove_hook_for :resource_controller
  remove_class_option :actions

  check_class_collision suffix: "Controller"

  class_option :skip_system_tests, type: :boolean, default: false, desc: "Skip system test files"

  def create_controller_files
    template "controller.rb",
      File.join("app/controllers", controller_class_path, "#{controller_file_name}_controller.rb")
  end

  def create_view_root
    empty_directory File.join("app/views", controller_file_path)
  end

  # TODO: ERB only for now, add alternate template engine support
  def copy_view_files
    available_views.each do |view|
      target_view = if view == "_resource"
        "_#{controller_file_path.singularize}"
      else
        view
      end

      source_filename = File.join("erb", (view + ".html.erb"))
      target_filename = target_view + ".html.erb"
      template source_filename, File.join("app/views", controller_file_path, target_filename)
    end
  end

  def install_scripts
    if defined?(Webpacker)
      main_folder = Webpacker.config.source_path.to_s.gsub("#{Rails.root}/", "")
      unless File.exist? File.join("app", "javascript", "controllers")
        say "Adding Stimulus"
        system "bin/rake webpacker:install:stimulus"
      end
    else
      main_folder = File.join("app", "assets", "javascripts")
      # TODO: automate?
      say "Please be sure Stimulus is installed. See https://github.com/hotwired/stimulus-rails"
    end

    filepath = [
      "#{main_folder}/packs/application.js",
      "#{main_folder}/packs/application.ts"
    ]
      .select { |path| File.exist?(path) }
      .map { |path| Rails.root.join(path) }
      .first

    lines = File.open(filepath, "r") { |f| f.readlines }

    unless lines.find { |line| line.start_with?("import Rails") }
      say "Adding @rails/ujs via yarn"
      system "bin/yarn add @rails/ujs"
      append_file filepath, "\nimport Rails from '@rails/ujs'\nRails.start()\n"
    end

    template "cable_car_controller.js", File.join(main_folder, "controllers", "cable_car_controller.js")
  end

  def create_test_files
    unless options[:skip_system_tests]
      template "system_test.rb", File.join("test/system", class_path, "#{file_name.pluralize}_test.rb")
    end
  end

  private

  def available_views
    %w[index show _form _resource]
  end

  def permitted_params
    attachments, others = attributes_names.partition { |name| attachments?(name) }
    params = others.map { |name| ":#{name}" }
    params += attachments.map { |name| "#{name}: []" }
    params.join(", ")
  end

  def attachments?(name)
    attribute = attributes.find { |attr| attr.name == name }
    attribute&.attachments?
  end

  # For system tests
  def attributes_hash
    return {} if attributes_names.empty?

    attributes_names.map do |name|
      if %w[password password_confirmation].include?(name) && attributes.any?(&:password_digest?)
        [name.to_s, "'secret'"]
      elsif !virtual?(name)
        [name.to_s, "@#{singular_table_name}.#{name}"]
      end
    end.compact.sort.to_h
  end

  def boolean?(name)
    attribute = attributes.find { |attr| attr.name == name }
    attribute&.type == :boolean
  end

  def virtual?(name)
    attribute = attributes.find { |attr| attr.name == name }
    attribute&.virtual?
  end

  def fixture_name
    @fixture_name ||=
      if mountable_engine?
        (namespace_dirs + [table_name]).join("_")
      else
        table_name
      end
  end
end
