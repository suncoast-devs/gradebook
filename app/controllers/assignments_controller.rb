class AssignmentsController < ApplicationController
  before_action :require_authentication
  before_action :find_student
  before_action :find_assignment, :only => [:show, :update, :destroy]

  # GET /students/1/assignments.json
  def index
    @assignments = @student.assignments
  end

  # GET /students/1/assignments/1.json
  def show
  end

  # POST /students/1/assignments.json
  def create
    @assignment = @student.assignments.new(assignment_params)

    client = Octokit::Client.new(:access_token => current_user.access_token)
    issue = client.create_issue("#{@student.github}/#{@student.assignments_repo}",
      @assignment.homework.name, @assignment.homework.body, :assignee => @student.github)
    @assignment.issue = issue.number

    if @assignment.save
      render :show, status: :created, location: [@student, @assignment]
    else
      render json: @assignment.errors, status: :unprocessable_entity
    end
  end

  # PATCH /students/1/assignments/1.json
  def update
    if @assignment.update(assignment_params)
      render :show, status: :ok, location: [@student, @assignment]
    else
      render json: @assignment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /students/1/assignments/1.json
  def destroy
    @assignment.destroy
    head :no_content
  end

  private

    def find_student
      @student = Cohort.current.students.find(params[:student_id])
    end

    def find_assignment
      @assignment = @student.assignments.find(params[:id])
    end

    def assignment_params
      params[:assignment].permit(:homework_id)
    end
end
