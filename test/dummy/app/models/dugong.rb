# frozen_string_literal: true

class Dugong < ApplicationRecord
  include CableReady::Updatable
  has_many_attached :images, enable_cable_ready_updates: true
end
