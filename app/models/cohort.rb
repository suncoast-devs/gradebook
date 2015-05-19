class Cohort < ActiveRecord::Base
  has_many :students
  has_many :assignments, :through => :students

  scope :current, -> { first } # TODO: Make this a flag

  def admins_include?(nickname)
    client = if user = User.first
      Octokit::Client.new(:access_token => user.access_token)
    else
      Octokit
    end
    client.org_members(org, :role => 'admin').map(&:login).include?(nickname)
  end
end
