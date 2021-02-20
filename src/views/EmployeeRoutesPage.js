import React, { useState, useEffect } from "react";

// reactstrap components
import {
    Button,
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Card,
    CardHeader,
    CardBody,
    Form,
} from "reactstrap";

// core components
import PanelHeaderWithImage from "components/PanelHeader/PanelHeaderWithImage.js";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingOverlay from 'react-loading-overlay';
import routeSolverApis from "services/routeSolverApis";
import EmployeeRoutesInfo from 'components/EmployeeRoutes/EmployeeRoutesInfo.js';
import EmployeeRoutesModalNew from 'components/EmployeeRoutes/EmployeeRoutesModalNew.js';

function EmployeeRoutesPage() {
    let pageHeader = React.createRef();
    const customerIdAttribute = process.env.REACT_APP_AUTH0_CUSTOMER_ID_ATTRIBUTE;
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userInfo, setUserInfo] = React.useState(user);
    let customerId = user[customerIdAttribute];

    const [travellersRoutesChanged, setTravellersRoutesChanged] = useState(0);

    const [travellersInfosArrays, setTravellersInfosArrays] = useState([]);
    const [travellersWithRoutes, setTravellersWithRoutes] = useState([]);
    const [travellersWithoutRoutes, setTravellersWithoutRoutes] = useState([]);
    const [travellersInfo, setTravellersInfo] = useState([]);

    const [loadingTravellersInfo, setLoadingTravellersInfo] = useState(false);
    const [employeeRoutesQuantityChanged, setEmployeeRoutesQuantityChanged] = useState(0);

    const [showEmployeeRoutesModalNew, setShowEmployeeRoutesModalNew] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setUserInfo(null);
        } else {
            readTravellersWithRoutes(customerId);
            readTravellersWithoutRoutes(customerId);
            //readTravellersInfo(customerId);
            //setThreeTravellersPerRow(travellersInfo, travellersRoutes);
        }
    }, [travellersRoutesChanged])


    const getToken = async () => {
        const tempToken = await getAccessTokenSilently({
            audiece: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:users",
        });

        return tempToken;
    }

    const readTravellersWithRoutes = async (customerId) => {
        const tempToken = await getToken();
        console.log("Getting routes... ");
        routeSolverApis.get(`customer/${customerId}/travellersWithFilters?perRow=3&withRoutes=true`, {
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                setTravellersWithRoutes(response.data);
                console.log("travellers with routes response: " + JSON.stringify(response.data));
            })
            .catch(error => {
                if (error.response) {
                    console.log("Erro ao buscar viajantes com rotas. " + error.response.data);
                } else {
                    console.log("Erro ao buscar viajantes com rotas: " + error);
                }
            });
    }

    const readTravellersWithoutRoutes = async (customerId) => {
        const tempToken = await getToken();
        console.log("Getting routes... ");
        routeSolverApis.get(`customer/${customerId}/travellersWithFilters?perRow=3&withRoutes=false`, {
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                setTravellersWithoutRoutes(response.data);
                console.log("travellers without routes response: " + JSON.stringify(response.data));
            })
            .catch(error => {
                if (error.response) {
                    console.log("Erro ao buscar viajantes sem rotas. " + error.response.data);
                } else {
                    console.log("Erro ao buscar viajantes sem rotas: " + error);
                }
            });
    }

    const readTravellersInfo = async (customerId) => {
        setLoadingTravellersInfo(true);
        const tempToken = await getToken();
        console.log("Getting travellers... ");
        routeSolverApis.get(`customer/${customerId}/travellers`, {
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                //setTravellersInfo(response.data);
                setThreeTravellersPerRow(response.data);
                setLoadingTravellersInfo(false);
            })
            .catch(error => {
                setLoadingTravellersInfo(false);
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

    // const setThreeTravellersPerRow = (travellerInfos, travellerRoutes) => {
    //     console.log("settings up travellers per row...");
    //     const tempArray = [], size = 3;
    //     const travellers = travellerInfos.map((travellerInfo) => {
    //         return Object.assign(travellerInfo,
    //             travellerRoutes.find(route => travellerInfo.id === route.employee_id));
    //     });

    //     console.log("Travellers: " + JSON.stringify(travellers));

    //     while (travellers.length > 0) {
    //         tempArray.push(travellers.splice(0, size));
    //     }

    //     setTravellersInfosArrays(tempArray);
    //     console.log("tempArray: " + tempArray);
    // }

    const registerNewTravellerWithVisitPoint = () => {
        setShowEmployeeRoutesModalNew(true);
    }

    const closeNewTravellerWithVisitPoint = () => {
        setShowEmployeeRoutesModalNew(false);
    }

    const setStringTravellerEmailToSearch = (email) => {

    }

    const searchTraveller = () => {

    }

    const handleEmployeeRouteChanged = () => {
        const tempNumber = employeeRoutesQuantityChanged + 1;
        setEmployeeRoutesQuantityChanged(tempNumber);
    }

    return (
        <LoadingOverlay
            active={loadingTravellersInfo}
            spinner
            text='Buscando viajantes e seus pontos de visita...'
        >
            {console.log("body - travellers info: " + JSON.stringify(travellersInfo))}
            {console.log("body - travellers routes: " + JSON.stringify(travellersWithRoutes))}
            <PanelHeaderWithImage
                content={
                    <div
                        className="image-white text-center"
                        style={{
                            backgroundImage: "url(" + require("assets/img/routes.jpg") + ")",
                        }}
                        ref={pageHeader}
                    >
                        <h2 className="title">Rotas</h2>
                    </div>
                }
            />

            <div className="content">
                <Row>
                    <Col>
                        <Button
                            color="info"
                            className="btn-round"
                            onClick={registerNewTravellerWithVisitPoint}
                        >
                            Novo
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col md="12">
                        <Card
                            className="pr-1"
                            md="5"
                        >
                            <CardHeader>
                                <h5 className="title">Buscar Viajante</h5>
                            </CardHeader>
                            <CardBody>
                                <Form action="" className="form" method="" onSubmit={searchTraveller}>
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
                                                    placeholder="Consulta por E-mail do Viajante"
                                                    type="email"
                                                    onChange={(e) => { setStringTravellerEmailToSearch(e.target.value); searchTraveller(e) }}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {
                    <EmployeeRoutesInfo
                        travellersInfosArrays={travellersInfosArrays}
                        travellersWithRouteArrays={travellersWithRoutes}
                        handleEmployeeRouteChanged={handleEmployeeRouteChanged}
                    />
                }
            </div>

            <EmployeeRoutesModalNew
                open={showEmployeeRoutesModalNew}
                travellersWithoutRouteArrays={travellersWithoutRoutes}
                handleCloseModal={setShowEmployeeRoutesModalNew}
            />

        </LoadingOverlay>
    );
}

export default EmployeeRoutesPage;