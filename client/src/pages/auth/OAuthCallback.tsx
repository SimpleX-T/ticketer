import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaTicket } from "react-icons/fa6";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=" + error);
      return;
    }

    if (accessToken) {
      handleOAuthCallback(accessToken).then(() => {
        navigate("/dashboard");
      });
    } else {
      navigate("/login?error=no_token");
    }
  }, [searchParams, handleOAuthCallback, navigate]);

  return (
    <section className="min-h-screen w-full bg-gradient-to-bl from-secondary-200 to-primary grid place-items-center">
      <div className="text-center">
        <FaTicket
          className="animate-bounce text-secondary mx-auto mb-4"
          size={48}
        />
        <h2 className="text-xl text-secondary">Completing login...</h2>
        <p className="text-secondary-100 text-sm mt-2">
          Please wait while we sign you in
        </p>
      </div>
    </section>
  );
}
