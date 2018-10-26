class Assignment < ActiveRecord::Base
  has_paper_trail
  belongs_to :student
  belongs_to :homework

  validates :homework, uniqueness: { :scope => :student }
  validates :issue, presence: true


  def score_description
    case score
    when 0
      'Unacceptable'
    when 1
      'Needs Improvement'
    when 2
      'Acceptable'
    when 3
      'Meets Expectations'
    when 4
      'Exceeds Expectations'
    end
  end
end
