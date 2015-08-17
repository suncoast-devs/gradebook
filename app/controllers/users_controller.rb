class UsersController < ApplicationController
  before_action :require_authentication

  def show
  end

  def update
    if current_user.update(user_params)
      redirect_to user_path, notice: 'User was successfully updated.'
    else
      render :show
    end
  end

  private

  def user_params
    params[:user].permit(:cohort_id)
  end
end
