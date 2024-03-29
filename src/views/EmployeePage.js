import React from "react";

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
import EmployeeModal from "components/Employee/EmployeeModal.js";
import EmployeeInfo from 'components/Employee/EmployeeInfo.js';
import EmployeeFoundModal from 'components/Employee/EmployeeFoundModal.js';
import { useAuth0 } from "@auth0/auth0-react";
import routeSolverApis from "services/routeSolverApis";
import LoadingOverlay from 'react-loading-overlay';

function EmployeePage() {
    let pageHeader = React.createRef();
    const customerIdAttribute = process.env.REACT_APP_AUTH0_CUSTOMER_ID_ATTRIBUTE;
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userInfo, setUserInfo] = React.useState(user);
    const [customerId, setCustomerId] = React.useState(user[customerIdAttribute]);
    const [employees, setEmployees] = React.useState([]);
    const [employeesQuantityChanged, setEmployeesQuantityChanged] = React.useState(0);
    const [employeeQuantityFound, setEmployeeQuantityFound] = React.useState(0);
    const [loadingEmployees, setLoadingEmployees] = React.useState(false);

    React.useEffect(() => {
        if (!isAuthenticated) {
            setUserInfo(null);
        } else {
            callEmployees(user[customerIdAttribute]);
        }
    }, [employeesQuantityChanged, employeeQuantityFound]); // Update if user changes

    const [firstFocus, setFirstFocus] = React.useState(false);

    const [showNewEmployee, setShowNewEmployee] = React.useState(false);
    const [employeeEmailToSearch, setEmployeeEmailToSearch] = React.useState('');
    const [showFoundEmployee, setShowFoundEmployee] = React.useState(false);
    const [employeeFromSearch, setEmployeeFromSearch] = React.useState(null);

    const registerNewEmployee = () => {
        setShowNewEmployee(true);
    }

    const closeModal = () => {
        setShowNewEmployee(false);
    }

    const closeEmployeeFoundModal = () => {
        setEmployeeFromSearch(null);
        setShowFoundEmployee(false);
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoadingEmployees(true);
        const tempToken = await getToken();
        routeSolverApis.get(`customer/${customerId}/employee/${employeeEmailToSearch}`, {
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
        .then(response => {
            setEmployeeFromSearch(response.data);
            setShowFoundEmployee(true);
            setLoadingEmployees(false);
        })
        .catch(error => {
            setLoadingEmployees(false);
            if (error.response) {
                console.log("Erro ao buscar funcionários. " + error.response.data);
            } else {
                console.log("Erro ao buscar funcionários: " + error);
            }
        })
    }

    const getToken = async () => {
        const tempToken = await getAccessTokenSilently({
            audiece: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:users",
        });

        return tempToken;
    }

    const handleEmployeesChanged = () => {
        const tempNumber = employeesQuantityChanged + 1;
        setEmployeesQuantityChanged(tempNumber);
    }

    const handleEmployeeFound = () => {
        const tempNumber = employeeQuantityFound + 1;
        setEmployeeQuantityFound(tempNumber);
    }

    const callEmployees = async (customerId) => {
        setLoadingEmployees(true);
        const tempToken = await getToken();
        routeSolverApis.get(`customer/${customerId}/employees`, {
            headers: {
                'Authorization': `bearer ${tempToken}`
            }
        })
        .then(response => {
            console.log(response);
            setEmployees(response.data);
            setLoadingEmployees(false);
        })
        .catch(error => {
            setLoadingEmployees(false);
            if (error.response) {
                console.log("Erro ao buscar funcionários. " + error.response.data);
            } else {
                console.log("Erro ao buscar funcionários: " + error);
            }
        });
    }

    return (
        <LoadingOverlay
            active={loadingEmployees}
            spinner
            text='Buscando Funcionários...'
        >
            <PanelHeaderWithImage
                content={
                    <div
                        className="image-white text-center"
                        style={{
                            backgroundImage: "url(" + require("assets/img/employee.jpg") + ")",
                        }}
                        ref={pageHeader}
                    >
                        <h2 className="title">Funcionários</h2>
                    </div>
                }
            />
            <div className="content">
                <Row>
                    <Col>
                        <Button
                            color="info"
                            className="btn-round"
                            onClick={registerNewEmployee}
                        >
                            Novo
                        </Button>
                        <Button
                            color="info"
                            className="btn-round"
                        >
                            Upload
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card
                            className="pr-1"
                            md="5"
                        >
                            <CardHeader>
                                <h5 className="title">Buscar Funcionário</h5>
                            </CardHeader>
                            <CardBody>
                                <Form action="" className="form" method="" onSubmit={handleSearch}>
                                    <Row>
                                        <Col>
                                            <InputGroup
                                                className={
                                                    "no-border input-lg" +
                                                    (firstFocus ? " input-group-focus" : "")
                                                }
                                            >
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="now-ui-icons ui-1_zoom-bold">
                                                        </i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Buscar por E-mail do Funcionário"
                                                    type="email"
                                                    onBlur={(e) => { setEmployeeEmailToSearch(e.target.value) }}
                                                    onChange={(e) => { setEmployeeEmailToSearch(e.target.value) }}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col md="2">
                                            <Button
                                                color="info"
                                                type="submit"
                                                className="btn-round"
                                                onClick={e => { handleSearch(e) }}
                                            >
                                                Buscar
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                {
                    employees != null && employees.length > 0 &&
                    <EmployeeInfo
                        employees={employees}
                        handleEmployeesChanged={handleEmployeesChanged}
                    />
                }

                {
                    employeeFromSearch != null &&
                    <EmployeeFoundModal
                        open={showFoundEmployee}
                        handleEmployeeFound={handleEmployeeFound}
                        handleCloseEmployeeFound={closeEmployeeFoundModal}
                        handleEmployeesChanged={handleEmployeesChanged}
                        employee={employeeFromSearch}
                    />
                }

                <EmployeeModal
                    open={showNewEmployee}
                    handleCloseModal={closeModal}
                    customerId={customerId}
                    handleEmployeesChanged={handleEmployeesChanged}
                />
            </div>
        </LoadingOverlay>
    );
}

export default EmployeePage;
