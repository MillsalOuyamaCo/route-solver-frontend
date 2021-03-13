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

import { Formik } from 'formik';
import * as yup from 'yup';
import { useAuth0 } from "@auth0/auth0-react";
import { typeEmployee } from 'variables/general.js';
import routeSolverApis from "services/routeSolverApis";
import { brazilStates } from "variables/general.js";
import addressesApi from 'services/addressesApi';
import MaskedInput from 'components/MaskedInput/MaskedInput.js';

const VisitPointModalNew = (props) => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            setUserInfo(user);
        }
    }, [user, isAuthenticated]); // Update if authState changes

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCepApi, setIsLoadingCepApi] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFail, setShowFail] = useState(false);
    const [failMessage, setFailMessage] = useState('');

    const [country_region, setCountryRegion] = useState('Brasil');
    const [admin_district, setAdminDistrict] = useState('AC');
    const [locality, setLocality] = useState('');
    const [postal_code, setPostalCode] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [address_line, setAddressLine] = useState('');
    const [address_number, setAddressNumber] = useState('');
    const [address_complement, setAddressComplement] = useState('');

    const schema = yup.object().shape({
        country_region: yup.string()
            .required("País é obrigatório")
            .min(2, "País deve conter minimo de 2 caracteres"),
        admin_district: yup.string()
            .required("Estado é obrigatório")
            .min(2, "Estado deve conter minimo de 2 caracteres"),
        locality: yup.string()
            .required("Cidade é obrigatória")
            .min(2, "Cidade deve conter minimo de 2 caracteres"),
        postal_code: yup.string()
            .required()
            .length(9, "CEP deve conter o tamanho de 8 números"),
        neighborhood: yup.string()
            .required("Bairro é obrigatório")
            .min(2, "Bairro deve conter minimo de 2 caracteres"),
        address_line: yup.string()
            .required("Rua é obrigatória")
            .min(2, "Rua deve conter minimo de 2 caracteres"),
        address_number: yup.number()
            .required("Número do endereço é obrigatório")
            .positive("Número do endereço deve conter apenas números")
            .integer("Número do endereço deve conter apenas números"),
    });

    let initialValues = {
        country_region: country_region,
        admin_district: admin_district,
        locality: locality,
        postal_code: postal_code,
        neighborhood: neighborhood,
        address_line: address_line,
        address_number: address_number,
        address_complement: address_complement
    };

    const registerNewVisitPointAsync = async () => {
        setIsLoading(true);
        const token = await getAccessTokenSilently();
        routeSolverApis.post('lat-lon', {
            country_region,
            admin_district,
            locality,
            postal_code,
            neighborhood,
            address_line,
            address_number,
            address_complement,
            customer_id: props.customerId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then( () => {
            setIsLoading(false);
            console.log("salvo com sucesso!");
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

    const closeVisitPointModal = () => {
        clearVisitPoint();
        props.handleCloseModal();
    }

    const clearVisitPoint = () => {
        setCountryRegion('Brasil');
        setAdminDistrict('AC');
        setLocality('');
        setPostalCode('');
        setNeighborhood('');
        setAddressLine('');
        setAddressNumber('');
        setAddressComplement('');
    }

    const getAddressByZipCode = (zipCode) => {
        setIsLoadingCepApi(true);
        let postalCodeNumbers = zipCode.replace(/\D/g, '');
        setPostalCode(zipCode);
        console.log(postalCodeNumbers)
        addressesApi.get(`ws/${postalCodeNumbers}/json/`)
            .then(resp => {
                setNeighborhood(resp.data.bairro);
                setLocality(resp.data.localidade);
                setAdminDistrict(resp.data.uf);
                setAddressLine(resp.data.logradouro);
                setIsLoadingCepApi(false);
            })
            .catch(err => {
                setIsLoadingCepApi(false);
                console.log("Erro ao chamar api de enderecos: " + err)
            });
    }


    return (
        <>
            <Modal
                isOpen={props.open}
                centered
                size="lg"
            >
                <ModalHeader>
                    Novo Ponto de Visita
                </ModalHeader>
                <ModalBody>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        onSubmit={registerNewVisitPointAsync}
                        validationSchema={schema}
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
                                    <Col md='4'>
                                        <FormGroup>
                                            <label>CEP</label>
                                            <MaskedInput
                                                mask="11111-111"
                                                placeholder="CEP"
                                                name="postal_code"
                                                value={values.postal_code}
                                                onBlur={(e) => { getAddressByZipCode(e.target.value); setIsLoadingCepApi(true) }}
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
                                                defaultValue={country_region}
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {   isLoadingCepApi === true ?
                                    <Button
                                        color="success"
                                        className="btn-round pull-right"
                                    >
                                        <Spinner
                                            size="sm"
                                            color="light"
                                            className="pull-right"
                                        />Buscando Endereço...
                                    </Button>
                                    :
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
                                                onClick={closeVisitPointModal}
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
                    Cadastro realizado com sucesso!
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn-round pull-right"
                        color="info"
                        onClick={() => { setShowSuccess(false); closeVisitPointModal(); props.handleVisitPointsChanged(); }}
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default VisitPointModalNew;