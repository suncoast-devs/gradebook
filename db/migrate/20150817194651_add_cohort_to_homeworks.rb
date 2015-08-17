class AddCohortToHomeworks < ActiveRecord::Migration
  def change
    add_reference :homework, :cohort, index: true, foreign_key: true
  end
end
