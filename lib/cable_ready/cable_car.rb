# frozen_string_literal: true

module CableReady
  class CableCar < OperationBuilder
    extend Thread::Local

    def initialize
      super "CableCar"
    end

    def dispatch(elements: false, clear: true)
      payload = elements ? operations_custom_elements : operations_payload
      reset! if clear
      payload
    end
  end
end
