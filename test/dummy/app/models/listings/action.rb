class Listings::Action < ApplicationRecord
  belongs_to :listing, class_name: "Listing"
end
