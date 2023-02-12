# frozen_string_literal: true

class Supplier < ApplicationRecord
  include CableReady::Updatable
  enable_updates

  has_one :account, enable_updates: true
end
