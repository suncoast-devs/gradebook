class AddIsActiveToStudents < ActiveRecord::Migration
  def change
    add_column :students, :is_active, :boolean, default: true
  end
end
