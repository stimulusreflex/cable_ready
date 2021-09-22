class Team < ApplicationRecord
  include CableReady::Broadcastable
  enable_broadcasts

  has_many :users, broadcast: true
end
