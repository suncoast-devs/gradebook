json.array!(@students) do |student|
  json.extract! student, :id, :name, :github, :assignments_repo
  json.url student_url(student, format: :json)
  json.assignments_url student_assignments_url(student, format: :json)
  json.assignments student.assignments, :id, :homework_id, :issue, :state
end
