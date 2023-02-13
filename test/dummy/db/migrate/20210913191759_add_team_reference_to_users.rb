# frozen_string_literal: true

class AddTeamReferenceToUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :users, :team
  end
end
