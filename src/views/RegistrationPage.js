import React, { useState, useEffect } from 'react';

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Form,
    FormGroup,
    FormFeedback,
    Input,
    Container,
    Col,
    Modal,
    Row,
    ModalBody,
    ModalFooter,
} from "reactstrap";

import { Redirect } from 'react-router-dom';
import { v4 } from "uuid";
import { brazilStates, typeLegalEntity } from "variables/general.js";
import { Formik } from 'formik';
import * as yup from 'yup';

import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import TransparentFooter from "components/Footers/TransparentFooter.js";
import MaskedInput from 'components/MaskedInput/MaskedInput.js';

import addressesApi from 'services/addressesApi';
import routeSolverApis from 'services/routeSolverApis';
import LoadingOverlay from 'react-loading-overlay';

function Registration() {
    const [uuid, setUuid] = useState(v4())
    const [first_name, setName] = useState('');
    const [last_name, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordToConfirm, setPasswordToConfirm] = useState('');
    const [document_number, setDocumentNumber] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [emailToConfirm, setEmailToConfirm] = useState('');
    const [country, setCountry] = useState('Brasil');
    const [admin_district, setAdminDistrict] = useState('AC');
    const [locality, setLocality] = useState('');
    const [postal_code, setPostalCode] = useState('');
    const [neighborhoodState, setNeighborhood] = useState('');
    const [address_line, setAddressLine] = useState('');
    const [address_number, setAddressNumber] = useState('');
    const [address_complement, setAddressComplement] = useState('');
    const [type_legal_entity, setTypeLegalEntity] = useState('PF');

    const [registered, setRegistered] = useState(false);

    const [showFailureModal, setShowFailureModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.body.classList.add("registration-page");
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        return function cleanup() {
            document.body.classList.remove("registration-page");
            document.body.classList.remove("sidebar-collapse");
        };
    }, []);


    const validationSchema = yup.object().shape({
        first_name: yup.string()
            .required("Nome é obrigatório")
            .min(2, "Nome deve conter minimo de 2 caracteres")
            .max(100, "Nome deve conter máximo de 100 caracteres"),
        last_name: yup.string()
            .required("Sobrenome é obrigatório")
            .min(2, "Sobrenome deve conter minimo de 2 caracteres")
            .max(100, "Sobrenome deve conter máximo de 100 caracteres"),
        password: yup.string()
            .required("Senha é obrigatório")
            .min(8, "Senha deve conter mínimo de 8 caracteres")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/, "A senha deve conter caracteres maiúsculos, minúsuclos, números e não deve conter partes do email"),
        passwordToConfirm: yup.mixed()
            .test(
                "password-match", "Confirmação de senha precisa ser igual a Senha", function (value) {
                    const { password } = this.parent
                    return password === value;
                }
            )
            .required("Confirmação de senha é obrigatório"),
        document: yup.string().required("Documento é obrigatório"),
        phone_number: yup.string().required("Telefone é obrigatório"),
        email: yup.string().required("Email é obrigatório").email("Insira um email válido"),
        emailToConfirm: yup.string()
            .test(
                "email-match", "Confirmação de email precisa ser igual ao Email", function (value) {
                    const { email } = this.parent
                    return email === value;
                }
            )
            .required("Confirmação de email é obrigatório")
            .email("Insira um email válido"),
        admin_district: yup.string().required("Bairro é obrigatório"),
        locality: yup.string().required("Cidade é obrigatório"),
        postal_code: yup.string().required("CEP é obrigatório"),
        neighborhood: yup.string().required("Bairro é obrigatório"),
        address_line: yup.string().required("Endereço é obrigatório"),
        address_number: yup.number()
            .required("Número do endereço é obrigatório")
            .positive("Número do endereço deve conter apenas números")
            .integer("Número do endereço deve conter apenas números"),
        address_complement: yup.string().optional(),
        type_legal_entity: yup.string().required("Tipo de pessoa é obrigatório")
    });

    let initialValues = {
        first_name: first_name,
        last_name: last_name,
        password: password,
        passwordToConfirm: passwordToConfirm,
        document_number: document_number,
        phone_number: phone_number,
        email: email,
        emailToConfirm: emailToConfirm,
        admin_district: admin_district,
        locality: locality,
        postal_code: postal_code,
        neighborhood: neighborhoodState,
        address_line: address_line,
        address_number: address_number,
        address_complement: address_complement,
        type_legal_entity: type_legal_entity
    };

    const submitForm = () => {
        console.log( {
            id: uuid,
            first_name,
            last_name,
            password,
            document: document_number,
            phone_number,
            email,
            country,
            admin_district,
            locality,
            postal_code,
            neighborhood: neighborhoodState,
            address_line,
            address_number: Number(address_number),
            address_complement,
            type_legal_entity
        });
        setIsLoading(true);
        routeSolverApis.post('customer', {
            id: uuid,
            first_name,
            last_name,
            password,
            document: document_number,
            phone_number,
            email,
            country,
            admin_district,
            locality,
            postal_code,
            neighborhood: neighborhoodState,
            address_line,
            address_number: Number(address_number),
            address_complement,
            type_legal_entity
        }).then(() => {
            setIsLoading(false);
            setShowSuccessModal(true);
        }).catch(err => {
            setIsLoading(false);
            if(err.response) {
                setErrorMessage("Erro ao realizar cadastro: " + err.response.data.message);
            } else {
                setErrorMessage("Erro ao realizar cadastro: " + err.message);
            }
            setShowFailureModal(true);
        });
    }

    const getAddressByZipCode = (zipCode) => {
        let postalCodeNumbers = zipCode.replace(/\D/g, '');
        setPostalCode(zipCode);
        console.log(postalCodeNumbers)
        addressesApi.get(`ws/${postalCodeNumbers}/json/`)
            .then(resp => {
                console.log(resp);

                setNeighborhood(resp.data.bairro);
                setLocality(resp.data.localidade);
                setAdminDistrict(resp.data.uf);
                setAddressLine(resp.data.logradouro);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                console.log("Erro ao chamar api de enderecos: " + err)
            });
    }

    if (registered === true) {
        return <Redirect to="/SignIn" />
    }

    return (
        <LoadingOverlay
            active={isLoading}
            spinner
            text='Carregando...'
        >
            {console.log(process.env.REACT_APP_AUTH0_DOMAIN)}
            {console.log(process.env.REACT_APP_AUTH0_CLIENT_ID)}
            {console.log(process.env.REACT_APP_AUTH0_REDIRECT_URL)}
            <ExamplesNavbar />
            <div className="page-header clear-filter" filter-color="blue">
                <div
                    className="page-header-image"
                    style={{
                        backgroundImage: "url(" + require("assets/img/login.jpg") + ")",
                    }}
                ></div>
                <div className="content">
                    <Container>
                        <Col className="ml-auto mr-auto" md="8">
                            <Card className="card-registration card-plain">
                                <CardHeader>
                                    <h5 className="title">Registre-se</h5>
                                </CardHeader>
                                <CardBody>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        enableReinitialize={true}
                                        onSubmit={submitForm}
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
                                                        <Col md='6'>
                                                            <FormGroup>
                                                                <label>Nome</label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Nome"
                                                                    name="first_name"
                                                                    value={values.first_name}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setName(e.target.value) }}
                                                                    invalid={touched.first_name && !!errors.first_name}
                                                                    valid={touched.first_name && !errors.first_name}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.first_name}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='6'>
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
                                                    </Row>

                                                    <Row>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <label>Tipo de Pessoa</label>
                                                                <Input
                                                                    type="select"
                                                                    name="type_legal_entity"
                                                                    value={values.type_legal_entity}
                                                                    onChange={handleChange}
                                                                >
                                                                    {
                                                                        typeLegalEntity.map((option, index) => {
                                                                            return (<option key={index} value={option.value}>{option.description}</option>)
                                                                        })
                                                                    }
                                                                </Input>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <label>Documento</label>
                                                                {values.type_legal_entity === "PF" ?
                                                                    <MaskedInput
                                                                        type="text"
                                                                        mask="111.111.111-11"
                                                                        placeholder="CPF"
                                                                        name="document"
                                                                        value={values.document_number}
                                                                        onChange={handleChange}
                                                                        onBlur={(e) => { setDocumentNumber(e.target.value) }}
                                                                        invalid={touched.document && !!errors.document}
                                                                        valid={touched.document && !errors.document}
                                                                    /> :
                                                                    <MaskedInput
                                                                        type="text"
                                                                        mask="11.111.111/1111-11"
                                                                        placeholder="CNPJ"
                                                                        name="document"
                                                                        value={values.document_number}
                                                                        onChange={handleChange}
                                                                        onBlur={(e) => { setDocumentNumber(e.target.value) }}
                                                                        invalid={touched.document && !!errors.document}
                                                                        valid={touched.document && !errors.document}
                                                                    />
                                                                }
                                                                <FormFeedback>
                                                                    {errors.document}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='4'>
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
                                                    </Row>

                                                    <Row>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <label>CEP</label>
                                                                <MaskedInput
                                                                    mask="11111-111"
                                                                    placeholder="CEP"
                                                                    name="postal_code"
                                                                    value={values.postal_code}
                                                                    onBlur={(e) => { getAddressByZipCode(e.target.value); setIsLoading(true) }}
                                                                    onChange={handleChange}
                                                                    invalid={touched.postal_code && !!errors.postal_code}
                                                                    valid={touched.postal_code && !errors.postal_code}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.postal_code}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='8'>
                                                            <FormGroup>
                                                                <label>Endereço</label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Endereço"
                                                                    name="address_line"
                                                                    value={values.address_line}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setAddressLine(e.target.value) }}
                                                                    invalid={touched.address_line && !!errors.address_line}
                                                                    valid={touched.address_line && !errors.address_line}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.address_line}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <label>Numero do Endereço</label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Numero do Endereço"
                                                                    name="address_number"
                                                                    value={values.address_number}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setAddressNumber(e.target.value) }}
                                                                    invalid={touched.address_number && !!errors.address_number}
                                                                    valid={touched.address_number && !errors.address_number}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.address_number}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <label>Complemento</label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Complemento"
                                                                    name="address_complement"
                                                                    value={values.address_complement}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setAddressComplement(e.target.value) }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <label>Bairro</label>
                                                                <Input
                                                                    placeholder="Bairro"
                                                                    name="neighborhood"
                                                                    value={values.neighborhood}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setNeighborhood(e.target.value) }}
                                                                    invalid={touched.neighborhood && !!errors.neighborhood}
                                                                    valid={touched.neighborhood && !errors.neighborhood}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.neighborhood}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row >
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <label>Cidade</label>
                                                                <Input
                                                                    placeholder="Cidade"
                                                                    name="locality"
                                                                    value={values.locality}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setLocality(e.target.value) }}
                                                                    invalid={touched.locality && !!errors.locality}
                                                                    valid={touched.locality && !errors.locality}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.locality}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label>Estado</label>
                                                                <Input
                                                                    type="select"
                                                                    name="admin_district"
                                                                    value={values.admin_district}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setAdminDistrict(e.target.value) }}
                                                                >
                                                                    {
                                                                        brazilStates.map((option, index) => {
                                                                            return (<option key={index} value={option}>{option}</option>)
                                                                        })
                                                                    }
                                                                </Input>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label>Pais</label>
                                                                <Input
                                                                    placeholder="País"
                                                                    defaultValue={country}
                                                                    disabled
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col md='6'>
                                                            <FormGroup>
                                                                <label>Email</label>
                                                                <Input
                                                                    type="email"
                                                                    placeholder="Email"
                                                                    name="email"
                                                                    value={values.email}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setEmail(e.target.value) }}
                                                                    invalid={touched.email && !!errors.email}
                                                                    valid={touched.email && !errors.email}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.email}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='6'>
                                                            <FormGroup>
                                                                <label>Confirme o Email</label>
                                                                <Input
                                                                    type="email"
                                                                    placeholder="Confirme o Email"
                                                                    name="emailToConfirm"
                                                                    value={values.emailToConfirm}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setEmailToConfirm(e.target.value) }}
                                                                    invalid={touched.emailToConfirm && !!errors.emailToConfirm}
                                                                    valid={touched.emailToConfirm && !errors.emailToConfirm}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.emailToConfirm}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col md='6'>
                                                            <FormGroup>
                                                                <label>Senha</label>
                                                                <Input
                                                                    type='password'
                                                                    placeholder="Senha"
                                                                    name="password"
                                                                    value={values.password}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setPassword(e.target.value) }}
                                                                    invalid={touched.password && !!errors.password}
                                                                    valid={touched.password && !errors.password}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.password}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='6'>
                                                            <FormGroup>
                                                                <label>Confirme a Senha</label>
                                                                <Input
                                                                    type='password'
                                                                    placeholder="Confirme a Senha"
                                                                    name="passwordToConfirm"
                                                                    value={values.passwordToConfirm}
                                                                    onChange={handleChange}
                                                                    onBlur={(e) => { setPasswordToConfirm(e.target.value) }}
                                                                    invalid={touched.passwordToConfirm && !!errors.passwordToConfirm}
                                                                    valid={touched.passwordToConfirm && !errors.passwordToConfirm}
                                                                />
                                                                <FormFeedback>
                                                                    {errors.passwordToConfirm}
                                                                </FormFeedback >
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Button
                                                        type="submit"
                                                        className="btn-round pull-right"
                                                        color="info"
                                                        onClick={submitForm}
                                                    >
                                                        Registrar
                                                    </Button>
                                                    <div className="clearfix" />
                                                </Form>
                                            )}
                                    </Formik>
                                </CardBody>
                            </Card>
                        </Col>

                        <Modal
                            isOpen={showFailureModal}
                            centered
                        >
                            <ModalBody>
                                {errorMessage}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="btn-round pull-right"
                                    color="danger"
                                    onClick={() => { setShowFailureModal(false) }}
                                >
                                    Ok
                                </Button>
                            </ModalFooter>
                        </Modal>


                        <Modal 
                            isOpen={showSuccessModal}
                            entered
                        >
                            <ModalBody>
                                Cadastro realizado com sucesso!
                            </ModalBody>
                            <ModalFooter>
                                <Button  
                                    className="btn-round pull-right"
                                    color="info"
                                    onClick={() => { setRegistered(true) }}
                                >
                                    Ok
                                </Button>
                            </ModalFooter>
                        </Modal>

                    </Container>
                </div>
                <TransparentFooter />

            </div>
        </LoadingOverlay>
    );
};


export default Registration;