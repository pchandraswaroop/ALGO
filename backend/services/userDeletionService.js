const AuthUser = require("../model/authUser");
const Submission = require("../model/Submission");

const deleteUserWithSubmissions = async (userId) => {
  const user = await AuthUser.findById(userId).select("_id");

  if (!user) {
    return null;
  }

  await Submission.deleteMany({ userId });
  await AuthUser.findByIdAndDelete(userId);

  return user;
};

module.exports = {
  deleteUserWithSubmissions,
};
