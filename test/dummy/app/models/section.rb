class Section < ApplicationRecord
  include CableReady::Updatable

  enable_updates if: -> { updates_enabled }

  attribute :updates_enabled, :boolean, default: false

  has_many :blocks, enable_updates: true, descendants: ["Comment"]
end
