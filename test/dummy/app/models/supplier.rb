# frozen_string_literal: true

class Supplier < ApplicationRecord
  include CableReady::Updatable
  enable_cable_ready_updates

  has_one :account, enable_cable_ready_updates: true
end
