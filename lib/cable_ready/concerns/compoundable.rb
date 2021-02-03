module CableReady
  module Compoundable
    def compound(keys)
      keys.map { |key|
        key.class < ActiveRecord::Base ? key.to_sgid(expires_in: nil).to_s : key.to_s
      }.join(":")
    end
  end
end
