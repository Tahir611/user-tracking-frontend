import { Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import StudentViewCommonHeader from "./header";
import { useAutoDesignTracking } from "@/hooks/use-design-tracker";

function StudentViewCommonLayout() {
  const location = useLocation();
  const layoutRef = useRef(null);
  
  // Enable automatic design tracking for this layout
  useAutoDesignTracking(layoutRef);
  
  return (
    <div ref={layoutRef}>
      {!location.pathname.includes("course-progress") ? (
        <StudentViewCommonHeader />
      ) : null}

      <Outlet />
    </div>
  );
}

export default StudentViewCommonLayout;
