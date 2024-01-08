import { UserData } from "../middlewares/authMiddleware";
import { User } from "../models/user.model";

export const notFriends = async (user: UserData) => {
  try {
    if (user) {
      const potentialFriends = await User.find({
        $and: [{ _id: { $ne: user._id } }, { _id: { $nin: user.friends } }],
      });
      if (potentialFriends) {
        return potentialFriends;
      }
    }
  } catch (error) {
    console.log("users error", error);
  }
};
