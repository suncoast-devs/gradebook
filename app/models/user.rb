class User < ActiveRecord::Base
  belongs_to :cohort
  after_save :set_cohort

  def self.authorize_with(auth)
    user = where(provider: auth['provider'], uid: auth['uid']).first_or_create
    user.tap do |u|
      u.name         = auth.info.name
      u.email        = auth.info.email
      u.nickname     = auth.info.nickname
      u.access_token = auth.credentials.token
      u.save!
    end
  end

  def set_cohort
    return unless cohort_id.blank?
    cohort = Cohort.active.detect { |c| c.admins_include?(nickname) }
    update_attributes(cohort: cohort) if cohort
  end

  def cohorts
    Cohort.active.select { |c| c.admins_include?(nickname) }
  end
end
