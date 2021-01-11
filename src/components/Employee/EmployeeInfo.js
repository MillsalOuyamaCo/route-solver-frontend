import React, { useState } from 'react';
import {
    Card,
    CardBody,
    Row,
    Col,
    Button,
    UncontrolledTooltip,
    CardHeader,
    CardTitle,
    Table,
    Modal,
    ModalBody,
    ModalFooter,
    Spinner
} from 'reactstrap';
import { employeeTableHead } from '../../variables/general.js';

import { useAuth0 } from "@auth0/auth0-react";
import routeSolverApis from "services/routeSolverApis.js";
import EmployeeEditModal from "../Employee/EmployeeEditModal.js";

const EmployeeInfo = (props) => {
    const { getAccessTokenSilently } = useAuth0();
    const [isLoadingDeletion, setIsLoadingDeletion] = useState(false);
    const [showDeleteModalConfirmation, setShowDeleteModalConfirmation] = useState(false);
    const [showDeleteModalSuccess, setShowDeleteModalSuccess] = useState(false);
    const [showDeleteModalFailed, setShowDeleteModalFailed] = useState(false);
    const [deleteModalFailureMessage, setDeleteModalFailureMessage] = useState('');
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    const [showEmployeeEditModal, setShowEmployeeEditModal] = useState(false);

    const getToken = async () => {
        const tempToken = await getAccessTokenSilently({
            audiece: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:users",
        });

        return tempToken;
    }

    const submitDelete = async (employee) => {
        setIsLoadingDeletion(true);
        const token = await getToken();
        routeSolverApis.delete(`/Customer/${employee.customer_id}/employee/${employee.id}`, {
            data: {
                id: employee.id,
                customer_id: employee.customer_id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                document: employee.document,
                email: employee.email,
                phone_number: employee.phone_number,
                registration_id: employee.registration_id,
                type_employee: employee.type_employee
            },

            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(reponse => {
                setShowDeleteModalConfirmation(false);
                setShowDeleteModalSuccess(true);
                props.handleEmployeesChanged();
                setIsLoadingDeletion(false);
            })
            .catch(error => {
                if (error.response) {
                    console.log("Erro ao excluir funcionário. " + error.response.data);
                    setDeleteModalFailureMessage("Erro ao excluir funcionário. " + error.response.data);
                } else {
                    console.log("Erro ao excluir funcionário: " + error);
                    setDeleteModalFailureMessage("Erro ao excluir funcionário: " + error);
                }
                setShowDeleteModalConfirmation(false);
                setShowDeleteModalFailed(true);
                setIsLoadingDeletion(false);
            });
    }

    const editEmployee = () => {
        setShowEmployeeEditModal(true);
    }

    const closeEditEmployeeModal = () => {
        setEmployeeToEdit(null);
        setShowEmployeeEditModal(false);
    }

    return (
        <div>
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Funcionários</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Table responsive>
                                <thead className="text-primary">
                                    <tr>
                                        {employeeTableHead.map((prop, key) => {
                                            return <th key={key}>{prop}</th>;
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.employees.map((employee) => {
                                        return (
                                            <tr key={employee.id}>
                                                <td>{employee.first_name} {employee.last_name}</td>
                                                <td>{employee.registration_id}</td>
                                                <td>{employee.phone_number}</td>
                                                <td>{employee.email}</td>
                                                <td>
                                                    <Button
                                                        className="btn-round btn-icon btn-icon-mini btn-neutral"
                                                        color="info"
                                                        id="tooltip731609871"
                                                        type="button"
                                                        onClick={() => {
                                                            setEmployeeToEdit(employee);
                                                            editEmployee();
                                                        }}
                                                    >
                                                        <i className="now-ui-icons ui-2_settings-90" />
                                                    </Button>
                                                    <UncontrolledTooltip
                                                        delay={0}
                                                        target="tooltip731609871"
                                                    >
                                                        Editar Funcionário
                                                    </UncontrolledTooltip>
                                                    <Button
                                                        className="btn-round btn-icon btn-icon-mini btn-neutral"
                                                        color="danger"
                                                        id="tooltip923217206"
                                                        type="button"
                                                        onClick={() => {
                                                            setEmployeeToDelete(employee);
                                                            setShowDeleteModalConfirmation(true);
                                                        }}
                                                    >
                                                        <i className="now-ui-icons ui-1_simple-remove" />
                                                    </Button>
                                                    <UncontrolledTooltip
                                                        delay={0}
                                                        target="tooltip923217206"
                                                    >
                                                        Excluir Funcionário
                                                    </UncontrolledTooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {
                employeeToDelete != null &&
                <Modal
                    isOpen={showDeleteModalConfirmation}
                    centered
                >
                    <ModalBody>
                        Deseja excluir o funcionário {employeeToDelete.first_name} {employeeToDelete.last_name}?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className="btn-round pull-right"
                            color="danger"
                            onClick={() => { setShowDeleteModalConfirmation(false); }}
                        >
                            Não
                        </Button>
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
                                <Button
                                    className="btn-round pull-right"
                                    color="info"
                                    onClick={() => { submitDelete(employeeToDelete); }}
                                >
                                    Sim
                            </Button>
                        }
                    </ModalFooter>
                </Modal>
            }

            <Modal
                isOpen={showDeleteModalSuccess}
                centered
            >
                <ModalBody>
                    Funcionário excluído com sucesso!
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

            {
                employeeToEdit != null &&
                < EmployeeEditModal
                    open={showEmployeeEditModal}
                    handleEditModal={closeEditEmployeeModal}
                    employee={employeeToEdit}
                    handleEmployeesChanged={props.handleEmployeesChanged}
                />
            }

        </div>
    );
}

export default EmployeeInfo;