# frozen_string_literal: true

class Team < ApplicationRecord
  include CableReady::Updatable
  enable_cable_ready_updates

  has_many :users, enable_cable_ready_updates: true
end
