class Student < ActiveRecord::Base
  belongs_to :cohort
  has_many :assignments
  has_many :homeworks, :through => :assignments

end
