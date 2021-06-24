import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap";
import Select from 'react-select';

// core components
import { useAuth0 } from "@auth0/auth0-react";
import PanelHeaderTraveller from "components/PanelHeader/PanelHeaderTraveller";
import routeSolverApis from "services/routeSolverApis.js";
import LoadingOverlay from 'react-loading-overlay';
import ButtonGps from "components/TravellerDashboard/ButtonGps.js";
import CardSubtitle from "reactstrap/lib/CardSubtitle";
import {
  BsExclamationTriangle,
  BsCheck,
  BsChevronCompactUp,
  BsChevronCompactDown
} from "react-icons/bs";
import { IconContext } from "react-icons";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const TravellerDashboard = () => {
  let pageHeader = React.createRef();

  const { user, getAccessTokenSilently } = useAuth0();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customersToSelect, setCustomersToSelect] = useState([]);
  const [travellerData, setTravellerData] = useState(null);
  const [travellerOptimizedRoute, setTravellerOptimizedRoute] = useState(null);
  const [nextVisitPoint, setNextVisitPoint] = useState(null);
  const [isLoadingTravellerCustomerInfo, setIsLoadingTravellerCustomerInfo] = useState(false);
  const [isLoadingNextVisitPoint, setIsLoadingNextVisitPoint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState(true);

  const [addressToCenterMap, setAddressToCenterMap] = useState([]);
  const [addressPins, setAddressPins] = useState([]);

  const [currentPosition, setCurrentPosition] = useState([]);
  const [checkinChanged, setCheckinChanged] = useState(0);

  const [confirmationToSaveModalIsOpen, setConfirmationToSaveModalIsOpen] = useState(false);
  const [positionAlertModalIsOpen, setPositionAlertModalIsOpen] = useState(false);

  const [checkinPointToSave, setCheckinPointToSave] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isOpenModalSuccessCheckIn, setIsOpenModalSuccessCheckIn] = useState(false);
  const [isOpenModalFailureCheckin, setIsOpenModalFailureCheckin] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');

  const handleSetCustomer = async (selectedCustomer) => {
    getNextEndpoint(selectedCustomer);
    setSelectedCustomer(selectedCustomer);
    setIsLoadingTravellerCustomerInfo(true);
    const customerId = selectedCustomer.value.customer_id;
    const token = await getAccessTokenSilently();
    routeSolverApis.get(`employees-points/traveller/${travellerData.id}/customer/${customerId}`, {
      headers: {
        'Authorization': `bearer ${token}`
      }
    })
      .then(response => {
        setTravellerOptimizedRoute(response.data);
        response.data.optimized_route.map((point) => {
          const latLon = [];
          latLon.push(point.latitude);
          latLon.push(point.longitude);
          addressPins.push(latLon);
        });

        addressToCenterMap.push(response.data.optimized_route[0].latitude);
        addressToCenterMap.push(response.data.optimized_route[0].longitude);
        setIsLoadingTravellerCustomerInfo(false);
      })
      .catch(error => {
        console.log("Erro ao buscar traveller: " + error);
        setIsLoadingTravellerCustomerInfo(false);
      });
  }

  const getNextEndpoint = async (selectedCustomer) => {
    setIsLoadingNextVisitPoint(true);
    const customerId = selectedCustomer.value.customer_id;
    const token = await getAccessTokenSilently();
    routeSolverApis.get(`employees-points/traveller/${travellerData.id}/customer/${customerId}/nextVisitPoint`, {
      headers: {
        'Authorization': `bearer ${token}`
      }
    })
      .then(response => {
        setNextVisitPoint(response.data);
        setIsLoadingNextVisitPoint(false);
      })
      .catch(error => {
        console.log("Erro ao buscar proximo ponto de visita: " + error);
        setIsLoadingNextVisitPoint(false);
      });
  }

  useEffect(() => {
    getEmployeeData(user.sub);
    handleNavigatorPermission();
  }, []);


  useEffect(() => {
    if (selectedCustomer !== null) {
      handleSetCustomer(selectedCustomer);
      getNextEndpoint(selectedCustomer);
    }
  }, [checkinChanged]);

  const entitiesChanged = () => {
    const tempChanged = checkinChanged + 1;
    setCheckinChanged(tempChanged);
  }

  const handleNavigatorPermission = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            navigator.geolocation.getCurrentPosition(success);
            return true;
            //If granted then you can directly call your function here
          } else if (result.state === "prompt") {
            console.log(result.state);
            navigator.geolocation.getCurrentPosition(success, errors, options);
            return true;
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
            setPositionAlertModalIsOpen(true);
            return false;
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const success = (pos) => {
    var currentCordinates = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${currentCordinates.latitude}`);
    console.log(`Longitude: ${currentCordinates.longitude}`);
    console.log(`More or less ${currentCordinates.accuracy} meters.`);

    setCurrentPosition(currentCordinates);
  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setPositionAlertModalIsOpen(true);
  }

  const getEmployeeData = async (id) => {
    setIsLoading(true);
    let replacedId = id.replace("auth0|", "");
    const token = await getAccessTokenSilently();
    //TODO trocar por id do parametro
    routeSolverApis.get(`employee/${replacedId}`, {
      headers: {
        'Authorization': `bearer ${token}`
      }
    })
      .then(response => {
        setTravellerData(response.data);

        const routeToSelect = response.data.customers_ids.map(customer => {
          return {
            value: customer,
            label: customer.customer_name
          }
        });

        setCustomersToSelect(routeToSelect);

        setIsLoading(false);
      })
      .catch(error => {
        console.log("Error getting traveller data: " + error);
        setIsLoading(false);
      });
  }

  const handleCheckinToSave = (pointToCheckin) => {
    setCheckinPointToSave(pointToCheckin);
    setConfirmationToSaveModalIsOpen(true);
  }

  const saveCheckin = async () => {
    closeConfirmationToSaveModal();
    setIsCheckingIn(true);
    handleNavigatorPermission();
    const customerId = selectedCustomer.value.customer_id;
    const token = await getAccessTokenSilently();
    routeSolverApis.post(`checkin`, {
      employee_id: travellerData.id,
      customer_id: customerId,
      address: {
        address_id: checkinPointToSave.address_id,
        country_region: checkinPointToSave.country_region,
        admin_district: checkinPointToSave.admin_district,
        locality: checkinPointToSave.locality,
        postal_code: checkinPointToSave.postal_code,
        neighborhood: checkinPointToSave.neighborhood,
        address_line: checkinPointToSave.address_line,
        address_number: checkinPointToSave.address_number,
        lat_lon: {
          latitude: checkinPointToSave.latitude,
          longitude: checkinPointToSave.longitude,
        }
      },
      checked_in_coordinates: {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        meters_precision: currentPosition.accuracy
      }
    }, {
      headers: {
        'Authorization': `bearer ${token}`
      }
    })
      .then(() => {
        entitiesChanged();
        setIsCheckingIn(false);
        setIsOpenModalSuccessCheckIn(true);
      })
      .catch(error => {
        if (error.response) {
          console.log("Erro ao salvar ponto de visita. " + error.response.data);
          setFailureMessage("Erro ao salvar ponto de visita. " + error.response.data);
        } else {
          console.log("Erro ao salvar ponto de visita: " + error);
          setFailureMessage("Erro ao salvar ponto de visita: " + error);
        }
        setIsCheckingIn(false);
        setIsOpenModalFailureCheckin(true);
      });
  }

  const closeConfirmationToSaveModal = () => {
    setConfirmationToSaveModalIsOpen(false);
    setCheckinPointToSave(null);
  }

  return (
    <LoadingOverlay
      active={isLoadingTravellerCustomerInfo && isLoadingNextVisitPoint && isLoading}
      spinner
      text='Buscando Informações...'
    >
      <PanelHeaderTraveller
        size="sm"
        content={
          <div className="traveller text-center"
            style={{
              backgroundImage: "url(" + require("assets/img/pexels-ylanite-koppens-697662-xs.jpg") + ")",
            }}
            ref={pageHeader}
          >
            <h4 className="title">Bem vindo {user.given_name}</h4>
          </div>
        }
      />
      <div className="content">
        <Row>
          <Col xs={12} md={4}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Selecione a Empresa</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={12}>
                    <Select
                      value={selectedCustomer}
                      onChange={handleSetCustomer}
                      options={customersToSelect}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {
          //Mapa
        }
        {travellerOptimizedRoute !== null &&
          <Row>
            <Col xs={12} md={4}>
              <Card className="card-chart">
                <CardHeader>
                  {isMapCollapsed ?
                    <BsChevronCompactUp
                      className="pull-right"
                      onClick={() => setIsMapCollapsed(!isMapCollapsed)}
                    /> :
                    <BsChevronCompactDown
                      className="pull-right"
                      onClick={() => setIsMapCollapsed(!isMapCollapsed)}
                    />
                  }
                  <h5 className="card-category">Mapa</h5>
                </CardHeader>
                <Collapse isOpen={isMapCollapsed}>
                  <CardBody>
                    <MapContainer
                      // center={[51.505, -0.09]}
                      center={addressToCenterMap}
                      zoom={12}
                      scrollWheelZoom={false}
                      style={{ height: '50vh', width: '100wh' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {addressPins.map((pin, key) => {
                        return (
                          <Marker key={key} position={pin}>
                            <Popup>
                              Destino {key + 1}
                            </Popup>
                          </Marker>
                        );
                      })
                      }
                    </MapContainer>
                  </CardBody>
                </Collapse>
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        }

        {travellerOptimizedRoute !== null &&
          nextVisitPoint !== null &&
          <ButtonGps
            visitPoint={nextVisitPoint}
          />
        }

        {
          //visit points cards
        }
        {travellerOptimizedRoute !== null &&
          <Row>
            {travellerOptimizedRoute.optimized_route.map((optimized_point, key) => {
              return (
                <Col key={optimized_point.address_id} md={4} sm={12} xs={12}>
                  <Card className="card-chart">
                    <CardHeader>
                      <CardSubtitle tag="h4" className="card-category">Destino {optimized_point.priority}</CardSubtitle>
                    </CardHeader>
                    <CardBody onClick={() => { handleCheckinToSave(optimized_point) }} >
                      <CardSubtitle tag="h5" className="text-info">{optimized_point.address_line}, {optimized_point.address_number} - {optimized_point.neighborhood}</CardSubtitle>
                    </CardBody>
                    <CardFooter>
                      {optimized_point.checked_in ?
                        <IconContext.Provider value={{ color: "green", className: "global-class-name", size: "3em" }}>
                          <BsCheck
                            id="tooltip389516969"
                          />
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip389516969"
                          >
                            Check-In já realizado
                          </UncontrolledTooltip>
                        </IconContext.Provider>
                        :
                        <IconContext.Provider value={{ color: "yellow", className: "global-class-name", size: "3em" }}>
                          <BsExclamationTriangle
                            id="tooltip326247652"
                          />
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip326247652"
                          >
                            Check-In não realizado
                          </UncontrolledTooltip>
                        </IconContext.Provider>
                      }
                    </CardFooter>
                  </Card>
                </Col>
              );
            })
            }
          </Row>
        }

        {travellerOptimizedRoute !== null &&
          checkinPointToSave !== null &&
          checkinPointToSave.checked_in === false &&
          <Modal
            isOpen={confirmationToSaveModalIsOpen}
            centered
          >
            <ModalBody>
              Gostaria de realizar o Checkin do Destino {checkinPointToSave.address_line}, {checkinPointToSave.address_number} - {checkinPointToSave.neighborhood}?
            </ModalBody>
            <ModalFooter>
              <Button
                className="btn-round pull-left"
                color="secondary"
                onClick={() => { closeConfirmationToSaveModal() }}
              >
                Cancelar
              </Button>
              <Button
                className="btn-round pull-right"
                color="info"
                onClick={() => { saveCheckin() }}
              >
                Ok
              </Button>
            </ModalFooter>
          </Modal>
        }

        <Modal
          isOpen={positionAlertModalIsOpen}
          centered
        >
          <ModalBody>
            Você precisa habilitar a localização para utilizar o LogMaps.
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-round pull-right"
              color="info"
              onClick={() => { setPositionAlertModalIsOpen(false) }}
            >
              Ok
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={isCheckingIn}
          centered
          size="xs"
        >
          <ModalBody>
            <Row>
              <Col xs={2}>
                <Spinner color="primary" />
              </Col>
              <Col xs={10}>
                <strong className="font-weight-bold">
                  Realizando o Check-In
                </strong>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={isOpenModalFailureCheckin}
          centered
          size="xs"
        >
          <ModalBody>
            <Row>
              <strong className="font-weight-bold">
                Erro ao salvar realizer Check-In:
              </strong>
              {failureMessage}
            </Row>
            <Button
              color="danger"
              className="btn-round pull-right"
              onClick={() => setIsOpenModalFailureCheckin(false)}
            >
              Ok
            </Button>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={isOpenModalSuccessCheckIn}
          centered
          size="xs"
        >
          <ModalBody>
            <strong className="font-weight-bold">
              Check-In realizado com sucesso!
            </strong>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              className="btn-round float-right"
              onClick={() => setIsOpenModalSuccessCheckIn(false)}
            >
              Ok
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </LoadingOverlay>
  );
}

export default TravellerDashboard;
