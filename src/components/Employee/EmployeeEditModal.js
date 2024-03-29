import React, { useState, useEffect } from 'react';
// reactstrap components
import {
    Button,
    Form,
    FormGroup,
    FormFeedback,
    Input,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Row,
    Col,
    Spinner
} from "reactstrap";

import { v4 } from "uuid";
import { Formik } from 'formik';
import * as yup from 'yup';
import MaskedInput from 'components/MaskedInput/MaskedInput.js';
import { useAuth0 } from "@auth0/auth0-react";
import { typeEmployee } from 'variables/general.js';
import routeSolverApis from "services/routeSolverApis";
import LoadingOverlay from 'react-loading-overlay';

const EmployeeEditModal = (props) => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userInfo, setUserInfo] = useState(null);
    const [organizationId, setOrganizationId] = useState(props.customerId);

    useEffect(() => {
        if (!isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            setUserInfo(user);
        }
    },
        //[authState, authService]
        [user, isAuthenticated]); // Update if authState changes

    const [showEditEmployee, setShowEditEmployee] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFail, setShowFail] = useState(false);
    const [failMessage, setFailMessage] = useState('');

    const [uuid, setUuid] = useState(props.employee.id);
    const [customer_id, setCustomerId] = useState(props.employee.customer_id);
    const [first_name, setFirstName] = useState(props.employee.first_name);
    const [last_name, setLastName] = useState(props.employee.last_name);
    const [document, setDocument] = useState(props.employee.document);
    const [email, setEmail] = useState(props.employee.email);
    const [phone_number, setPhoneNumber] = useState(props.employee.phone_number);
    const [registration_id, setRegistratonId] = useState(props.employee.registration_id);
    const [type_employee, setTypeEmployee] = useState(props.employee.type_employee);
    const [type_employee_id, setTypeEmployeeId] = useState(typeEmployee.find(type => props.employee.type_employee === type.label).value);

    const validationSchema = yup.object().shape({
        first_name: yup.string()
            .required("Nome é obrigatório")
            .min(2, "Nome deve conter minimo de 2 caracteres")
            .max(100, "Nome deve conter máximo de 100 caracteres"),
        last_name: yup.string()
            .required("Sobrenome é obrigatório")
            .min(2, "Sobrenome deve conter minimo de 2 caracteres")
            .max(100, "Sobrenome deve conter máximo de 100 caracteres"),
        document: yup.string().required("Documento é obrigatório"),
        phone_number: yup.string().required("Telefone é obrigatório"),
        registration_id: yup.string().required("Matrícula é obrigatório")
    });

    let initialValues = {
        first_name: first_name,
        last_name: last_name,
        type_employee: type_employee,
        document: document,
        email: email,
        phone_number: phone_number,
        registration_id: registration_id
    };

    const editEmployee = async () => {
        setIsLoading(true);
        const token = await getAccessTokenSilently();

        routeSolverApis.put(`employee/${uuid}`, {
            id: uuid,
            customer_id,
            first_name,
            last_name,
            document,
            email,
            phone_number,
            registration_id,
            type_employee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                setIsLoading(false);
                console.log("salvo com sucesso");
                setShowSuccess(true);
            })
            .catch(error => {
                setIsLoading(false);
                console.log("Recebendo erro");
                console.log(error);
                if (error.response) {
                    setFailMessage("Erro ao realizar cadastro: " + error.response.data.message);
                } else {
                    setFailMessage("Erro ao realizar cadastro: " + error.message);
                }
                setShowFail(true);
            });
    }

    const closeEmployeModal = () => {
        setShowEditEmployee(props.handleEditModal);
    }

    const getTypeEmployeeNumberValue = (typeEmployeeString) => {
        let typeEmployeeNumber = typeEmployee.filter(type => typeEmployeeString === type.label).map(type => {return type.value})
        
        console.log("typeEmployeeNumber: " + typeEmployeeNumber);

        return typeEmployeeNumber;
    }

    return (
        <LoadingOverlay
            active={isLoading}
            spinner
            text='Salvando Funcionário...'
        >
            <Modal
                isOpen={props.open}
                centered
                size="lg"
            >
                <ModalHeader>
                    Editar Funcionário
                </ModalHeader>

                <ModalBody>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={editEmployee}
                    >
                        {({
                            isValid,
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                        }) => (
                            <Form className="form" noValidate onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="12">
                                        <FormGroup>
                                            <label>Id</label>
                                            <Input
                                                name="uuid"
                                                placeholder={uuid}
                                                value={uuid}
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md='4'>
                                        <FormGroup>
                                            <label>Nome</label>
                                            <Input
                                                type="text"
                                                placeholder="Nome"
                                                name="first_name"
                                                value={values.first_name}
                                                onChange={handleChange}
                                                onBlur={(e) => { setFirstName(e.target.value) }}
                                                invalid={touched.first_name && !!errors.first_name}
                                                valid={touched.first_name && !errors.first_name}
                                            />
                                            <FormFeedback>
                                                {errors.first_name}
                                            </FormFeedback >
                                        </FormGroup>
                                    </Col>
                                    <Col md='4'>
                                        <FormGroup>
                                            <label>Sobrenome</label>
                                            <Input
                                                type="text"
                                                placeholder="Sobrenome"
                                                name="last_name"
                                                value={values.last_name}
                                                onChange={handleChange}
                                                onBlur={(e) => { setLastName(e.target.value) }}
                                                invalid={touched.last_name && !!errors.last_name}
                                                valid={touched.last_name && !errors.last_name}
                                            />
                                            <FormFeedback>
                                                {errors.last_name}
                                            </FormFeedback >
                                        </FormGroup>
                                    </Col>

                                    <Col md='4'>
                                        <FormGroup>
                                            <label>Tipo de Funcionário</label>
                                            <Input
                                                type="select"
                                                name="type_employee"
                                                //value={getTypeEmployeeNumberValue(values.type_employee)}
                                                defaultValue={type_employee_id}
                                                multiple={false}
                                                onChange={handleChange}
                                                onBlur={e => { setTypeEmployee(e.target.value) }}
                                            >
                                                {
                                                    typeEmployee.map((option, index) => {
                                                        return (<option key={index} value={option.value}>{option.label}</option>)
                                                    })
                                                }
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="4">
                                        <FormGroup>
                                            <label>Documento</label>
                                            <Input
                                                type="text"
                                                placeholder="CPF"
                                                name="document"
                                                value={values.document}
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="4">
                                        <FormGroup>
                                            <label>Telefone</label>
                                            <MaskedInput
                                                type="text"
                                                mask='(11) 11111-1111'
                                                placeholder="Telefone"
                                                name="phone_number"
                                                value={values.phone_number}
                                                onChange={handleChange}
                                                onBlur={(e) => { setPhoneNumber(e.target.value) }}
                                                invalid={touched.phone_number && !!errors.phone_number}
                                                valid={touched.phone_number && !errors.phone_number}
                                            />
                                            <FormFeedback>
                                                {errors.phone_number}
                                            </FormFeedback >
                                        </FormGroup>
                                    </Col>
                                    <Col md="4">
                                        <FormGroup>
                                            <label>Matricula</label>
                                            <Input
                                                type="text"
                                                placeholder="Matrícula"
                                                name="registration_id"
                                                value={values.registration_id}
                                                onChange={handleChange}
                                                onBlur={(e) => { setRegistratonId(e.target.value) }}
                                                invalid={touched.registration_id && !!errors.registration_id}
                                                valid={touched.registration_id && !errors.registration_id}
                                            />
                                            <FormFeedback>
                                                {errors.registration_id}
                                            </FormFeedback >
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <label>Email</label>
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                name="email"
                                                value={values.email}
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>


                                {
                                    isLoading === true ?
                                        <Button
                                            color="info"
                                            className="btn-round pull-right"
                                        >
                                            <Spinner
                                                size="sm"
                                                color="light"
                                                className="pull-right"
                                            />Salvando...
                                        </Button>
                                        :
                                        <>
                                            <Button
                                                color="danger"
                                                className="btn-round"
                                                onClick={props.handleEditModal}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                color="info"
                                                className="btn-round pull-right"
                                            >
                                                Salvar
                                            </Button>
                                        </>
                                }
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={showFail}
                centered
            >
                <ModalBody>
                    {failMessage}
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn-round pull-right"
                        color="danger"
                        onClick={() => { setShowFail(false) }}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>


            <Modal
                isOpen={showSuccess}
                centered
            >
                <ModalBody>
                    Funcionário atualizado com sucesso!
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn-round pull-right"
                        color="info"
                        onClick={() => { setShowSuccess(false); closeEmployeModal(); props.handleEmployeesChanged(); }}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        </LoadingOverlay>
    );
}

export default EmployeeEditModal;