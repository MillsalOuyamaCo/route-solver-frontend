import React from "react";

// reactstrap components
import {
    Button,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardSubtitle,
    CardTitle,
    CardText,
    CardFooter,
    UncontrolledTooltip,
    UncontrolledCollapse,
    ListGroup,
    ListGroupItem,
    Badge
} from "reactstrap";

function OptimizedRoutesInfo(props) {
    const TravellerRouteContent = (props) => {
        const travellersRoutes = props.travellersRoutes;
        return (
                <ListGroup>
                    {travellersRoutes.map((route, index) => {
                        return (
                            <ListGroupItem key={index}>
                                <CardText>
                                    {index + 1} - {route.address_line}, {route.address_number}, {route.neighborhood}
                                </CardText>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
        );
    }

    return (
        <>
            <Row>
                {console.log("optimized travellers found in info: " + JSON.stringify(props.optimizedTravellerArray))}
                {props.optimizedTravellerArray.map((traveller, index) => {
                    return (
                        <Col key={traveller.employee_id} md={4}>
                            <Card>
                                <CardHeader id={`route${traveller.employee_id}`}>
                                    <CardTitle tag="h4">{traveller.first_name} {traveller.last_name}</CardTitle>
                                    <CardSubtitle tag="h5" className="text-info">{traveller.email}</CardSubtitle>
                                </CardHeader>
                                <UncontrolledCollapse toggler={`#route${traveller.employee_id}`}>
                                    <CardBody>
                                        <hr />
                                        <TravellerRouteContent
                                            travellerId={traveller.id}
                                            travellersRoutes={traveller.addresses}
                                        />
                                        <hr />
                                    </CardBody>
                                </UncontrolledCollapse>
                                <CardFooter>
                                </CardFooter>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    )
}

export default OptimizedRoutesInfo;