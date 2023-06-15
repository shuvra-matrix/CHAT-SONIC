exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup");
};
