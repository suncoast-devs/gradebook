class HomeworkController < ApplicationController
  before_action :require_authentication

  # GET /homework.json
  def index
    @homework = Homework.order(:name)
  end

  # GET /homework/1.json
  def show
    @homework = Homework.find(params[:id])
  end

  # POST /homework.json
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
