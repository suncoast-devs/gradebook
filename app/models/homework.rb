class Homework < ActiveRecord::Base
  has_paper_trail
  has_many :assignments
  has_many :students, :through => :assignments
  belongs_to :cohort

  def title
    "#{name} - #{summary}"
  end
end
