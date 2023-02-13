# frozen_string_literal: true

class Account < ApplicationRecord
  include CableReady::Updatable
  belongs_to :supplier
end
