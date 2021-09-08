class Section < ApplicationRecord
  include CableReady::Broadcastable
  enable_broadcasts if: -> { broadcasts_enabled }

  attribute :broadcasts_enabled, :boolean, default: false
end
