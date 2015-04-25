class CreateAssignments < ActiveRecord::Migration
  def change
    create_table :assignments do |t|
      t.references :student, index: true, foreign_key: true
      t.references :homework, index: true, foreign_key: true
      t.integer :issue
      t.string :state

      t.timestamps null: false
    end
  end
end
