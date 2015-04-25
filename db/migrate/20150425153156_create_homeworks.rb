class CreateHomeworks < ActiveRecord::Migration
  def change
    create_table :homeworks do |t|
      t.string :name
      t.text :body

      t.timestamps null: false
    end
  end
end
