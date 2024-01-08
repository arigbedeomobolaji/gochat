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

export const friends = async (user: UserData) => {
  try {
    const userData = await User.findById(user._id).populate("friends").exec();
    if (userData) {
      return userData.friends;
    }
  } catch (error) {
    console.log("users error", error);
  }
};

export const activeStatus = async (
  userId: string,
  status: string,
  cb: (username: string, isActive: boolean) => void
) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: status === "active" ? true : false },
      { new: true }
    );

    if (user) {
      cb(user.username, user.isActive);
    }
  } catch (error) {}
};
