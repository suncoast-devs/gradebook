Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github,
  "e3d08edc5b52e5ab8f31",
    "0c8c24d2c19739c25bd708d7ebf77900cb6dd421",
    scope: "user:email,public_repo"
end
