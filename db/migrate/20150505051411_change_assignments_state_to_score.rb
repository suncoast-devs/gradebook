class ChangeAssignmentsStateToScore < ActiveRecord::Migration

  def down
    rename_column :assignments, :score, :state
    change_column :assignments, :state, :string
  end

  def up
    change_column :assignments, :state, 'integer USING CAST(state AS integer)', :default => 0, :null => false
    rename_column :assignments, :state, :score
  end
end
