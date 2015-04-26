json.array!(@homework) do |homework|
  json.extract! homework, :id, :name, :summary
  json.url homework_url(homework, format: :json)
end
