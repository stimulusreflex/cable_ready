# frozen_string_literal: true

module CableReady
  class CableCar < OperationBuilder
    extend Thread::Local

    def initialize
      super "CableCar"
    end

    def dispatch(element: false, clear: true)
      payload = element ? operations_in_custom_element : operations_payload
      reset! if clear
      payload
    end
  end
end
