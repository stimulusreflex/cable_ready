class Post < ApplicationRecord
  include CableReady::Broadcastable
  belongs_to :user
end
