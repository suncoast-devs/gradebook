json.array!(@students) do |student|
  json.extract! student, :id, :name, :github, :assignments_repo, :is_active
  json.url student_url(student, format: :json)
  json.assignments_url student_assignments_url(student, format: :json)
  json.issues_url issues_student_url(student, format: :json)
  json.assignments student.assignments do |assignment|
    json.extract! assignment, :id, :homework_id, :issue, :score
    json.url student_assignment_url(student, assignment, format: :json)
  end
end
