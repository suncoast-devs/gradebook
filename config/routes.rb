Rails.application.routes.draw do
  root 'home#index'

  get '/auth/:provider/callback' => 'sessions#create'
  get '/signout' => 'sessions#destroy', :as => :signout

  get '/progress' => 'progress_report#index'
  
  resources :cohorts
  resources :homework, only: [:index, :show, :create, :update, :destroy]
  resources :students, only: [:index, :show, :create, :update, :destroy] do
    get :issues, on: :member
    resources :assignments, only: [:index, :show, :create, :update, :destroy]
  end
  resource :user, only: [:show, :update]
end
