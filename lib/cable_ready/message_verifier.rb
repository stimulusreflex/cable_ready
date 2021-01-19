# frozen_string_literal: true

module CableReady
  module MessageVerifier
    # Memoizes a CableReady scoped ActiveSupport::MessageVerifier
    #
    # @return [ActiveSupport::MessageVerifier] a CableReady scoped MessageVerifier
    def self.message_verifier
      @message_verifier ||= Rails.application.message_verifier("cable_ready")
    end
  end
end
