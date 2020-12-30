##
# This code is taken from turbo-rails
# https://github.com/hotwired/turbo-rails/blob/cacc19666f075416976cafcb2ee8e58ff68fad0d/app/channels/turbo/streams/stream_name.rb

module CableReady
  module StreamName
    def verified_stream_name(signed_stream_name)
      Verifier.signed_stream_verifier.verified signed_stream_name
    end

    def signed_stream_name(streamables)
      Verifier.signed_stream_verifier.generate stream_name_from(streamables)
    end

    private

    def stream_name_from(streamables)
      if streamables.is_a?(Array)
        streamables.map { |streamable| stream_name_from(streamable) }.join(":")
      else
        streamables.then { |streamable| streamable.try(:to_gid_param) || streamable.to_param }
      end
    end
  end
end
