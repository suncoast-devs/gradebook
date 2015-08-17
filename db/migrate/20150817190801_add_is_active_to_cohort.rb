class AddIsActiveToCohort < ActiveRecord::Migration
  def change
    add_column :cohorts, :is_active, :boolean
  end
end
