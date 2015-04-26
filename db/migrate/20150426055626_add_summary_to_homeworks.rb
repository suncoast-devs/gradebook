class AddSummaryToHomeworks < ActiveRecord::Migration
  def change
    add_column :homeworks, :summary, :string
  end
end
