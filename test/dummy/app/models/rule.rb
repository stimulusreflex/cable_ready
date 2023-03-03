class Rule < ApplicationRecord
  include CableReady::Updatable

  belongs_to :site
end
