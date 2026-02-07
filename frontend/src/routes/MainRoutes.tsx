import { RouteObject } from "react-router-dom";
import Signup from "../components/signup/signup";

const MainRoutes : RouteObject[] = [
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/events/:id",
        element: <div>Events Page</div>,
    }
];

export default MainRoutes;