json.array!(@cohorts) do |cohort|
  json.extract! cohort, :id
  json.url cohort_url(cohort, format: :json)
end
