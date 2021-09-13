class User < ApplicationRecord
  include CableReady::Broadcastable
  enable_broadcasts

  has_many :posts, broadcast: true
  belongs_to :team, optional: true, touch: true
end
