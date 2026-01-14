import prisma from "../config/database";
import { hashPassword, comparePassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  getRefreshTokenExpiry,
  verifyRefreshToken,
} from "../utils/jwt";
import { RegisterInput, LoginInput } from "../validators/auth";
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from "../middleware/errorHandler";
import { Provider, Role } from "@prisma/client";

interface AuthResult {
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    displayName: string | null;
    profileImage: string | null;
    role: Role;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

// Register with email/password
export const register = async (input: RegisterInput): Promise<AuthResult> => {
  const { email, password, firstname, lastname } = input;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw conflict("Email already registered");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      firstname,
      lastname,
      provider: Provider.EMAIL,
    },
  });

  // Generate tokens
  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  // Create email verification token
  const verificationToken = generateVerificationToken();
  await prisma.verificationToken.create({
    data: {
      token: verificationToken,
      email: user.email,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  // TODO: Send verification email
  console.log(
    `[DEV] Email verification token for ${email}: ${verificationToken}`
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      displayName: user.displayName,
      profileImage: user.profileImage,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
};

// Login with email/password
export const login = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  if (!user.passwordHash) {
    throw badRequest(
      `This account uses ${user.provider} login. Please sign in with ${user.provider}.`
    );
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw unauthorized("Invalid email or password");
  }

  // Generate tokens
  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      displayName: user.displayName,
      profileImage: user.profileImage,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
};

// Refresh access token
export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw unauthorized("Invalid refresh token");
  }

  // Check if token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    }
    throw unauthorized("Refresh token expired");
  }

  // Delete old token
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  // Generate new tokens
  const newPayload = {
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
  };
  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  // Store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: storedToken.user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Logout - invalidate refresh token
export const logout = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

// Logout all sessions
export const logoutAll = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

// Verify email
export const verifyEmail = async (token: string): Promise<void> => {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.type !== "EMAIL_VERIFICATION") {
    throw badRequest("Invalid verification token");
  }

  if (verificationToken.expiresAt < new Date()) {
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });
    throw badRequest("Verification token expired");
  }

  // Update user
  await prisma.user.update({
    where: { email: verificationToken.email },
    data: { emailVerified: true },
  });

  // Delete token
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });
};

// Request password reset
export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Always return success to prevent email enumeration
  if (!user || user.provider !== Provider.EMAIL) {
    return;
  }

  // Delete any existing reset tokens
  await prisma.verificationToken.deleteMany({
    where: { email: user.email, type: "PASSWORD_RESET" },
  });

  // Create new reset token
  const resetToken = generateVerificationToken();
  await prisma.verificationToken.create({
    data: {
      token: resetToken,
      email: user.email,
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // TODO: Send password reset email
  console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
};

// Reset password
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const resetToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.type !== "PASSWORD_RESET") {
    throw badRequest("Invalid reset token");
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: resetToken.id } });
    throw badRequest("Reset token expired");
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update user password
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { passwordHash },
  });

  // Delete token
  await prisma.verificationToken.delete({ where: { id: resetToken.id } });

  // Invalidate all refresh tokens
  const user = await prisma.user.findUnique({
    where: { email: resetToken.email },
  });
  if (user) {
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
  }
};

// Get current user
export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      displayName: true,
      profileImage: true,
      role: true,
      emailVerified: true,
      provider: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw notFound("User");
  }

  return user;
};

// OAuth login/register (Google/GitHub)
export const oauthLogin = async (
  provider: Provider,
  providerId: string,
  email: string,
  firstname: string,
  lastname: string,
  profileImage?: string
): Promise<AuthResult> => {
  // Check if user exists by provider ID
  let user = await prisma.user.findFirst({
    where: {
      provider,
      providerId,
    },
  });

  // If not found by provider, check by email
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      // Link OAuth to existing account
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider,
          providerId,
          emailVerified: true,
          profileImage: profileImage || user.profileImage,
        },
      });
    }
  }

  // Create new user if not exists
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstname,
        lastname,
        provider,
        providerId,
        profileImage,
        emailVerified: true,
      },
    });
  }

  // Generate tokens
  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      displayName: user.displayName,
      profileImage: user.profileImage,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
};
