class Assignment < ActiveRecord::Base
  has_paper_trail
  belongs_to :student
  belongs_to :homework

  validates :homework, uniqueness: { :scope => :student }
  validates :issue, presence: true
end
