# frozen_string_literal: true

class CreateBlocks < ActiveRecord::Migration[6.1]
  def change
    create_table :blocks do |t|
      t.string :body
      t.string :type
      t.references :section, null: false, foreign_key: true

      t.timestamps
    end
  end
end
