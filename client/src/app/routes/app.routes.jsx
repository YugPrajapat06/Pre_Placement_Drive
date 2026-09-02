import { createBrowserRouter } from "react-router";
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import Landing from "../../features/landing/pages/Landing";
import Deshboard from "../../features/assissment/pages/Deshboard";
import Assessment from "../../features/assissment/pages/Assessment";
import Interview from "../../features/assissment/pages/Interview";
import AssessmentDetail from "../../features/assissment/pages/AssessmentDetail";
import TakeAssessment from "../../features/assissment/pages/TakeAssessment";
import Protected from "../components/Protected";
import DashboardLayout from "../layouts/DashboardLayout";
import Admin from "../../features/admin/pages/Admin";
import AddQuestion from "../../features/admin/pages/AddQuestion";
import Skill from "../../features/skill-build/pages/Skill";
import SkillTest from "../../features/skill-build/pages/SkillTest";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        // Standalone active assessment page (no sidebar)
        path: "/assessment/:id/take",
        element: (
            <Protected>
                <TakeAssessment />
            </Protected>
        )
    },
    {
        // Dashboard shell — sidebar lives here
        element: (
            <Protected>
                <DashboardLayout />
            </Protected>
        ),
        children: [
            {
                path: "/home",
                element: <Deshboard />
            },
            {
                path: "/assessment",
                element: <Assessment />
            },
            {
                path: "/assessment/:id",
                element: <AssessmentDetail />
            },
            {
                path: "/interview",
                element: <Interview />
            },
            {
                path: "/admin",
                element: <Admin />
            },
            {
                path: "/admin/add-question",
                element: <AddQuestion />
            },
            {
                path: "/skill-building",
                element: <Skill/>
            },
            {
                path: "/skill-building/:id",
                element: <SkillTest/>
            }
        ],
    },
]);