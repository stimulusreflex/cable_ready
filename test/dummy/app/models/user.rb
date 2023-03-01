# frozen_string_literal: true

class User < ApplicationRecord
  include CableReady::Updatable
  enable_cable_ready_updates

  has_many :posts, enable_cable_ready_updates: true
  belongs_to :team, optional: true, touch: true
  has_many :listings
  has_many :actions, class_name: "Listings::Action", through: :listings, enable_cable_ready_updates: true, foreign_key: :listing_id
end
