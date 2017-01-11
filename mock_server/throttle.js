module.exports = function (req, res, next) {
  setTimeout(next, 1000);
};
