import React from 'react';

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

const EmployeeRoutesRegister = (props) => {

    const closeModal = () => {
        props.handleCloseModal();
    }

    const closeBtn = <button className="close" onClick={closeModal}>&times;</button>;

    return (
        <Modal
            isOpen={props.open}
            centered
            size="lg"
        >
            {console.log("no route registration: " + props.traveller)}

            { props.traveller != null &&
                <ModalHeader close={closeBtn}>
                    Selecione os Pontos de Visita para o Viajante {props.traveller.first_name} {props.traveller.last_name}
                </ModalHeader>
            }
            <ModalBody>
                <Button
                    color="success"
                    className="btn-round"
                >
                    Adicionar Rota
                </Button>
            </ModalBody>
        </Modal>
    );
}

export default EmployeeRoutesRegister;