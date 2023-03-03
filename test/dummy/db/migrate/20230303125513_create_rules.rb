class CreateRules < ActiveRecord::Migration[6.1]
  def change
    create_table :rules do |t|
      t.string :name
      t.references :site

      t.timestamps
    end
  end
end
