import UserModel from "models/UserModel.js";
import bcrypt from "bcryptjs";

const UserController = {
  async createUser(username, password) {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new Error("Username is already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    return newUser;
  },
};

export default UserController;
