# frozen_string_literal: true

module CableReady
  module StreamIdentifier
    def verified_stream_identifier(signed_stream_identifier)
      CableReady.signed_stream_verifier.verified signed_stream_identifier
    end

    def signed_stream_identifier(compoundable)
      CableReady.signed_stream_verifier.generate compoundable
    end
  end
end
