# frozen_string_literal: true

class User < ApplicationRecord
  include CableReady::Updatable
  enable_cable_ready_updates

  has_many :posts, enable_cable_ready_updates: true
  belongs_to :team, optional: true, touch: true
end
