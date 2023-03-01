class Site < ApplicationRecord
  include CableReady::Updatable

  enable_cable_ready_updates
end
