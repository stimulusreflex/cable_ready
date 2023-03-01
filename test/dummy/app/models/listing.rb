class Listing < ApplicationRecord
  include CableReady::Updatable

  belongs_to :user
  has_many :actions, class_name: "Listings::Action", dependent: :destroy, foreign_key: :listing_id, enable_cable_ready_updates: true, inverse_of: :listing
end
