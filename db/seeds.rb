# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

if Homework.count.zero?
  (1..9).each do |week|
    (1..4).each do |day|
      Homework.create(:name => "Assignment #{week}-#{day}")
    end
  end
end
