require "cable_ready/version"
require "active_support/all"

module CableReady
  module Rails
    class Engine < ::Rails::Engine
      # get rails to add lib & vendor dir to load path
    end
  end
end
