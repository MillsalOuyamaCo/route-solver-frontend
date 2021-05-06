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
    Spinner,
    UncontrolledTooltip,
    Table
} from "reactstrap";

import { Formik } from 'formik';
import * as yup from 'yup';
import { useAuth0 } from "@auth0/auth0-react";
import { typeEmployee } from 'variables/general.js';
import routeSolverApis from "services/routeSolverApis";
import { brazilStates } from "variables/general.js";
import addressesApi from 'services/addressesApi';
import MaskedInput from 'components/MaskedInput/MaskedInput.js';
import { v4 } from "uuid";

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
    const [address_nickname, setAddressNickname] = useState('');
    const [address_phone_number, setAddressPhoneNumber] = useState('');

    const [addressesList, setAddressesList] = useState([]);
    const [addressFound, setAddressFound] = useState(null);

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
        address_complement: address_complement,
        address_nickname: address_nickname,
        address_phone_number: address_phone_number
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
            .then(() => {
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

    const registerNewVisitPointsAsync = async () => {
        setIsLoading(true);
        const token = await getAccessTokenSilently();
        console.log("saving addresses list: " + JSON.stringify(addressesList));
        routeSolverApis.post('lat-lon/save-list', {
            data: addressesList
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
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

        setAddressFound(null);
        setAddressesList([]);
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
                let address = {
                    country_region: "Brasil",
                    admin_district: resp.data.uf,
                    locality: resp.data.localidade,
                    postal_code: resp.data.cep,
                    neighborhood: resp.data.bairro,
                    address_line: resp.data.logradouro,
                    address_number: 0,
                    customer_id: props.customerId,
                    rendering_id: v4()
                }

                setAddressFound(address);
                setIsLoadingCepApi(false);
            })
            .catch(err => {
                setIsLoadingCepApi(false);
                console.log("Erro ao chamar api de enderecos: " + err)
            });
    }

    const addAddressToSaveList = () => {
        if (addressFound !== null) {
            addressFound.address_number = address_number;
            // addressFound.address_nickname = address_nickname;
            // addressFound.address_phone_number = address_phone_number;
            let dictionay = {
                customer_id: props.customerId,
                address_nickname: address_nickname,
                address_phone_number: address_phone_number
            }
            addressFound.address_custom_properties = dictionay;

            addressesList.push(addressFound);
            setAddressFound(null);
            setPostalCode('');
            setAddressNumber('');
            setAddressNickname('');
            setAddressPhoneNumber('');
        }
    }

    const removeAddressFromSavingList = (index) => {
        let tempArray = [...addressesList];
        tempArray.splice(index, 1);
        setAddressesList(tempArray);
    }

    const closeBtn = <button className="close" onClick={closeVisitPointModal}>&times;</button>;

    return (
        <>
            <Modal
                isOpen={props.open}
                centered
                size="xl"
            >
                <ModalHeader close={closeBtn}>
                    Novo Ponto de Visita
                </ModalHeader>
                <ModalBody>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        // onSubmit={registerNewVisitPointAsync}
                        onSubmit={addAddressToSaveList}
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
                                    <Col>
                                        <FormGroup>
                                            <label>*CEP</label>
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

                                    <Col>
                                        <FormGroup>
                                            <label>*Numero do Endereço</label>
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

                                    <Col>
                                        <FormGroup>
                                            <label>Apelido do Endereço</label>
                                            <Input
                                                type="text"
                                                placeholder="Apelido do Endereço (Opcional)"
                                                name="address_nickname"
                                                value={values.address_nickname}
                                                onChange={handleChange}
                                                onBlur={(e) => { setAddressNickname(e.target.value) }}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col>
                                        <FormGroup>
                                            <label>Telefone</label>
                                            <MaskedInput
                                                type="text"
                                                mask='(11) 11111-1111'
                                                placeholder="Telefone (Opcional)"
                                                name="address_phone_number"
                                                value={values.address_phone_number}
                                                onChange={handleChange}
                                                onBlur={(e) => { setAddressPhoneNumber(e.target.value) }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                {
                                    isLoadingCepApi === true &&
                                    <>
                                        <hr />
                                        <Row>
                                            <Spinner
                                                size="sm"
                                                color="primary"
                                                className="pull-right"
                                            /> {" "}Buscando Endereço...
                                        </Row>
                                    </>
                                }

                                {
                                    addressFound !== null &&

                                    <>
                                        <hr />
                                        <Row>
                                            <Col md='3'> <strong className="font-weight-bold">Endereço Encontrado:</strong> </Col>
                                            <Col>{addressFound.address_line}, {addressFound.neighborhood} - {addressFound.locality}</Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col>
                                                <Button
                                                    type="submit"
                                                    color="success"
                                                    className="btn-round pull-right"
                                                //onClick={addAddressToSaveList}
                                                >
                                                    Adicionar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </>
                                }



                                {
                                    addressesList.length > 0 &&
                                    <>
                                        <hr />
                                        <Table bordered>
                                            <thead>
                                                <tr>
                                                    <th>Cep</th>
                                                    <th>Rua</th>
                                                    <th>Numero</th>
                                                    <th>Bairro</th>
                                                    <th>Cidade</th>
                                                    <th>Estado</th>
                                                    <th>Deletar</th>
                                                </tr>
                                            </thead>
                                            {addressesList.map((address, index) => {
                                                return (
                                                    <tbody key={address.rendering_id}>
                                                        <tr>
                                                            <th scope="row">
                                                                {address.postal_code}
                                                            </th>
                                                            <td>
                                                                {address.address_line}
                                                            </td>
                                                            <td>
                                                                {address.address_number}
                                                            </td>
                                                            <td>
                                                                {address.neighborhood}
                                                            </td>
                                                            <td>
                                                                {address.locality}
                                                            </td>
                                                            <td>
                                                                {address.admin_district}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    className="btn-round btn-icon btn-icon-mini btn-neutral"
                                                                    color="danger"
                                                                    id="tooltip923217206"
                                                                    type="button"
                                                                    onClick={() => removeAddressFromSavingList(index)}
                                                                >
                                                                    <i className="now-ui-icons ui-1_simple-remove" />
                                                                </Button>
                                                                <UncontrolledTooltip
                                                                    delay={0}
                                                                    target="tooltip923217206"
                                                                >
                                                                    Remove
                                                                    </UncontrolledTooltip>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                );
                                            })}
                                        </Table>

                                        {isLoading === true ?
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
                                            <Button
                                                type="button"
                                                color="info"
                                                className="btn-round pull-right"
                                                onClick={() => registerNewVisitPointsAsync()}
                                            >
                                                Salvar
                                            </Button>
                                        }
                                    </>
                                }

                                {/* <Row>
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

                                } */}
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