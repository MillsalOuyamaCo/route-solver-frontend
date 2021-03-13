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
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";

import routeSolverApis from "services/routeSolverApis";
import { useAuth0 } from "@auth0/auth0-react";

const EmployeeRoutesRegister = (props) => {
    const { getAccessTokenSilently } = useAuth0();
    const [isSaving, setIsSaving] = useState(false);
    const [openSucessModal, setOpenSucessModal] = useState(false);
    const [openFailureModal, setOpenFailureModal] = useState(false);
    const [failureMessage, setFailureMessage] = useState('');
    const [stringVisitPointToSearch, setStringVisitPointToSearch] = useState('');
    const [visitPointFiltered, setVisitPointFiltered] = useState([]);

    //const visitPoints = props.visitPoints.map(obj => ({...obj, isSelected: false}));

    const visitPointsToShow = stringVisitPointToSearch == null || stringVisitPointToSearch.trim() === "" ? props.visitPoints : visitPointFiltered;

    const closeModal = () => {
        props.handleCloseModal();
    }

    const closeSuccessModal = () => {
        props.handleChangedRoutes();
        setOpenSucessModal(false);
        props.handleCloseModal();
    }

    const closeFailureModal = () => {
        setOpenFailureModal(false);
        props.handleCloseModal();
    }

    const closeBtn = <button className="close" onClick={closeModal}>&times;</button>;
    let addressesToSave = [];

    const handleAddressToTraveller = (isSelected, route) => {
        if (!isSelected) {
            let routeToSave = {
                lat_lon: route.lat_lon_info,
                country_region: route.country_region,
                admin_district: route.admin_district,
                locality: route.locality,
                postal_code: route.locality,
                neighborhood: route.neighborhood,
                address_line: route.address_line,
                address_number: route.address_number
            };
            addressesToSave.push(routeToSave);
            console.log("addressToSave added route = " + JSON.stringify(route));
            console.log("addressToSave added array = " + JSON.stringify(addressesToSave));
        }
        else {
            let listWithoutPoint = addressesToSave.filter(routeToSave => routeToSave.address_line !== route.address_line &&
                routeToSave.address_number !== route.address_number &&
                routeToSave.neighborhood !== route.neighborhood);

            addressesToSave = listWithoutPoint;
            console.log("addressToSave removed = " + JSON.stringify(addressesToSave));
        }
    }

    const getToken = async () => {
        const tempToken = await getAccessTokenSilently({
            audiece: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:users",
        });

        return tempToken;
    }

    const saveTravellersWithRoutes = async (travellerToSave) => {
        setIsSaving(true);
        const token = await getToken();

        routeSolverApis.post("employees-points", {
            employee_id: travellerToSave.id,
            customer_id: travellerToSave.customer_id,
            first_name: travellerToSave.first_name,
            last_name: travellerToSave.last_name,
            registration_id: travellerToSave.registration_id,
            addresses: addressesToSave
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setIsSaving(false);
                setOpenSucessModal(true);
            })
            .catch(error => {
                if (error.response) {
                    console.log("Erro ao excluir ponto de visita. " + error.response.data);
                    setFailureMessage("Erro ao excluir ponto de visita. " + error.response.data);
                } else {
                    console.log("Erro ao excluir ponto de visita: " + error);
                    setFailureMessage("Erro ao excluir ponto de visita: " + error);
                }
                setOpenFailureModal(true);
                setIsSaving(false);
            });
    }

    const searchPoint = (e) => {
        e.preventDefault();
        //setStringVisitPointToSearch(e.target.value);

        let filteredPoint = props.visitPoints.map(visitPointsPerRow => {
            let points = visitPointsPerRow.filter(point => {
                return point.address_line.toLowerCase().includes(e.target.value.toLowerCase())
            });

            return points;
        });

        setVisitPointFiltered(filteredPoint);
    }

    const RoutesToSelect = (props) => {
        const [isSelected, setIsSelected] = useState(props.route.is_selected);

        return (
            <>
                <Card
                    inverse={isSelected}
                    color={isSelected ? "info" : ""}
                    onClick={() => {
                        props.route.is_selected = !props.route.is_selected;
                        setIsSelected(props.route.is_selected);
                        console.log("valor do is_selected: " + props.route.is_selected);
                        console.log("valor do isSelected" + isSelected);
                        handleAddressToTraveller(isSelected, props.route);
                    }}
                >
                    <CardHeader id={`point${props.route._id}`}>
                        <CardTitle tag="h4">{props.route.address_line}</CardTitle>
                        <CardSubtitle tag="h5" className={props.route.is_selected ? "" : "text-info"}>{props.route.address_number}</CardSubtitle>
                    </CardHeader>
                    <CardBody>
                        <hr />
                        <CardText>
                            <strong className="font-weight-bold">País: </strong> {props.route.country_region}
                        </CardText>
                        <CardText><strong className="font-weight-bold">Bairro: </strong> {props.route.neighborhood}</CardText>
                        <hr />
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </Card>
            </>
        );
    }

    return (
        <>
            <Modal
                isOpen={props.open}
                centered
                size="lg"
            >
                {props.traveller != null &&
                    <ModalHeader close={closeBtn}>
                        Selecione os Pontos de Visita para o Viajante {props.traveller.first_name} {props.traveller.last_name}
                    </ModalHeader>
                }
                <ModalBody>
                <Row>
                    <Col md="12">
                        <Card
                            className="pr-1"
                            md="5"
                        >
                            <CardHeader>
                                <h5 className="title">Buscar Ponto de Visita</h5>
                            </CardHeader>
                            <CardBody>
                                <Form action="" className="form" method="" onSubmit={searchPoint}>
                                    <Row>
                                        <Col>
                                            <InputGroup
                                                className={"no-border input-lg"}
                                            >
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="now-ui-icons ui-1_zoom-bold">
                                                        </i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Consulta por Nome do Ponto"
                                                    type="text"
                                                    onChange={(e) => { setStringVisitPointToSearch(e.target.value); searchPoint(e) }}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                    {visitPointsToShow.map((pointsRow, key) => { 
                        return (
                            <Row key={key}>
                                { pointsRow.map((point) =>
                                    <Col key={point._id} md="4">
                                        <RoutesToSelect
                                            route={point}
                                            traveller={props.traveller}
                                        />
                                    </Col>
                                )}
                            </Row>
                        );
                    })}
                    <Button
                        color="info"
                        className="btn-round pull-right"
                        onClick={(e) => {
                            saveTravellersWithRoutes(props.traveller);
                            e.preventDefault();
                        }}
                    >
                        Salvar
                </Button>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={isSaving}
                centered
                size="md"
            >
                <ModalBody>
                    <Row>
                        <Col md={2}>
                            <Spinner color="primary" />
                        </Col>
                        <Col md={10}>
                            {props.traveller != null &&
                                <strong className="font-weight-bold">
                                    Salvando rotas para o viajante {props.traveller.first_name} {props.traveller.last_name}
                                </strong>
                            }
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={openFailureModal}
                centered
                size="md"
            >
                <ModalBody>
                    <Row>
                        {props.traveller != null &&
                            <>
                                <strong className="font-weight-bold">
                                    Erro ao salvar rotas para o viajante {props.traveller.first_name} {props.traveller.last_name}:
                                </strong>
                                {failureMessage}
                            </>
                        }
                    </Row>
                    <Button
                        color="danger"
                        className="btn-round pull-right"
                        onClick={() => closeFailureModal()}
                    >
                        Ok
                    </Button>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={openSucessModal}
                centered
                size="md"
            >
                <ModalBody>
                    {props.traveller != null &&
                        <strong className="font-weight-bold">
                            Rota salva para o viajante {props.traveller.first_name} {props.traveller.last_name}
                        </strong>
                    }

                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        className="btn-round pull-right"
                        onClick={() => closeSuccessModal()}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default EmployeeRoutesRegister;