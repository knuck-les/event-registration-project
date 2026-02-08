import { RouteObject } from "react-router-dom";
import Signup from "../components/signup/signup";
import CreateEvent from "../components/createEvent/CreateEvent";
import Registrations from "../components/myRegistrations/registrations";

const MainRoutes : RouteObject[] = [
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/new-event",
        element: <CreateEvent />,
    },
    {
        path: "/events/:id/edit",
        element: <CreateEvent />,
    },
    {
        path: "/my-registrations",
        element: <Registrations />,
    }
];

export default MainRoutes;