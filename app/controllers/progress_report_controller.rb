class ProgressReportController < ApplicationController
    before_action :require_authentication

    def index
        @cohort = current_user.cohort
    end
end
