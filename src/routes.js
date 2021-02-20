/*!

=========================================================
* Now UI Dashboard React - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import Maps from "views/Maps.js";
import UserPage from "views/UserPage.js";
import EmployeePage from "views/EmployeePage.js";
import EmployeeRoutes from "views/EmployeeRoutesPage.js";
import VisitPoints from "views/VisitPointsPage.js";
import OptmizedRoutes from "views/OptmizedRoutesPage.js";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "design_image",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "location_map-big",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "ui-1_bell-53",
    component: Notifications,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "users_single-02",
    component: UserPage,
    layout: "/admin",
  },
  {
    path: "/employees",
    name: "Funcionários",
    icon: "users_single-02",
    component: EmployeePage,
    layout: "/admin",
  },
  {
    path: "/visit-points",
    name: "Pontos de Visita",
    icon: "location_map-big",
    component: VisitPoints,
    layout: "/admin",
  },
  {
    path: "/routes",
    name: "Rotas",
    icon: "location_world",
    component: EmployeeRoutes,
    layout: "/admin",
  },
  {
    path: "/optmized-routes",
    name: "Rotas Otimizadas",
    icon: "location_compass-05",
    component: OptmizedRoutes,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "design-2_ruler-pencil",
    component: Typography,
    layout: "/admin",
  },
];
export default dashRoutes;
