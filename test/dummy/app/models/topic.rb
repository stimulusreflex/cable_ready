class Topic < ApplicationRecord
  include CableReady::Broadcastable
  enable_broadcasts on: :create
end
