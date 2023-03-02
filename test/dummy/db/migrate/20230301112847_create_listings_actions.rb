class CreateListingsActions < ActiveRecord::Migration[6.1]
  def change
    create_table :listings_actions do |t|
      t.references :listing, null: false, foreign_key: true
      t.string :kind

      t.timestamps
    end
  end
end
