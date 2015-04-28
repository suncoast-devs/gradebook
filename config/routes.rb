Rails.application.routes.draw do
  API_ACTIONS = [:index, :show, :create, :update, :destroy]
  root 'home#index'

  get "/auth/:provider/callback" => "sessions#create"
  get "/signout" => "sessions#destroy", :as => :signout

  resources :cohorts
  resources :homework, :only => API_ACTIONS
  resources :students, :only => API_ACTIONS do
    resources :assignments, :only => API_ACTIONS
  end
end
