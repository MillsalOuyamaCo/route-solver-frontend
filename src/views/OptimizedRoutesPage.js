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
import { useAuth0 } from "@auth0/auth0-react";
import PanelHeaderWithImage from "components/PanelHeader/PanelHeaderWithImage.js";
import LoadingOverlay from 'react-loading-overlay';
import routeSolverApis from "services/routeSolverApis";
import OptimizedRoutesInfo from "components/OptimizedRoutes/OptimizedRoutesInfo";

function OptimizedRoutesPage() {
    let pageHeader = React.createRef();
    const customerIdAttribute = process.env.REACT_APP_AUTH0_CUSTOMER_ID_ATTRIBUTE;
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userInfo, setUserInfo] = React.useState(user);
    let customerId = user[customerIdAttribute];
    const [isLoading, setIsLoading] = useState(false);

    const [stringTravellerToSearch, setStringTravellerToSearch] = useState('');
    const [travellersFound, setTravellersFound] = useState([]);
    const [travellerFiltered, setTravellerFiltered] = useState([]);

    const [travellersQuantityChanged, setTravellersQuantityChanged] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            setUserInfo(null);
        } else {
            readTravellers(customerId);
        }
    }, [travellersQuantityChanged]); // Update if user changes

    const handleOptimizedTravellerChanged = () => {
        const tempNumber = travellersQuantityChanged + 1;
        setTravellersQuantityChanged(tempNumber);
    }

    const searchTraveller = (e) => {
        e.preventDefault();
        //setStringVisitPointToSearch(e.target.value);
        let filteredTraveller = travellersFound.map(traveller => {
            let points = traveller.filter(point => {
                return point.email.toLowerCase().includes(e.target.value.toLowerCase())
            });

            return points;
        });

        setTravellerFiltered(filteredTraveller);
    }

    const readTravellers = async (customerId) => {
        setIsLoading(true);
        const token = await getAccessTokenSilently();
        console.log("Token: " + token);
        routeSolverApis.get(`route-optimizer/${customerId}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
            .then(response => {
                setTravellersFound(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                if (error.response) {
                    console.log("Erro ao buscar rota otimizada. " + error.response.data);
                } else {
                    console.log("Erro ao buscar rota otimizada: " + error);
                }
            });
    }

    return (
        <LoadingOverlay
            active={isLoading}
            spinner
            text='Buscando rotas otimizadas...'
        >
            {console.log("optimized travellers found: " + JSON.stringify(travellersFound))}
            <PanelHeaderWithImage
                content={
                    <div
                        className="image-white text-center"
                        style={{
                            backgroundImage: "url(" + require("assets/img/best-routes.jpg") + ")",
                        }}
                        ref={pageHeader}
                    >
                        <h2 className="title">Melhores Rotas</h2>
                    </div>
                }
            />
            <div className="content">
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
                                                    placeholder="Buscar por E-mail Viajante"
                                                    type="text"
                                                    onChange={(e) => { setStringTravellerToSearch(e.target.value); searchTraveller(e) }}
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
                    travellersFound !== null && travellersFound.length > 0 &&
                    <OptimizedRoutesInfo
                        optimizedTravellerArray={stringTravellerToSearch == null || stringTravellerToSearch.trim() === "" ? travellersFound : travellerFiltered}
                        handleOptimizedTravellerChanged={handleOptimizedTravellerChanged}
                    />
                }
            </div>
        </LoadingOverlay>
    );
}

export default OptimizedRoutesPage;