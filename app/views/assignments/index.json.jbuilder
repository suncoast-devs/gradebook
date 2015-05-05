json.array!(@assignments) do |assignment|
  json.extract! assignment, :id, :homework_id, :issue, :score
  json.url student_assignment_url(@student, assignment, format: :json)
end
