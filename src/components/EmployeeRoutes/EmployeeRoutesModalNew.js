import React, { useState, useEffect } from 'react';

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
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const customerIdAttribute = process.env.REACT_APP_AUTH0_CUSTOMER_ID_ATTRIBUTE;
    let customerId = user[customerIdAttribute];

    const [userInfo, setUserInfo] = React.useState(user);
    const [travellersInfosArrays, setTravellersInfosArrays] = useState([]);

    const [openEmployeeRouteRegister, setOpenEmployeeRouteRegister] = useState(false);

    const [travellerToRegisterPoint, setTravellerToRegisterPoint] = useState(null);

    const readTravellersInfo = async (customerId) => {
        const tempToken = await getAccessTokenSilently();
        console.log("Getting travellers... ");
        routeSolverApis.get(`customer/${customerId}/travellers`, {
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                //setTravellersInfo(response.data);
                setThreeTravellersPerRow(response.data);
            })
            .catch(error => {
                if (error.response) {
                    console.log("Erro ao buscar viajantes. " + error.response.data);
                } else {
                    console.log("Erro ao buscar viajantes: " + error);
                }
            });
    }

    const setThreeTravellersPerRow = (travellersInfo) => {
        const tempArray = [], size = 3;

        while (travellersInfo.length > 0) {
            tempArray.push(travellersInfo.splice(0, size));
        }

        setTravellersInfosArrays(tempArray);
        console.log("tempArray: " + tempArray);
    }

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
            />
        </>
    );
}

export default EmployeeRoutesModalNew;