import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

import NewsAndEvents from "../pages/Media/NewsAndEvents";

import Testimonials from "../pages/Achievements/Testimonials";
import Careers from "../pages/Careers/Careers";
import SecurityPrivacyPage from "../pages/Contact/SecurityAndPrivacy";
import Home from "../pages/Home/Home";
import NotFoundPage from "../pages/PageNotFounded";
import About from "../pages/About/About";
import AcademicPrograms from "../pages/Academic/AcademicProgram/AcademicPrograms";
import AwardsAndAchievements from "../pages/Achievements/AwardsAndAchievements";
import ContactUs from "../pages/Contact/ContactUs";
import Gallery from "../pages/Media/Gallery";
import TeacherList from "../pages/About/team/TeacherList";
import TeamProfilePage from "../pages/About/team/TeamProfilePage";
import TimetableTemplate from "../pages/Academic/AcademicProgram/Timtable";
import ProgramDetails from "../pages/Academic/AcademicProgram/ProgramDetails";
import StudentProjects from "../pages/Academic/StudentProject/StudentProject";
import ProjectDetail from "../pages/Academic/StudentProject/ProjectDetail";
import OnlineLibrary from "../pages/Academic/OnlineLibrary/OnlineLibrary";
import EducationalTrips from "../pages/Academic/EducatinalTrip/EducationalTrip";

function AppRouterProvider() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // <PrivateRoute>
        //   <AppInitializer>
        <AppLayout />
        //   </AppInitializer>
        // </PrivateRoute>
      ),
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/academic-programs", element: <AcademicPrograms /> },
        {
          path: "/academic-programs/program-details",
          element: <ProgramDetails />,
        },
        {
          path: "/class/:id",
          element: <TimetableTemplate />,
        },
        { path: "/news-and-events", element: <NewsAndEvents /> },
        { path: "/contact", element: <ContactUs /> },
        { path: "/gallery", element: <Gallery /> },
        { path: "/team", element: <TeacherList /> },
        { path: "/team/:id", element: <TeamProfilePage /> },
        {
          path: "/awards-and-achievements",
          element: <AwardsAndAchievements />,
        },
        { path: "/testimonials", element: <Testimonials /> },
        { path: "/careers", element: <Careers /> },
        { path: "/security-privacy-page", element: <SecurityPrivacyPage /> },
        { path: "/student-projects", element: <StudentProjects /> },
        { path: "/student-projects/:id", element: <ProjectDetail /> },
        { path: "/online-library", element: <OnlineLibrary /> },
        { path: "/educational-trips", element: <EducationalTrips /> },
      ],
    },
    // Add a catch-all route that redirects to login for unauthenticated users
  ]);

  return (
    // <AuthProvider>
    <RouterProvider router={router} />
    // </AuthProvider>
  );
}

export default AppRouterProvider;
