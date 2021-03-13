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

    const [travellersWithRoutes, setTravellersWithRoutes] = useState([]);
    const [travellersWithoutRoutes, setTravellersWithoutRoutes] = useState([]);
    const [visitPoints, setVisitPoints] = useState([]);

    const [loadTravellerWithRoutes, setLoadTravellerWithRoutes] = useState(false);
    const [loadTravellerWithoutRoutes, setLoadTravellerWithoutRoutes] = useState(false);
    const [loadVisitPoints, setLoadVisitPoints] = useState(false);

    const [loadingTravellersInfo, setLoadingTravellersInfo] = useState(false);

    const [showEmployeeRoutesModalNew, setShowEmployeeRoutesModalNew] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setUserInfo(null);
        } else {
            setLoadingTravellersInfo(true);
            readTravellersWithRoutes(customerId);
            readTravellersWithoutRoutes(customerId);
            readRoutes(customerId);
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
        setLoadTravellerWithRoutes(true);
        const tempToken = await getToken();
        routeSolverApis.get(`customer/${customerId}/travellersWithFilters`, {
            params:{
                perRow: 3,
                withRoutes: true
            },
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                console.log("travellers with routes response: " + JSON.stringify(response.data));
                setTravellersWithRoutes(response.data);
                setLoadTravellerWithRoutes(false);
                loadedEverything();
            })
            .catch(error => {
                if (error.response) {
                    setLoadTravellerWithRoutes(false);
                    loadedEverything();
                    console.log("Erro ao buscar viajantes com rotas. " + error.response.data);
                } else {
                    console.log("Erro ao buscar viajantes com rotas: " + error);
                }
            });
    }

    const readTravellersWithoutRoutes = async (customerId) => {
        setLoadTravellerWithoutRoutes(true);
        const tempToken = await getToken();
        routeSolverApis.get(`customer/${customerId}/travellersWithFilters`, {
            params: {
                perRow: 3,
                withRoutes: false
            },
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                setTravellersWithoutRoutes(response.data);
                console.log("travellers without routes response: " + JSON.stringify(response.data));
                setLoadTravellerWithoutRoutes(false);
                loadedEverything();
            })
            .catch(error => {
                setLoadTravellerWithoutRoutes(false);
                loadedEverything();
                if (error.response) {
                    console.log("Erro ao buscar viajantes sem rotas. " + error.response.data);
                } else {
                    console.log("Erro ao buscar viajantes sem rotas: " + error);
                }
            });
    }

    const readRoutes = async (customerId) => {
        setLoadVisitPoints(true);
        const tempToken = await getToken();
        routeSolverApis.get("lat-lon", {
            params: { customerId: customerId, 
                addressesPerLine: 3
            },
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                setVisitPoints(response.data);
                setLoadVisitPoints(false);
                loadedEverything();
            })
            .catch(error => {
                setLoadVisitPoints(false);
                loadedEverything();
                if (error.response) {
                    console.log("Erro ao buscar pontos de visita. " + error.response.data);
                } else {
                    console.log("Erro ao buscar pontos de visita: " + error);
                }
            });
    }

    const loadedEverything = () => {
        let isLoaded = loadTravellerWithRoutes && loadTravellerWithoutRoutes && loadVisitPoints
        setLoadingTravellersInfo(isLoaded);
    }

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

    const handleChangedRoutes = () => {
        const tempNumber = travellersRoutesChanged + 1;
        setTravellersRoutesChanged(tempNumber);
    }

    return (
        <LoadingOverlay
            active={loadingTravellersInfo}
            spinner
            text='Buscando viajantes e seus pontos de visita...'
        >
            {console.log("body - travellers with routes: " + JSON.stringify(travellersWithRoutes))}
            {console.log("body - travellers without routes: " + JSON.stringify(travellersWithoutRoutes))}
            {console.log("body - visit points: " + JSON.stringify(visitPoints))}
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
                        travellersWithRoutes={travellersWithRoutes}
                        handleChangedRoutes={handleChangedRoutes}
                    />
                }
            </div>

            <EmployeeRoutesModalNew
                open={showEmployeeRoutesModalNew}
                travellersWithoutRouteArrays={travellersWithoutRoutes}
                handleCloseModal={setShowEmployeeRoutesModalNew}
                visitPoints={visitPoints}
                handleChangedRoutes={handleChangedRoutes}
            />

        </LoadingOverlay>
    );
}

export default EmployeeRoutesPage;