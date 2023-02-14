# frozen_string_literal: true

# TODO: remove me once CableReady 5.0 was released

require_relative "../app/helpers/cable_ready/view_helper"

module CableReadyHelper
  def self.included(base)
    warn "NOTICE: `CableReadyHelper` was renamed to `CableReady::ViewHelper`. Please update your include accordingly."

    base.include(::CableReady::ViewHelper)
  end
end
