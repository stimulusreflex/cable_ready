# frozen_string_literal: true

class CableReady::ChannelGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  class_option :stream_from, type: :string
  class_option :stream_for, type: :string
  class_option :stimulus, type: :boolean

  def destroy_not_supported
    if behavior == :revoke
      puts "Sorry, we don't support destroying generated channels.\nDelete the Action Cable channel class, as well as any corresponding JavaScript classes."
      exit
    end
  end

  def check_options
    if options.key?(:stream_from) && options.key?(:stream_for)
      puts "Can't specify --stream-from and --stream-for at the same time"
      exit
    end
  end

  def create_channel
    generate "channel", file_name, "--skip"
  end

  def enhance_channels
    @entrypoint = [
      "app/javascript",
      "app/frontend"
    ].find { |path| File.exist?(Rails.root.join(path)) } || "app/javascript"
    puts "Where do JavaScript files live in your app? Our best guess is: \e[1m#{@entrypoint}\e[22m 🤔"
    puts "Press enter to accept this, or type a different path."
    print "> "
    input = Rails.env.test? ? "tmp/app/javascript" : $stdin.gets.chomp
    @entrypoint = input unless input.blank?
    @js_channel = "#{@entrypoint}/channels/#{file_name}_channel.js"

    if using_broadcast_to?
      if using_stimulus?
        template("#{@entrypoint}/controllers/%file_name%_controller.js")
        Rails.root.join(@js_channel).delete
      else
        gsub_file "app/channels/#{file_name}_channel.rb", /# stream_from.*\n/, "stream_for #{resource}.find(params[:id])\n", verbose: false
        gsub_file @js_channel, /"#{resource}Channel"/, verbose: false do
          <<-JS

  {
    channel: "#{resource}Channel",
    id: 1
  }
          JS
        end
        doctor_javascript_channel_class
        puts "\nDon't forget to update the id in the channel subscription: #{@js_channel}\nIt's currently set to 1; you'll want to change that to a dynamic value based on something in your DOM."
      end
    else
      gsub_file "app/channels/#{file_name}_channel.rb", /# stream_from.*\n/, "stream_from \"#{identifier}\"\n", verbose: false
      doctor_javascript_channel_class
    end
  end

  private

  def doctor_javascript_channel_class
    prepend_to_file @js_channel, "import CableReady from 'cable_ready'\n", verbose: false
    inject_into_file @js_channel, after: "// Called when there's incoming data on the websocket for this channel\n", verbose: false do
      <<-JS
    if (data.cableReady) CableReady.perform(data.operations)
      JS
    end
  end

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
