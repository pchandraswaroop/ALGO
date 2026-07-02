const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AuthUser = require("../model/authUser");

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@admin.com";
  const password = "admin 123";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await AuthUser.findOneAndUpdate(
    { email },
    {
      $set: {
        firstName: "Admin",
        lastName: "User",
        email,
        username: "admin",
        fullName: "Admin User",
        role: "admin",
        password: hashedPassword,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log(
    JSON.stringify(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      null,
      2,
    ),
  );

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
