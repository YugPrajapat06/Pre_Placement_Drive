import { createBrowserRouter } from "react-router";
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import Landing from "../../features/landing/pages/Landing";
import StartAss from "../../features/assissment/pages/StartAss";
import Assessment from "../../features/assissment/pages/Assessment";
import Interview from "../../features/assissment/pages/Interview";
import AssessmentDetail from "../../features/assissment/pages/AssessmentDetail";
import TakeAssessment from "../../features/assissment/pages/TakeAssessment";
import Protected from "../components/Protected";
import DashboardLayout from "../layouts/DashboardLayout";

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
                element: <StartAss />
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
        ],
    },
]);