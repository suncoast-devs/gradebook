class AddCohortToHomeworks < ActiveRecord::Migration
  def change
    add_reference :homeworks, :cohort, index: true, foreign_key: true
  end
end
