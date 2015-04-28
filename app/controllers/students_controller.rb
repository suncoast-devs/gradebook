class StudentsController < ApplicationController
  before_action :require_authentication
  before_action :find_student, :only => [:show, :update, :destroy]

  # GET /students.json
  def index
    @students = Cohort.current.students.order(:name)
  end

  # GET /students/1.json
  def show
  end

  # POST /students.json
  def create
    @student = Cohort.current.students.new(student_params)

    if @student.save
      render :show, status: :created, location: @student
    else
      render json: @student.errors, status: :unprocessable_entity
    end
  end

  # PATCH /students/1.json
  def update
    if @student.update(student_params)
      render :show, status: :ok, location: @student
    else
      render json: @student.errors, status: :unprocessable_entity
    end
  end

  # DELETE /students/1.json
  def destroy
    @student.destroy
    head :no_content
  end

  private

    def find_student
      @student = Cohort.current.students.find(params[:id])
    end

    def student_params
      params[:student].permit(:name, :github, :assignments_repo)
    end
end
