# frozen_string_literal: true

class CableReady::ChannelGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  class_option :stream_from, type: :string
  class_option :stream_for, type: :string
  class_option :stimulus, type: :boolean

  def check_options
    raise "Can't specify --stream-from and --stream-for at the same time" if options.key?(:stream_from) && options.key?(:stream_for)
  end

  def create_channel
    generate "channel", file_name
  end

  def enhance_channels
    if using_broadcast_to?
      gsub_file "app/channels/#{file_name}_channel.rb", /# stream_from.*\n/, "stream_for #{resource}.find(params[:id])\n"
      template "app/javascript/controllers/%file_name%_controller.js" if using_stimulus?
    else
      prepend_to_file "app/javascript/channels/#{file_name}_channel.js", "import CableReady from 'cable_ready'\n"
      inject_into_file "app/javascript/channels/#{file_name}_channel.js", after: "// Called when there's incoming data on the websocket for this channel\n" do
        <<-JS
    if (data.cableReady) CableReady.perform(data.operations)
        JS
      end

      gsub_file "app/channels/#{file_name}_channel.rb", /# stream_from.*\n/, "stream_from \"#{identifier}\"\n"
    end
  end

  private

  def option_given?
    options.key?(:stream_from) || options.key?(:stream_for)
  end

  def using_broadcast_to?
    @using_broadcast_to ||= option_given? ? options.key?(:stream_for) : yes?("Are you streaming to a resource using broadcast_to? (y/N)")
  end

  def using_stimulus?
    @using_stimulus ||= options.fetch(:stimulus) {
      yes?("Are you going to use a Stimulus controller to subscribe to this channel? (y/N)")
    }
  end

  def resource
    return @resource if @resource

    stream_for = options.fetch(:stream_for) {
      ask("Which resource are you streaming for?", default: class_name)
    }

    stream_for = file_name if stream_for == "stream_for"
    @resource = stream_for.camelize
  end

  def identifier
    return @identifier if @identifier

    stream_from = options.fetch(:stream_from) {
      ask("What is the stream identifier that goes into stream_from?", default: file_name)
    }

    stream_from = file_name if stream_from == "stream_from"
    @identifier = stream_from.underscore
  end
end
