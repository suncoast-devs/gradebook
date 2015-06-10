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
    if @student.is_active
      client = Octokit::Client.new(:access_token => current_user.access_token)
      @assignment = @student.assignments.find_or_initialize_by(assignment_params)
      if @assignment.new_record?
        issue = client.create_issue("#{@student.github}/#{@student.assignments_repo}",
          @assignment.homework.title, @assignment.homework.body, :assignee => @student.github)
        @assignment.issue = issue.number
      else
        client.update_issue("#{@student.github}/#{@student.assignments_repo}",
          @assignment.issue, @assignment.homework.title,
          @assignment.homework.body, :assignee => @student.github)
      end

      if @assignment.save
        render :show, status: :created, location: [@student, @assignment]
      else
        render json: @assignment.errors, status: :unprocessable_entity
      end
    else
      head :ok
    end
  end

  # PATCH /students/1/assignments/1.json
  def update
    if @assignment.update(assignment_params)
      if @assignment.previous_changes.include?(:score) && @assignment.score >= 3
        gif = JSON.load(Net::HTTP.get(URI("http://api.giphy.com/v1/stickers/random?api_key=dc6zaTOxFJmzC&tag=dancing&rating=pg")))
        client = Octokit::Client.new(:access_token => current_user.access_token)
        client.add_comment("#{@student.github}/#{@student.assignments_repo}",
          @assignment.issue, "![Awesome Work!](#{gif["data"]["fixed_width_downsampled_url"]})")
      end
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
      params[:assignment].permit(:homework_id, :score)
    end
end
