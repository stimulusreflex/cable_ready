class Site < ApplicationRecord
  include CableReady::Updatable

  enable_cable_ready_updates debounce: 3.seconds

  has_many :rules, enable_cable_ready_updates: true, debounce: 5.seconds
end
