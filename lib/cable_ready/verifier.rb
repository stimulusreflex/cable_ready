##
# This code is taken from turbo-rails
# https://github.com/hotwired/turbo-rails/blob/cacc19666f075416976cafcb2ee8e58ff68fad0d/lib/turbo-rails.rb

module CableReady
  class Verifier
    class << self
      attr_writer :signed_stream_verifier_key

      def signed_stream_verifier
        @signed_stream_verifier ||= ActiveSupport::MessageVerifier.new(signed_stream_verifier_key, digest: "SHA256", serializer: JSON)
      end

      def signed_stream_verifier_key
        @signed_stream_verifier_key ||= Rails.application.key_generator.generate_key("cable_ready/signed_stream_verifier_key")
      end
    end
  end
end
