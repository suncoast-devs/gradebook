class SessionsController < ApplicationController

  def create
    auth = request.env["omniauth.auth"]
    user = User.authorize_with(auth)
    session[:user_id] = user.id
    redirect_to root_url, :notice => "Signed in as #{current_user.name}."
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "Signed out!"
  end
end
