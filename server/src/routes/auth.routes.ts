import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth";

const router = Router();

// Email/password auth
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Current user
router.get("/me", authMiddleware, authController.me);

// Email verification
router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  authController.verifyEmail
);

// Password reset
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Google OAuth
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);

// GitHub OAuth
router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubCallback);

export default router;
