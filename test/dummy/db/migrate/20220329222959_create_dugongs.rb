# frozen_string_literal: true

class CreateDugongs < ActiveRecord::Migration[6.1]
  def change
    create_table :dugongs do |t|

      t.timestamps
    end
  end
end
