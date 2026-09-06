import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useCandidate } from "../hooks/useCandidate.js";

const InterviewGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleGetCandidateProfile, profileStatus } = useCandidate();

  useEffect(() => {
    let active = true;

    handleGetCandidateProfile().then(({ notFound }) => {
      if (active && notFound) {
          navigate("/candidate/register", {
            replace: true,
            state: { from: location.pathname },
          });
      }
      });

    return () => {
      active = false;
    };
  }, [location.pathname, navigate]);

  if (profileStatus === "idle" || profileStatus === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-orange-500">
        <Loader2 size={28} className="animate-spin" aria-label="Checking candidate profile" />
      </div>
    );
  }

  if (profileStatus === "failed") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-slate-600">
        We could not verify your candidate profile. Please try again.
      </div>
    );
  }

  return children;
};

export default InterviewGuard;