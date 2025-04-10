require_relative "../../config/environment"

CARDS_COUNT = 200

ApplicationRecord.current_tenant = "development-tenant"
account = Account.first
user = account.users.first
Current.session = user.sessions.last
collection = account.collections.first

# Doing

CARDS_COUNT.times do |index|
  card = collection.cards.create!(title: "Doing card #{index}", creator: user, status: :published)
  card.engage
end

# Considering

CARDS_COUNT.times do |index|
  card = collection.cards.create!(title: "Considering card #{index}", creator: user, status: :published)
  card.reconsider
end

# Completed

CARDS_COUNT.times do |index|
  card = collection.cards.create!(title: "Popped card #{index}", creator: user, status: :published)
  card.close
end
