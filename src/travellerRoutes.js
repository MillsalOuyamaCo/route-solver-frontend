import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import Maps from "views/Maps.js";
import UserPage from "views/UserPage.js";
import TravellerDashboard from "views/TravellerDashboard.js";

var travellerRoutes = [
  {
    path: "/traveller-dashboard",
    name: "TravellerDashboard",
    icon: "design_app",
    component: TravellerDashboard,
    layout: "/traveller-admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "design_image",
    component: Icons,
    layout: "/traveller-admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "location_map-big",
    component: Maps,
    layout: "/traveller-admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "ui-1_bell-53",
    component: Notifications,
    layout: "/traveller-admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "users_single-02",
    component: UserPage,
    layout: "/traveller-admin",
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "design-2_ruler-pencil",
    component: Typography,
    layout: "/traveller-admin",
  },
];
export default travellerRoutes;