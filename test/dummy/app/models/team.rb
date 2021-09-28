class Team < ApplicationRecord
  include CableReady::Updatable
  enable_updates

  has_many :users
end
