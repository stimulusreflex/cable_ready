# frozen_string_literal: true

module CableReady
  class Channel < OperationBuilder
    attr_reader :identifier

    def broadcast(clear: true)
      ActionCable.server.broadcast identifier, {"cableReady" => true, "operations" => operations_payload}
      reset! if clear
    end

    def broadcast_to(model, clear: true)
      identifier.broadcast_to model, {"cableReady" => true, "operations" => operations_payload}
      reset! if clear
    end
  end
end
