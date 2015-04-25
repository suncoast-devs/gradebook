class Cohort < ActiveRecord::Base
  has_many :students
  has_many :assignments, :through => :students

  scope :current, -> { first } # TODO: Make this a flag

  def admins_include?(nickname)
    Octokit.org_members(org, :role => 'admin').map(&:login).include?(nickname)
  end
end
