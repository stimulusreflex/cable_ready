# frozen_string_literal: true

# TODO: remove me once CableReady 5.0 was released

module CableReadyHelper
  def self.included(base)
    raise "`CableReadyHelper` was renamed to `CableReady::Helper`"
  end
end
