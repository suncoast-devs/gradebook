class Student < ActiveRecord::Base
  belongs_to :cohort
  has_many :assignments
  has_many :homework, :through => :assignments

end
