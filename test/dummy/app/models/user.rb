class User < ApplicationRecord
  include CableReady::Broadcastable
  enable_broadcasts

  has_many :posts, broadcast: true
end
