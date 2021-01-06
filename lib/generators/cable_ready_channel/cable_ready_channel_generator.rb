class CableReadyChannelGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  def create_channel
    generate "channel", name

    identifier = ask("What is your stream identifier (what goes into stream_from)?")

    prepend_to_file "app/javascript/channels/#{file_name}_channel.js", "import CableReady from 'cable_ready'\n"
    inject_into_file "app/javascript/channels/#{file_name}_channel.js", after: "// Called when there's incoming data on the websocket for this channel\n" do <<-JS
    if (data.cableReady) CableReady.perform(data.operations)
    JS
    end

    gsub_file "app/channels/#{file_name}_channel.rb", %r{# stream_from.*\n}, "stream_from \"#{identifier}\"\n"
  end
end
