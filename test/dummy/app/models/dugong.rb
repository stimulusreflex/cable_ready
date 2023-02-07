class Dugong < ApplicationRecord
  include CableReady::Updatable
  has_many_attached :images, enable_updates: true
end
