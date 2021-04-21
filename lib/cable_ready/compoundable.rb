# frozen_string_literal: true

module CableReady
  module Compoundable
    def compound(keys)
      keys.map { |key|
        key.class < ActiveRecord::Base ? key.to_global_id.to_s : key.to_s
      }.join(":")
    end
  end
end
