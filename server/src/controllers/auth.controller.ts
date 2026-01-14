import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { AuthRequest } from "../middleware/auth";
import { env } from "../config/env";

// Register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.register(req.body);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token required" });
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getCurrentUser(req.user!.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Verify email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "If the email exists, a reset link has been sent" });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

// Google OAuth - Initiate
export const googleAuth = (req: Request, res: Response) => {
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.status(501).json({ error: "Google OAuth not configured" });
    return;
  }

  const redirectUri = `${env.SERVER_URL}/api/v1/auth/google/callback`;
  const scope = encodeURIComponent("openid email profile");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

  res.redirect(authUrl);
};

// Google OAuth - Callback
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.query;

    if (!code) {
      res.redirect(`${env.CLIENT_URL}/login?error=no_code`);
      return;
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${env.SERVER_URL}/api/v1/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = (await tokenResponse.json()) as { access_token?: string };

    if (!tokens.access_token) {
      res.redirect(`${env.CLIENT_URL}/login?error=token_exchange_failed`);
      return;
    }

    // Get user info
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    const googleUser = (await userResponse.json()) as {
      id: string;
      email: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
    };

    // Login or register user
    const result = await authService.oauthLogin(
      "GOOGLE",
      googleUser.id,
      googleUser.email,
      googleUser.given_name || googleUser.email?.split("@")[0] || "",
      googleUser.family_name || "",
      googleUser.picture
    );

    // Redirect to client with tokens
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${env.CLIENT_URL}/auth/callback?accessToken=${result.accessToken}`
    );
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(`${env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// GitHub OAuth - Initiate
export const githubAuth = (req: Request, res: Response) => {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(501).json({ error: "GitHub OAuth not configured" });
    return;
  }

  const redirectUri = `${env.SERVER_URL}/api/v1/auth/github/callback`;
  const scope = "read:user user:email";

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  res.redirect(authUrl);
};

// GitHub OAuth - Callback
export const githubCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.query;

    if (!code) {
      res.redirect(`${env.CLIENT_URL}/login?error=no_code`);
      return;
    }

    // Exchange code for token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokens = (await tokenResponse.json()) as { access_token?: string };

    if (!tokens.access_token) {
      res.redirect(`${env.CLIENT_URL}/login?error=token_exchange_failed`);
      return;
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const githubUser = (await userResponse.json()) as {
      id: number;
      login: string;
      name?: string;
      email?: string;
      avatar_url?: string;
    };

    // Get email if not public
    let email = githubUser.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const emails = (await emailResponse.json()) as Array<{
        email: string;
        primary: boolean;
      }>;
      const primaryEmail = emails.find((e) => e.primary);
      email = primaryEmail?.email || emails[0]?.email;
    }

    if (!email) {
      res.redirect(`${env.CLIENT_URL}/login?error=no_email`);
      return;
    }

    // Parse name
    const nameParts = (githubUser.name || githubUser.login || "").split(" ");
    const firstname = nameParts[0] || githubUser.login;
    const lastname = nameParts.slice(1).join(" ") || "";

    // Login or register user
    const result = await authService.oauthLogin(
      "GITHUB",
      String(githubUser.id),
      email,
      firstname,
      lastname,
      githubUser.avatar_url
    );

    // Redirect to client with tokens
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${env.CLIENT_URL}/auth/callback?accessToken=${result.accessToken}`
    );
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.redirect(`${env.CLIENT_URL}/login?error=oauth_failed`);
  }
};
