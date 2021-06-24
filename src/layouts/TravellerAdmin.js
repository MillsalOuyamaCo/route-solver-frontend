import React, { useState } from "react";
// reactstrap components
import { Switch, Redirect, Route } from "react-router-dom";

// core components
import TravellerNavbar from "components/Navbars/TravellerDashNavbar";
import Footer from "components/Footers/Footer.js";
import Sidebar from "components/Sidebar/TravellerAdminSidebar";

import routes from "travellerRoutes.js";

const TravellerDashboard = (props) => {
    const [backGroundColor, setBackGroundColor] = useState("blue");
    let mainPanel = React.createRef();
    return (
        <div className="wrapper">
            {/* <Sidebar
                {...props}
                routes={routes}
                backgroundColor={backGroundColor}
            /> */}
            <div className="main-panel" ref={mainPanel}>
                {/* <TravellerNavbar {...props} /> */}
                <Switch>
                    {routes.map((prop, key) => {
                        return (
                            <Route
                                path={prop.layout + prop.path}
                                component={prop.component}
                                key={key}
                            />
                        );
                    })}
                    <Redirect from="/traveller-admin" to="/traveller-admin/traveller-dashboard" />
                </Switch>
            </div>
        </div>
    );
}

export default TravellerDashboard;