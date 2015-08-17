class Cohort < ActiveRecord::Base
  has_many :students
  has_many :homeworks
  has_many :assignments, through: :students

  scope :active, -> { where(is_active: true) }

  def admins_include?(nickname)
    user = User.where(nickname: nickname).first
    client = user ? Octokit::Client.new(access_token: user.access_token) : Octokit
    client.org_members(org, role: 'admin').map(&:login).include?(nickname)
  end

  def seed_homework
    (1..9).each do |week|
      (1..4).each do |day|
        homeworks.create(name: "Assignment #{week}-#{day}")
      end
    end
  end
end
