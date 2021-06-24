import React, { useState } from "react";
// reactstrap components
import {
    Card,
    CardBody,
    Row,
    Col,
    Button,
} from "reactstrap";

import { Route } from "react-router-dom";


const ButtonGps = (props) => {
    const [wazeDeepLink, setWazeDeepLink] = useState(`https://waze.com/ul?q=${props.visitPoint.latitude},${props.visitPoint.longitude}&navigate=yes&zoom=17`);
    const [wazeDeepLink2, setWazeDeepLink2] = useState(`https://waze.com/ul?ll=${props.visitPoint.latitude},${props.visitPoint.longitude}&navigate=yes&zoom=17`);

    const openGps = () => {
        var latitude = props.visitPoint.latitude;
        var longitude = props.visitPoint.longitude;

        return (
            <Route path='/waze' component={() => {
                window.location.href = `https://waze.com/ul?q=${latitude},${longitude}&navigate=yes&zoom=17`;
                return null;
            }} />
        );
    }


    return (
        <Row>
            <Col md={4}>
                <Card className="card-chart">
                    <CardBody>
                        {/* <Button className="btn-round" color="info" size="sm" block onClick={openGps}> */}
                        <Button className="btn-round" color="info" size="sm" block href={wazeDeepLink2}>
                            Ir para GPS!
                        </Button>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

export default ButtonGps;