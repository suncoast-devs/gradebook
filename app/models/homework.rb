class Homework < ActiveRecord::Base
  has_many :assignments
  has_many :students, :through => :assignments

end
