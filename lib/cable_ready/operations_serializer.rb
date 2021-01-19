# frozen_string_literal: true

require_relative "message_verifier"

module CableReady
  class OperationsSerializer
    # Build a CableReady::OperationsSerializer to use for
    #   safe serialization of CableReady operations.
    #
    # @param operations [Array] an Array of chained operations, e.g.
    #   [{morph: {selector: "..."}, {inner_html: selector: "..."}, ...]
    # @return [CableReady::OperationsSerializer]
    def initialize(*operations)
      @operations = operations
    end

    def verified
      CableReady::MessageVerifier.message_verifier.generate(@operations)
    end
  end
end
