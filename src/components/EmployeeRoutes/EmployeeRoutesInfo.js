import React, { useState } from 'react';

// reactstrap components
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardSubtitle,
    CardText,
    CardFooter,
    UncontrolledCollapse,
    Button,
    UncontrolledTooltip,
    Modal,
    ModalBody,
    ModalFooter,
    Spinner
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const EmployeeRoutesInfo = (props) => {
    const { getAccessTokenSilently } = useAuth0();

    const TravellerRouteContent = (props) => {
        console.log("props.travellerRoutes: " + props.travellersWithRouteArrays);
        const travellerId = props.travellerId;
        const travellersRoutes = props.travellersWithRouteArrays;
        const travellerRoute = travellersRoutes.map(route => route.employee_id === travellerId);
        console.log("traveller route: " + travellerRoute);
        const routeIsFilled = (!Array.isArray(travellerRoute) && !travellerRoute.length);
        
        console.log("routeIsFilled: " + routeIsFilled);

        if (routeIsFilled) {
            console.log("rendering null travellr route");
            return (
                <CardText><strong className="font-weight-bold">Nenhuma rota encontrada para este Viajante</strong></CardText>
            );
        } else {
            console.log("rendering some route");
            return (
                <CardText></CardText>
            );
        }
    }

    return (
        <>
            { props.travellersInfosArrays.map((travellers, key) => {
                return (
                    <Row key={key}>
                        { travellers.map((traveller) => {
                            return (
                                <Col key={traveller.id} md={4}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle tag="h4">{traveller.first_name} {traveller.last_name}</CardTitle>
                                            <CardSubtitle tag="h5" className="text-info">{traveller.email}</CardSubtitle>
                                        </CardHeader>
                                        <CardBody>
                                            <hr />
                                            <TravellerRouteContent
                                                travellerId={traveller.id}
                                                travellersRoutes={props.travellersRoutes}
                                            />
                                            <hr />
                                            <Button
                                                className="btn-round btn-icon btn-icon-mini btn-neutral pull-right"
                                                color="danger"
                                                id="tooltip923217206"
                                                type="button"
                                                onClick={() => {
                                                }}
                                            >
                                                <i className="now-ui-icons ui-1_simple-remove" />
                                            </Button>
                                            <UncontrolledTooltip
                                                target="tooltip923217206"
                                            >
                                                Excluir Pontos de Visita de Viajante
                                                </UncontrolledTooltip>
                                            <Button
                                                className="btn-round btn-icon btn-icon-mini btn-neutral pull-right"
                                                color="success"
                                                id="tooltip923217207"
                                                type="button"
                                                onClick={() => {
                                                }}
                                            >
                                                <i className="now-ui-icons ui-1_simple-add" />
                                            </Button>
                                            <UncontrolledTooltip
                                                target="tooltip923217207"
                                            >
                                                Adicionar Pontos de Visita para Viajante
                                                </UncontrolledTooltip>
                                        </CardBody>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                );
            })
            }
        </>
    );
}

export default EmployeeRoutesInfo;