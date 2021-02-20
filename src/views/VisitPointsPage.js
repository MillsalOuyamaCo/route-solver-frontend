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
import LoadingOverlay from 'react-loading-overlay';
import PanelHeaderWithImage from "components/PanelHeader/PanelHeaderWithImage.js";
import routeSolverApis from "services/routeSolverApis";
import VisitPointInfo from "components/VisitPoint/VisitPointInfo.js";
import VisitPointModalNew from "components/VisitPoint/VisitPointModalNew.js";

function VisitPointsPage() {
    let pageHeader = React.createRef();
    const customerIdAttribute = process.env.REACT_APP_AUTH0_CUSTOMER_ID_ATTRIBUTE;
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userInfo, setUserInfo] = React.useState(user);
    let customerId = user[customerIdAttribute];

    const [visitPointsQuantityChanged, setVisitPointsQuantityChanged] = useState(0);

    const [stringVisitPointToSearch, setStringVisitPointToSearch] = useState('');
    const [visitPointFiltered, setVisitPointFiltered] = useState([]);
    const [visitPointsFound, setVisitPointsFound] = useState([]);
    const [loadingVisitPoints, setLoadingVisitPoints] = useState(false);
    const [showNewVisitPointModal, setShowNewVisitPointModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setUserInfo(null);
        } else {
            readPoints(customerId);
        }
    }, [visitPointsQuantityChanged]); // Update if user changes

    const getToken = async () => {
        const tempToken = await getAccessTokenSilently({
            audiece: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:users",
        });

        return tempToken;
    }

    const handleVisitPointsChanged = () => {
        const tempNumber = visitPointsQuantityChanged + 1;
        setVisitPointsQuantityChanged(tempNumber);
    }

    const readPoints = async (customerId) => {
        setLoadingVisitPoints(true);
        const tempToken = await getToken();
        routeSolverApis.get("lat-lon", {
            params: { customer_id: customerId },
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
            .then(response => {
                setThreePointsPerRow(response.data);
                setLoadingVisitPoints(false);
            })
            .catch(error => {
                setLoadingVisitPoints(false);
                if (error.response) {
                    console.log("Erro ao buscar pontos de visita. " + error.response.data);
                } else {
                    console.log("Erro ao buscar pontos de visita: " + error);
                }
            });
    }

    const setThreePointsPerRow = (visitPoints) => {
        const tempArray = [], size = 3;

        while (visitPoints.length > 0) {
            tempArray.push(visitPoints.splice(0, size));
        }

        setVisitPointsFound(tempArray);
    }

    const registerNewVisitPoint = () => {
        setShowNewVisitPointModal(true);
    }

    const closeNewVisitPointModal = () => {
        setShowNewVisitPointModal(false);
    }

    const searchPoint = (e) => {
        e.preventDefault();
        //setStringVisitPointToSearch(e.target.value);

        let filteredPoint = visitPointsFound.map(visitPointsPerRow => {
            let points = visitPointsPerRow.filter(point => {
                return point.address_line.toLowerCase().includes(e.target.value.toLowerCase())
            });

            return points;
        });

        setVisitPointFiltered(filteredPoint);
    }

    return (
        <LoadingOverlay
            active={loadingVisitPoints}
            spinner
            text='Buscando Pontos de Visita...'
        >
            <PanelHeaderWithImage
                content={
                    <div
                        className="image-white text-center"
                        style={
                            { backgroundImage: "url(" + require("assets/img/visit-points.jpg") + ")" }
                        }
                        ref={pageHeader}
                    >
                        <h2 className="title">Pontos de Visita</h2>
                    </div>
                }
            />
            <div className="content">
                <Row>
                    <Col>
                        <Button
                            color="info"
                            className="btn-round"
                            onClick={registerNewVisitPoint}
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
                                <h5 className="title">Buscar Ponto de Visita</h5>
                            </CardHeader>
                            <CardBody>
                                <Form action="" className="form" method="" onSubmit={searchPoint}>
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
                                                    placeholder="Consulta por Nome do Ponto"
                                                    type="email"
                                                    onChange={(e) => { setStringVisitPointToSearch(e.target.value); searchPoint(e) }}
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
                    visitPointsFound !== null && visitPointsFound.length > 0 &&
                    <VisitPointInfo
                        visitPointsArrays={stringVisitPointToSearch == null || stringVisitPointToSearch.trim() === "" ? visitPointsFound : visitPointFiltered}
                        handleVisitPointsChanged={handleVisitPointsChanged}
                    />
                }

            </div>

            <VisitPointModalNew
                open={showNewVisitPointModal}
                handleCloseModal={closeNewVisitPointModal}
                customerId={customerId}
                handleVisitPointsChanged={handleVisitPointsChanged}
            />

        </LoadingOverlay>
    );
}

export default VisitPointsPage;