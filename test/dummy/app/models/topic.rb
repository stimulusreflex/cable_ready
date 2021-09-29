class Topic < ApplicationRecord
  include CableReady::Updatable
  enable_updates on: :create
end
