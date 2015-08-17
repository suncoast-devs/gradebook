class StudentsController < ApplicationController
  before_action :require_authentication
  before_action :find_student, :only => [:show, :update, :destroy, :issues]

  # GET /students.json
  def index
    @students = current_user.cohort.students.order(:name)
  end

  # GET /students/1.json
  def show
  end

  # POST /students.json
  def create
    @student = current_user.cohort.students.new(student_params)

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

  # GET /students/1/issues.json
  def issues
    client = Octokit::Client.new(:access_token => current_user.access_token)
    client.auto_paginate = true
    issues = client.issues("#{@student.github}/#{@student.assignments_repo}", :state => 'all')
    render json: issues.map(&:to_hash)
  end

  private

    def find_student
      @student = current_user.cohort.students.find(params[:id])
    end

    def student_params
      params[:student].permit(:name, :github, :assignments_repo, :is_active)
    end
end
