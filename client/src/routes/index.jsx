import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                exact: true,
                element: <Home />
            },
            {
                path: "/about",
                element: (<div> I am about Page</div>)
            }
        ]
    }
])

export default router;