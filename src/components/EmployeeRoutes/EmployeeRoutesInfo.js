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
import routeSolverApis from "services/routeSolverApis.js";

const EmployeeRoutesInfo = (props) => {
    const { getAccessTokenSilently } = useAuth0();

    const [isDeleting, setIsDeleting] = useState(false);
    const [travellerToDelete, setTravellerToDelete] = useState(null);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [showDeleteModalSuccess, setShowDeleteModalSuccess] = useState(false);
    const [showDeleteModalFailed, setShowDeleteModalFailed] = useState(false);
    const [deleteModalFailureMessage, setDeleteModalFailureMessage] = useState("");

    const TravellerRouteContent = (props) => {
        console.log("props.travellerRoutes: " + JSON.stringify(props.travellersRoutes));
        const travellersRoutes = props.travellersRoutes;
        console.log("traveller route: " + JSON.stringify(travellersRoutes));
        console.log("rendering some route");
        return (
            <>
                {travellersRoutes.map((route, index) => {
                    return (
                        <ul>
                            <li>
                                <CardText>
                                    {route.address_line}, {route.address_number}, {route.neighborhood}
                                </CardText>
                            </li>
                        </ul>
                    );
                })}
            </>
        );
    }

    const handleCloseConfirmationDeleteModal = () => {
        setShowDeleteModalSuccess(false);  
        props.handleChangedRoutes();
    }

    const submitDelete = async (id) => {
        setIsDeleting(true);
        setShowDeleteConfirmationModal(false);
        const token = await getAccessTokenSilently();

        routeSolverApis.delete(`employees-points/${id}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(response => {
                setIsDeleting(false);
                setShowDeleteModalSuccess(true);
            })
            .catch(error => {
                if (error.response) {
                    console.log("Erro ao excluir ponto de visita. " + error.response.data);
                    setDeleteModalFailureMessage("Erro ao excluir ponto de visita. " + error.response.data);
                } else {
                    console.log("Erro ao excluir ponto de visita: " + error);
                    setDeleteModalFailureMessage("Erro ao excluir ponto de visita: " + error);
                }
                setShowDeleteConfirmationModal(false);
                setShowDeleteModalFailed(true);
                setIsDeleting(false);
            });
    }

    return (
        <>
            { props.travellersWithRoutes.map((travellers, key) => {
                return (
                    <Row key={key}>
                        { travellers.map((traveller) => {
                            return (
                                <Col key={traveller.id} md={4}>
                                    <Card>
                                        <CardHeader id={`route${traveller.id}`}>
                                            <CardTitle tag="h4">{traveller.first_name} {traveller.last_name}</CardTitle>
                                            <CardSubtitle tag="h5" className="text-info">{traveller.email}</CardSubtitle>
                                        </CardHeader>
                                        <UncontrolledCollapse toggler={`#route${traveller.id}`}>
                                            <CardBody>
                                                <hr />
                                                <TravellerRouteContent
                                                    travellerId={traveller.id}
                                                    travellersRoutes={traveller.addresses}
                                                />
                                                <hr />
                                                <Button
                                                    className="btn-round btn-icon btn-icon-mini btn-neutral pull-right"
                                                    color="danger"
                                                    id="tooltip923217206"
                                                    type="button"
                                                    onClick={() => {
                                                        setTravellerToDelete(traveller);
                                                        setShowDeleteConfirmationModal(true);
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
                                                    color="info"
                                                    id="tooltip923217207"
                                                    type="button"
                                                    onClick={() => {
                                                    }}
                                                >
                                                    <i className="now-ui-icons ui-2_settings-90" />
                                                </Button>
                                                <UncontrolledTooltip
                                                    target="tooltip923217207"
                                                >
                                                    Alterar Pontos de Visita para Viajante
                                                </UncontrolledTooltip>
                                            </CardBody>
                                        </UncontrolledCollapse>
                                        <CardFooter>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                );
            })
            }

            {
                travellerToDelete != null &&
                <Modal
                    isOpen={showDeleteConfirmationModal}
                    centered
                    fade
                >
                    <ModalBody>
                        Deseja excluir os pontos de visita para o Viajante {travellerToDelete.first_name} {travellerToDelete.last_name}?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className="btn-round"
                            color="danger"
                            onClick={() => { setShowDeleteConfirmationModal(false);}}
                        >
                            Não
                        </Button>
                        <Button
                            className="btn-round pull-right"
                            color="info"
                            onClick={() => {
                                submitDelete(travellerToDelete.route_id);
                            }}
                        >
                            Sim
                        </Button>
                    </ModalFooter>
                </Modal>
            }

            <Modal
                isOpen={isDeleting}
                centered
                size="md"
            >
                <ModalBody>
                    <Row>
                        <Col md={2}>
                            <Spinner color="primary" />
                        </Col>
                        <Col md={10}>
                            {travellerToDelete != null &&
                                <strong className="font-weight-bold">
                                    Deletando rotas para o viajante {travellerToDelete.first_name} {travellerToDelete.last_name}
                                </strong>
                            }
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={showDeleteModalSuccess}
                centered
            >
                <ModalBody>
                    Rota excluída com sucesso!
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn-round pull-right"
                        color="info"
                        onClick={() => { handleCloseConfirmationDeleteModal() }}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal
                isOpen={showDeleteModalFailed}
                centered
            >
                <ModalBody>
                    {deleteModalFailureMessage}
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn-round pull-right"
                        color="danger"
                        onClick={() => { setShowDeleteModalFailed(false);}}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default EmployeeRoutesInfo;