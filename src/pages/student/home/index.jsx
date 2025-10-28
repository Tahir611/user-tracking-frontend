import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { useDesignTracking } from "@/context/design-tracking-context";
import { useDesignTracker } from "@/hooks/use-design-tracker";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userPreferences } = useDesignTracking();
  const tracker = useDesignTracker();

  function handleNavigateToCoursesPage(getCurrentId) {
    // Track navigation interaction
    tracker.trackClick({ classList: { contains: () => false }, closest: () => true });
    tracker.trackTransitionNavigation();
    
    console.log("Navigating to courses with category:", getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    // Track visual graphics interaction (course image click)
    tracker.trackImageView();
    // Track entry point interaction (course selection)
    tracker.trackClick({ classList: { contains: () => false }, closest: () => true });
    tracker.trackTransitionNavigation();
    
    console.log("Navigating to course:", getCurrentCourseId);
    
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        console.log("User has purchased course, going to progress page");
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        console.log("User hasn't purchased course, going to details page");
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    } else {
      console.log("Error checking course purchase, going to details page");
      navigate(`/course/details/${getCurrentCourseId}`);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div 
      className="min-h-screen bg-white"
      style={{
        fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
        backgroundColor: userPreferences.preferredLayoutStyle === 'minimal' ? '#fafafa' : 
                        userPreferences.preferredLayoutStyle === 'detailed' ? '#f0f9ff' : 'white'
      }}
    >
      <section 
        className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8"
        style={{
          background: `linear-gradient(135deg, ${userPreferences.preferredColors?.[0] || '#3b82f6'}10, ${userPreferences.preferredColors?.[1] || '#10b981'}10)`
        }}
      >
        <div className="lg:w-1/2 lg:pr-12">
          <h1 
            className="text-4xl font-bold mb-4 animate-fade-in hover:animate-image-zoom transition-all duration-300"
            style={{
              fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
              color: userPreferences.preferredColors?.[0] || 'inherit',
              textShadow: userPreferences.preferredLayoutStyle === 'detailed' ? '2px 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Learning that gets you
          </h1>
          <p 
            className="text-xl animate-slide-up hover:animate-color-shift transition-all duration-500"
            style={{
              fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
              color: userPreferences.preferredColors?.[1] || 'inherit',
              lineHeight: userPreferences.preferredLayoutStyle === 'detailed' ? '1.8' : '1.5'
            }}
          >
            Skills for your present and your future. Get Started with US
          </p>
        </div>
        <div 
          className="lg:w-full mb-8 lg:mb-0"
          onClick={() => tracker.trackImageView()}
        >
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer hover:animate-image-zoom animate-smooth-float"
            style={{
              border: `3px solid ${userPreferences.preferredColors?.[0] || '#3b82f6'}`,
              borderRadius: userPreferences.preferredLayoutStyle === 'minimal' ? '8px' : '16px',
              transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                               userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
            }}
          />
        </div>
      </section>
      <section 
        className="py-8 px-4 lg:px-8"
        style={{
          backgroundColor: userPreferences.preferredLayoutStyle === 'minimal' ? '#f8fafc' : 
                          userPreferences.preferredLayoutStyle === 'detailed' ? '#e0f2fe' : '#f3f4f6',
          background: userPreferences.preferredLayoutStyle === 'classic' ? 
                     `linear-gradient(45deg, ${userPreferences.preferredColors?.[0] || '#3b82f6'}15, ${userPreferences.preferredColors?.[1] || '#10b981'}15)` : 
                     userPreferences.preferredLayoutStyle === 'modern' ? 
                     `radial-gradient(circle at top, ${userPreferences.preferredColors?.[0] || '#3b82f6'}08, transparent 50%)` : 
                     '#f3f4f6'
        }}
      >
        <h2 
          className="text-2xl font-bold mb-6 text-center"
          style={{
            fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
            color: userPreferences.preferredColors?.[0] || 'inherit',
            textShadow: userPreferences.preferredLayoutStyle === 'detailed' ? '1px 1px 2px rgba(0,0,0,0.1)' : 'none',
            position: 'relative'
          }}
        >
          <span 
            className="inline-block"
            style={{
              borderBottom: `3px solid ${userPreferences.preferredColors?.[1] || '#10b981'}`,
              paddingBottom: '8px'
            }}
          >
            Course Categories
          </span>
        </h2>
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          style={{
            gap: userPreferences.preferredLayoutStyle === 'detailed' ? '24px' : '16px'
          }}
        >
          {courseCategories.map((categoryItem, index) => (
            <Button
              className="justify-start hover:scale-105 transition-all duration-300 group relative overflow-hidden hover:animate-input-focus hover:animate-button-press animate-hierarchy-slide"
              variant="outline"
              key={categoryItem.id}
              onClick={() => {
                tracker.trackClick({ classList: { contains: () => false }, closest: () => true });
                tracker.trackEntryPoint();
                tracker.trackActivityNoticeability();
                handleNavigateToCoursesPage(categoryItem.id);
              }}
              style={{
                fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
                borderColor: userPreferences.preferredColors?.[0] || 'inherit',
                color: userPreferences.preferredColors?.[0] || 'inherit',
                backgroundColor: userPreferences.preferredLayoutStyle === 'detailed' ? 
                               `${userPreferences.preferredColors?.[0] || '#3b82f6'}05` : 'transparent',
                borderWidth: userPreferences.preferredLayoutStyle === 'detailed' ? '2px' : '1px',
                borderRadius: userPreferences.preferredLayoutStyle === 'minimal' ? '6px' : 
                            userPreferences.preferredLayoutStyle === 'detailed' ? '12px' : '8px',
                transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                 userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms',
                position: 'relative',
                zIndex: 1
              }}
            >
              <span 
                className="relative z-10"
                style={{
                  fontWeight: userPreferences.preferredLayoutStyle === 'detailed' ? '600' : '500'
                }}
              >
                {categoryItem.label}
              </span>
              {/* Gestalt - Visual grouping effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${userPreferences.preferredColors?.[0] || '#3b82f6'}20, ${userPreferences.preferredColors?.[1] || '#10b981'}20)`,
                  transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                   userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
                }}
              />
              {/* Activity Noticeability - Pulse effect */}
              <div 
                className="absolute top-1 right-1 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 animate-pulse"
                style={{
                  backgroundColor: userPreferences.preferredColors?.[2] || '#8b5cf6'
                }}
              />
            </Button>
          ))}
        </div>
      </section>
      <section 
        className="py-12 px-4 lg:px-8"
        style={{
          backgroundColor: userPreferences.preferredLayoutStyle === 'minimal' ? '#ffffff' : 
                          userPreferences.preferredLayoutStyle === 'detailed' ? '#f8fafc' : '#ffffff',
          background: userPreferences.preferredLayoutStyle === 'modern' ? 
                     `linear-gradient(180deg, transparent 0%, ${userPreferences.preferredColors?.[0] || '#3b82f6'}03 100%)` : 
                     'transparent'
        }}
      >
        <h2 
          className="text-2xl font-bold mb-6 text-center"
          style={{
            fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
            color: userPreferences.preferredColors?.[0] || 'inherit',
            textShadow: userPreferences.preferredLayoutStyle === 'detailed' ? '1px 1px 2px rgba(0,0,0,0.1)' : 'none',
            position: 'relative'
          }}
        >
          <span 
            className="inline-block"
            style={{
              borderBottom: `3px solid ${userPreferences.preferredColors?.[1] || '#10b981'}`,
              paddingBottom: '8px'
            }}
          >
            Featured Courses
          </span>
        </h2>
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{
            gap: userPreferences.preferredLayoutStyle === 'detailed' ? '32px' : '24px'
          }}
        >
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem, index) => (
              <div
                onClick={() => {
                  tracker.trackClick({ classList: { contains: () => false }, closest: () => true });
                  tracker.trackGestalt();
                  tracker.trackHierarchy();
                  tracker.trackTransitionNavigation();
                  handleCourseNavigate(courseItem?._id);
                }}
                className="border rounded-lg overflow-hidden shadow cursor-pointer hover:scale-105 transition-all duration-300 group relative hover:animate-group-hover hover:animate-hierarchy-slide hover:animate-smooth-scale animate-smooth-scale"
                style={{
                  fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
                  borderColor: userPreferences.preferredColors?.[0] || '#e5e7eb',
                  borderWidth: userPreferences.preferredLayoutStyle === 'detailed' ? '2px' : '1px',
                  borderRadius: userPreferences.preferredLayoutStyle === 'minimal' ? '8px' : 
                              userPreferences.preferredLayoutStyle === 'detailed' ? '16px' : '12px',
                  backgroundColor: userPreferences.preferredLayoutStyle === 'detailed' ? 
                                 `${userPreferences.preferredColors?.[0] || '#3b82f6'}02` : 'white',
                  boxShadow: userPreferences.preferredLayoutStyle === 'detailed' ? 
                            `0 8px 25px ${userPreferences.preferredColors?.[0] || '#3b82f6'}20` : 
                            '0 4px 6px rgba(0,0,0,0.1)',
                  transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                   userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {/* Visual Graphics - Image with enhanced styling */}
                <div 
                  className="relative overflow-hidden"
                  style={{
                    height: userPreferences.preferredLayoutStyle === 'detailed' ? '180px' : '160px'
                  }}
                >
                  <img
                    src={courseItem?.image}
                    width={300}
                    height={150}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform hover:animate-image-zoom"
                    onClick={(e) => {
                      e.stopPropagation();
                      tracker.trackImageView();
                    }}
                    style={{
                      transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                       userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
                    }}
                  />
                  {/* Activity Noticeability - Overlay on hover */}
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                    style={{
                      transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                       userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
                    }}
                  >
                    <div 
                      className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all hover:animate-attention-bounce"
                      style={{
                        backgroundColor: userPreferences.preferredColors?.[0] || '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                         userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
                      }}
                    >
                      View Course
                    </div>
                  </div>
                  {/* Entry Point - Price badge */}
                  <div 
                    className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold hover:animate-input-focus animate-attention-pulse"
                    style={{
                      backgroundColor: userPreferences.preferredColors?.[2] || '#8b5cf6',
                      color: 'white',
                      fontFamily: userPreferences.preferredFonts?.[0] || 'inherit'
                    }}
                  >
                    ${courseItem?.pricing}
                  </div>
                </div>
                
                {/* Content with Hierarchy */}
                <div 
                  className="p-4"
                  style={{
                    padding: userPreferences.preferredLayoutStyle === 'detailed' ? '20px' : '16px'
                  }}
                >
                  <h3 
                    className="font-bold mb-2 group-hover:text-blue-600 transition-colors"
                    style={{
                      fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
                      color: userPreferences.preferredColors?.[0] || 'inherit',
                      fontSize: userPreferences.preferredLayoutStyle === 'detailed' ? '18px' : '16px',
                      lineHeight: userPreferences.preferredLayoutStyle === 'detailed' ? '1.4' : '1.3',
                      transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                       userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
                    }}
                  >
                    {courseItem?.title}
                  </h3>
                  <p 
                    className="text-sm mb-2"
                    style={{
                      fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
                      color: userPreferences.preferredColors?.[1] || '#6b7280',
                      fontSize: userPreferences.preferredLayoutStyle === 'detailed' ? '15px' : '14px'
                    }}
                  >
                    {courseItem?.instructorName}
                  </p>
                  <div 
                    className="flex items-center justify-between"
                    style={{
                      marginTop: userPreferences.preferredLayoutStyle === 'detailed' ? '12px' : '8px'
                    }}
                  >
                    <p 
                      className="font-bold text-lg"
                      style={{
                        color: userPreferences.preferredColors?.[2] || '#000',
                        fontFamily: userPreferences.preferredFonts?.[0] || 'inherit',
                        fontSize: userPreferences.preferredLayoutStyle === 'detailed' ? '20px' : '16px'
                      }}
                    >
                      ${courseItem?.pricing}
                    </p>
                    {/* Perceptive Animation - Arrow icon */}
                    <div 
                      className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all hover:animate-smooth-scale"
                      style={{
                        color: userPreferences.preferredColors?.[0] || '#3b82f6',
                        transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                         userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
                      }}
                    >
                      →
                    </div>
                  </div>
                </div>
                
                {/* Gestalt - Visual grouping border */}
                <div 
                  className="absolute inset-0 border-2 border-transparent group-hover:border-opacity-50 rounded-lg"
                  style={{
                    borderColor: userPreferences.preferredColors?.[0] || '#3b82f6',
                    transitionDuration: userPreferences.preferredAnimationSpeed === 'slow' ? '500ms' : 
                                     userPreferences.preferredAnimationSpeed === 'fast' ? '100ms' : '200ms'
                  }}
                />
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
