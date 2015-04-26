class HomeworksController < ApplicationController
  before_action :require_authentication

  # GET /homeworks.json
  def index
    @homeworks = Homework.order(:name)
  end

  # GET /homeworks/1.json
  def show
    @homework = Homework.find(params[:id])
  end

  # POST /homeworks.json
  def create
    @homework = Homework.new(homework_params)

    if @homework.save
      render :show, status: :created, location: @homework
    else
      render json: @homework.errors, status: :unprocessable_entity
    end
  end

  private

    def homework_params
      params[:homework].permit(:name, :summary, :body)
    end
end
