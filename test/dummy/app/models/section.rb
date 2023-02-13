# frozen_string_literal: true

class Section < ApplicationRecord
  include CableReady::Updatable

  enable_cable_ready_updates if: -> { updates_enabled }

  attribute :updates_enabled, :boolean, default: false

  has_many :blocks, enable_cable_ready_updates: true, descendants: ["Comment"]
end
