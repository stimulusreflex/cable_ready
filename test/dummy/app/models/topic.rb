# frozen_string_literal: true

class Topic < ApplicationRecord
  include CableReady::Updatable
  enable_cable_ready_updates on: :create
end
