# frozen_string_literal: true

class CableReady::ChannelGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  class_option :stimulus, type: :boolean
  class_option :broadcast_to, type: :boolean
  class_option :resource, type: :string
  class_option :identifier, type: :string

  def create_channel
    generate "channel", file_name

    if using_broadcast_to?
      resource = ask_for_resource
      resource_name = resource.underscore

      gsub_file "app/channels/#{file_name}_channel.rb", %r{# stream_from.*\n}, "stream_for #{resource}.find(params[:id])\n"

      if using_stimulus?
        template "app/javascript/controllers/%file_name%_controller.js"
      end
    else
      identifier = ask_for_identifier

      prepend_to_file "app/javascript/channels/#{file_name}_channel.js", "import CableReady from 'cable_ready'\n"
      inject_into_file "app/javascript/channels/#{file_name}_channel.js", after: "// Called when there's incoming data on the websocket for this channel\n" do
        <<-JS
    if (data.cableReady) CableReady.perform(data.operations)
        JS
      end

      gsub_file "app/channels/#{file_name}_channel.rb", %r{# stream_from.*\n}, "stream_from \"#{identifier}\"\n"
    end
  end

  private

  def using_broadcast_to?
    @using_broadcast_to ||= options.fetch(:broadcast_to) {
      yes?("Are you streaming to a resource using broadcast_to? (y/N)")
    }
  end

  def using_stimulus?
    @using_stimulus ||= options.fetch(:stimulus) {
      yes?("Are you going to use a Stimulus controller to subscribe to this channel? (y/N)")
    }
  end

  def ask_for_resource
    @resource ||= options.fetch(:resource).camelize {
      ask("Which resource are you streaming to?", default: class_name).camelize
    }
  end

  def ask_for_identifier
    @identifier ||= options.fetch(:identifier).underscore {
      ask("What is the stream identifier that goes into stream_from?", default: file_name).underscore
    }
  end
end
