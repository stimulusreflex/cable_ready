# frozen_string_literal: true

require "thread/local"

module CableReady
  class CableCar < OperationBuilder
    extend Thread::Local

    def initialize
      super "CableCar"
    end

    def dispatch(clear: true)
      payload = operations_payload
      reset! if clear
      payload
    end
  end
end
