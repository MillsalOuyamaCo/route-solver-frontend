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

const VisitPointInfo = (props) => {
    const { getAccessTokenSilently } = useAuth0();
    const [visitPointToDelete, setVisitPointToDelete] = useState();
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [isLoadingDeletion, setIsLoadingDeletion] = useState(false);
    const [showDeleteModalSuccess, setShowDeleteModalSuccess] = useState(false);
    const [showDeleteModalFailed, setShowDeleteModalFailed] = useState(false);
    const [deleteModalFailureMessage, setDeleteModalFailureMessage] = useState('');

    const submitDelete = async (visitPoint) => {
        console.log("Deletando");
        setIsLoadingDeletion(true);
        const token = await getAccessTokenSilently();

        routeSolverApis.delete(`lat-lon/${visitPoint._id}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(response => {
                setShowDeleteConfirmationModal(false);
                setShowDeleteModalSuccess(true);
                props.handleVisitPointsChanged();
                setIsLoadingDeletion(false);
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
                setIsLoadingDeletion(false);
            });
    }

    const RenderCardHearder = (props) => {
        if (props.visitPoint.addresses_custom_properties !== null) {
            if (typeof (props.visitPoint.addresses_custom_properties.address_nickname) !== undefined &&
                props.visitPoint.addresses_custom_properties.address_nickname !== null) {
                return (
                    <>
                        <CardTitle tag="h4">{props.visitPoint.addresses_custom_properties.address_nickname}</CardTitle>
                        <CardSubtitle tag="h5" className="text-info">{props.visitPoint.address_line}, {props.visitPoint.address_number}</CardSubtitle>
                    </>
                );
            } else {
                return (
                    <>
                        <CardTitle tag="h4">{props.visitPoint.address_line}</CardTitle>
                        <CardSubtitle tag="h5" className="text-info">{props.visitPoint.address_number}</CardSubtitle>
                    </>
                );
            }
        } else {
            return (
                <>
                    <CardTitle tag="h4">{props.visitPoint.address_line}</CardTitle>
                    <CardSubtitle tag="h5" className="text-info">{props.visitPoint.address_number}</CardSubtitle>
                </>
            );
        }
    }

    const RenderPhoneNumber = (props) => {
        if (props.visitPoint.addresses_custom_properties !== null) {
            if (typeof (props.visitPoint.addresses_custom_properties.address_phone_number) !== undefined &&
                props.visitPoint.addresses_custom_properties.address_phone_number !== null) {
                return (
                    <CardText><strong className="font-weight-bold">Telefone: </strong> {props.visitPoint.addresses_custom_properties.address_phone_number}</CardText>
                );
            }
            else {
                return (
                    <>
                    </>
                );
            }
        }
        else {
            return (
                <>
                </>
            );
        }
    }

    return (
        <Row>
            { props.visitPoints.map((visitPoint, key) => {
                return (
                    <Col key={visitPoint._id} md={4}>
                        <Card>
                            <CardHeader id={`point${visitPoint._id}`}>
                                <RenderCardHearder
                                    visitPoint={visitPoint}
                                />
                            </CardHeader>
                            <UncontrolledCollapse toggler={`#point${visitPoint._id}`}>
                                <CardBody>
                                    <hr />
                                    <CardText>
                                        <strong className="font-weight-bold">País: </strong> {visitPoint.country_region}
                                    </CardText>
                                    <CardText><strong className="font-weight-bold">Estado: </strong> {visitPoint.admin_district}</CardText>
                                    <CardText><strong className="font-weight-bold">Cidade: </strong> {visitPoint.locality}</CardText>
                                    <CardText><strong className="font-weight-bold">CEP: </strong> {visitPoint.postal_code}</CardText>
                                    <CardText><strong className="font-weight-bold">Bairro: </strong> {visitPoint.neighborhood}</CardText>
                                    <RenderPhoneNumber
                                        visitPoint={visitPoint}
                                    />
                                    <CardText><strong className="font-weight-bold">Latitude: </strong> {visitPoint.lat_lon_info.latitude}</CardText>
                                    <CardText><strong className="font-weight-bold">Longitude: </strong> {visitPoint.lat_lon_info.longitude}</CardText>
                                    <hr />
                                    <Button
                                        className="btn-round btn-icon btn-icon-mini btn-neutral pull-right"
                                        color="danger"
                                        id="tooltip923217206"
                                        type="button"
                                        onClick={() => {
                                            setVisitPointToDelete(visitPoint);
                                            setShowDeleteConfirmationModal(true);
                                        }}
                                    >
                                        <i className="now-ui-icons ui-1_simple-remove" />
                                    </Button>
                                    <UncontrolledTooltip
                                        target="tooltip923217206"
                                    >
                                        Excluir Ponto de Visita
                                    </UncontrolledTooltip>
                                </CardBody>
                            </UncontrolledCollapse>

                            <CardFooter>
                            </CardFooter>
                        </Card>
                    </Col>
                );
            })}

            {
                visitPointToDelete != null &&
                <Modal
                    isOpen={showDeleteConfirmationModal}
                    centered
                >
                    <ModalBody>
                        Deseja excluir o ponto de visita {visitPointToDelete.address_line} {visitPointToDelete.address_number}?
                    </ModalBody>
                    <ModalFooter>

                        {
                            isLoadingDeletion === true ?
                                <Button
                                    color="info"
                                    className="btn-round pull-right"
                                    disabled
                                >
                                    <Spinner
                                        size="sm"
                                        color="light"
                                        className="pull-right"
                                    />
                                Deletando...
                            </Button>
                                :
                                <>
                                    <Button
                                        className="btn-round pull-right"
                                        color="danger"
                                        onClick={() => { setShowDeleteConfirmationModal(false); }}
                                    >
                                        Não
                                    </Button>
                                    <Button
                                        className="btn-round pull-right"
                                        color="info"
                                        onClick={() => { submitDelete(visitPointToDelete); }}
                                    >
                                        Sim
                                    </Button>
                                </>
                        }
                    </ModalFooter>
                </Modal>
            }

            <Modal
                isOpen={showDeleteModalSuccess}
                centered
            >
                <ModalBody>
                    Ponto de visita excluído com sucesso!
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn-round pull-right"
                        color="info"
                        onClick={() => { setShowDeleteModalSuccess(false); }}
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
                        onClick={() => { setShowDeleteModalFailed(false); }}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        </Row>
    );
}

export default VisitPointInfo;