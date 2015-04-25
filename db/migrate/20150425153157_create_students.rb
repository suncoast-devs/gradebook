class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.references :cohort, index: true, foreign_key: true
      t.string :name
      t.string :github
      t.string :assignments_repo

      t.timestamps null: false
    end
  end
end
