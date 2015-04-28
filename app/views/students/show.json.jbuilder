json.extract! @student, :id, :name, :github, :assignments_repo, :created_at, :updated_at
json.assignments_url student_assignments_url(@student, format: :json)
json.assignments @student.assignments, :id, :homework_id, :issue, :state
