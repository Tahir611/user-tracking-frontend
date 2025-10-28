import {
  GraduationCap,
  TvMinimalPlay,
  Settings,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { useDesignTracking } from "@/context/design-tracking-context";
import { useDesignTracker } from "@/hooks/use-design-tracker";
import DesignCustomization from "../design-customization";
import DesignAnalytics from "../design-analytics";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { userPreferences } = useDesignTracking();
  const tracker = useDesignTracker();
  const { auth } = useContext(AuthContext);
  console.log(auth, "auth in header");

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b relative">
        <div className="flex items-center space-x-4">
          <Link
            to="/home"
            className="flex items-center hover:text-black hover:scale-105 transition-transform hover:animate-image-zoom"
            onClick={() =>
              tracker.trackClick({
                classList: { contains: () => false },
                closest: () => true,
              })
            }
            style={{
              fontFamily: userPreferences.preferredFonts?.[0] || "inherit",
              color: userPreferences.preferredColors?.[0] || "inherit",
              transitionDuration:
                userPreferences.preferredAnimationSpeed === "slow"
                  ? "500ms"
                  : userPreferences.preferredAnimationSpeed === "fast"
                  ? "100ms"
                  : "200ms",
            }}
          >
            <GraduationCap className="h-8 w-8 mr-4" />
            <span className="font-extrabold md:text-xl text-[14px]">
              LMS LEARN
            </span>
          </Link>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => {
                tracker.trackClick({
                  classList: { contains: () => false },
                  closest: () => true,
                });
                location.pathname.includes("/courses")
                  ? null
                  : navigate("/courses");
              }}
              className="text-[14px] md:text-[16px] font-medium hover:scale-105 transition-transform hover:animate-button-press"
              style={{
                fontFamily: userPreferences.preferredFonts?.[0] || "inherit",
                color: userPreferences.preferredColors?.[0] || "inherit",
                transitionDuration:
                  userPreferences.preferredAnimationSpeed === "slow"
                    ? "500ms"
                    : userPreferences.preferredAnimationSpeed === "fast"
                    ? "100ms"
                    : "200ms",
              }}
            >
              Explore Courses
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                tracker.trackClick({
                  classList: { contains: () => false },
                  closest: () => true,
                });
                setShowCustomization(true);
              }}
              className="flex items-center gap-2 hover:scale-105 transition-transform hover:animate-input-focus"
              title="Design Customization"
              style={{
                fontFamily: userPreferences.preferredFonts?.[0] || "inherit",
                color: userPreferences.preferredColors?.[0] || "inherit",
                transitionDuration:
                  userPreferences.preferredAnimationSpeed === "slow"
                    ? "500ms"
                    : userPreferences.preferredAnimationSpeed === "fast"
                    ? "100ms"
                    : "200ms",
              }}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Customize</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                tracker.trackClick({
                  classList: { contains: () => false },
                  closest: () => true,
                });
                setShowAnalytics(true);
              }}
              className="flex items-center gap-2 hover:scale-105 transition-transform hover:animate-button-press"
              title="Design Analytics"
              style={{
                fontFamily: userPreferences.preferredFonts?.[0] || "inherit",
                color: userPreferences.preferredColors?.[0] || "inherit",
                transitionDuration:
                  userPreferences.preferredAnimationSpeed === "slow"
                    ? "500ms"
                    : userPreferences.preferredAnimationSpeed === "fast"
                    ? "100ms"
                    : "200ms",
              }}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </Button>

            <div
              onClick={() => {
                tracker.trackClick({
                  classList: { contains: () => false },
                  closest: () => true,
                });
                navigate("/student-courses");
              }}
              className="flex cursor-pointer items-center gap-3 hover:scale-105 transition-transform hover:animate-group-hover"
              style={{
                fontFamily: userPreferences.preferredFonts?.[0] || "inherit",
                color: userPreferences.preferredColors?.[0] || "inherit",
                transitionDuration:
                  userPreferences.preferredAnimationSpeed === "slow"
                    ? "500ms"
                    : userPreferences.preferredAnimationSpeed === "fast"
                    ? "100ms"
                    : "200ms",
              }}
            >
              <span className="font-extrabold md:text-xl text-[14px]">
                My Courses
              </span>
              <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
            </div>
            <Button
              onClick={() => {
                // tracker.trackClick({
                //   classList: { contains: () => false },
                //   closest: () => true,
                // });
                handleLogout();
              }}
              className="hover:animate-button-press, text-secondary"
              style={{
                fontFamily: userPreferences.preferredFonts?.[0] || "inherit",
                transitionDuration:
                  userPreferences.preferredAnimationSpeed === "slow"
                    ? "500ms"
                    : userPreferences.preferredAnimationSpeed === "fast"
                    ? "100ms"
                    : "200ms",
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Design Customization Modal */}
      <DesignCustomization
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
      />

      {/* Design Analytics Modal */}
      <DesignAnalytics
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
    </>
  );
}

export default StudentViewCommonHeader;
