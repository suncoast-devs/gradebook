class RenameHomeworksToHomework < ActiveRecord::Migration
  def change
    rename_table :homeworks, :homework
  end
end
