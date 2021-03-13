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
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";
import routeSolverApis from "services/routeSolverApis";
import EmployeeRoutesRegister from 'components/EmployeeRoutes/EmployeeRoutesRegister.js';

const EmployeeRoutesModalNew = (props) => {
    const { user, getAccessTokenSilently } = useAuth0();

    const [openEmployeeRouteRegister, setOpenEmployeeRouteRegister] = useState(false);

    const [travellerToRegisterPoint, setTravellerToRegisterPoint] = useState(null);

    const closeModal = () => {
        props.handleCloseModal();
    }

    const closeBtn = <button className="close" onClick={closeModal}>&times;</button>;

    const registerVisitPoint = (traveller) => {
        closeModal();
        setTravellerToRegisterPoint(traveller);
        setOpenEmployeeRouteRegister(true);
    }

    const closeRegisterVisitPoint = () => {
        setOpenEmployeeRouteRegister(false);
    }

    return (
        <>
            <Modal
                isOpen={props.open}
                centered
                size="lg"
            >
                <ModalHeader close={closeBtn}>
                    Selecione um Viajante
                </ModalHeader>
                <ModalBody>
                    {props.travellersWithoutRouteArrays.map((travellers, key) => {
                        return (
                            <Row key={key}>
                                { travellers.map((traveller) => {
                                    return (
                                        <Col key={traveller.id} md={4}>
                                            <Card onClick={() => registerVisitPoint(traveller)}>
                                                <CardHeader>
                                                    <CardTitle tag="h4">{traveller.first_name} {traveller.last_name}</CardTitle>
                                                    <CardSubtitle tag="h5" className="text-info">{traveller.registration_id}</CardSubtitle>
                                                </CardHeader>
                                                <CardBody>
                                                    <CardText>{traveller.email}</CardText>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        );
                    })
                    }
                </ModalBody>
            </Modal>

            <EmployeeRoutesRegister
                open={openEmployeeRouteRegister}
                traveller={travellerToRegisterPoint}
                handleCloseModal={closeRegisterVisitPoint}
                visitPoints={props.visitPoints}
                handleChangedRoutes={props.handleChangedRoutes}
            />
        </>
    );
}

export default EmployeeRoutesModalNew;