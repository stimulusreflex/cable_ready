# frozen_string_literal: true

class Post < ApplicationRecord
  include CableReady::Updatable
  belongs_to :user
end
