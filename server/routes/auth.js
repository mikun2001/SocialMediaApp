import express from "express";

const router = express.Router();

// middleware
import { requireSignin, isAdmin } from "../middlewares";
// controllers
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  userFollowers,
  removeFollower,
  userUnfollow,
  searchUser,
  getUser,
  users,
  totalUsers,
  adminDeleteUser,
  adminUserUnfollow,
  adminRemoveFollower,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);

router.put("/profile-update", requireSignin, profileUpdate);
router.get("/find-people", requireSignin, findPeople);

router.put("/user-follow", requireSignin, addFollower, userFollow);
router.put("/user-unfollow", requireSignin, removeFollower, userUnfollow);
router.get("/user-following", requireSignin, userFollowing);
router.get("/user-followers", requireSignin, userFollowers);

router.get("/search-user/:query", searchUser);
router.get("/user/:_id", getUser);

// admin
router.delete(
  "/admin/delete-user/:_id",
  requireSignin,
  isAdmin,
  adminDeleteUser
);
router.get("/admin/users", requireSignin, isAdmin, users);
router.get("/admin/total-users", requireSignin, isAdmin, totalUsers);
router.get("/current-admin", requireSignin, isAdmin, currentUser);
router.put(
  "/admin/user-unfollow",
  requireSignin,
  adminRemoveFollower,
  adminUserUnfollow
);

module.exports = router;
