class Site < ApplicationRecord
  include CableReady::Updatable

  enable_cable_ready_updates debounce: 3.seconds
end
