import React from "react";
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import { Formik } from 'formik';
import * as yup from 'yup';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  FormFeedback,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import TransparentFooter from "components/Footers/TransparentFooter.js";

import { Link } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';

const LoginPage = ({ issuer, scope }) => {
  const [firstFocus, setFirstFocus] = React.useState(false);
  const [lastFocus, setLastFocus] = React.useState(false);

  const { authService } = useOktaAuth();
  const [sessionToken, setSessionToken] = React.useState('');
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showFailureModal, setShowFailureModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  const validationSchema = yup.object().shape({
    user: yup.string()
      .required("O email para login é obrigatório")
      .email("Insira um email válido"),
    password: yup.string()
      .required("A senha é obrigatória"),
  });

  let initialValues = {
    user: user,
    password: password
  };

  const enterSubmit = (e) => {
    console.log("Enter submit");
    console.log(e);
    if (e === "Enter") {
      handleSubmitForm(e);
    }
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const oktaAuth = new OktaAuth({
      issuer: issuer,
      scope: scope.split(/\s+/)
    });

    oktaAuth.signIn({ username: user, password: password })
      .then(response => {
        const sessionToken = response.sessionToken;
        setSessionToken(sessionToken);
        console.log(response);
        console.log(sessionToken);
        setIsLoading(false);
        authService.redirect({ sessionToken });
        //authService.login('/admin');
      })
      .catch(err => {
        setIsLoading(false);
        console.log("Found an error: ", err);
        console.log("Found an error: ", err.errorSummary);
        setErrorMessage(err.errorSummary);
        setShowFailureModal(true);
      });
  }

  return (
    <>
      <LoadingOverlay
        active={isLoading}
        spinner
        text='Carregando...'
      >
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
              <Col className="ml-auto mr-auto" md="4">
                <Card className="card-login card-plain">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                  >{({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                  }) => (
                      <Form action="" className="form" method="" onSubmit={handleSubmit}>
                        <CardHeader className="text-center">
                          <div className="logo-container">
                            <img
                              alt="..."
                              src={require("assets/img/now-logo.png")}
                            ></img>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <InputGroup
                            className={
                              "no-border input-lg" +
                              (firstFocus ? " input-group-focus" : "")
                            }
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="now-ui-icons users_circle-08"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Email"
                              type="text"
                              onFocus={() => setFirstFocus(true)}
                              onChange={handleChange}
                              onBlur={(e) => { setFirstFocus(false); setUser(e.target.value) }}
                              name="email"
                              value={values.last_name}
                              invalid={touched.last_name && !!errors.last_name}
                              valid={touched.last_name && !errors.last_name}
                            ></Input>
                            <FormFeedback>
                              {errors.first_name}
                            </FormFeedback >
                          </InputGroup>
                          <InputGroup
                            className={
                              "no-border input-lg" +
                              (lastFocus ? " input-group-focus" : "")
                            }
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="now-ui-icons text_caps-small"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Senha"
                              type="password"
                              onFocus={() => setLastFocus(true)}
                              onChange={handleChange}
                              onBlur={(e) => { setLastFocus(false); setPassword(e.target.value) }}
                            ></Input>
                          </InputGroup>
                        </CardBody>
                        <CardFooter className="text-center">
                          <Button
                            block
                            type="submit"
                            className="btn-round"
                            color="info"
                            href="#pablo"
                            onClick={handleSubmitForm}
                            onKeyDown={enterSubmit}
                            size="lg"
                          >
                            Login
                          </Button>
                          <div className="pull-left">
                            <h6>
                              <Link className="text-white small" to="/registration">
                                Create Account
                              </Link>
                            </h6>
                          </div>
                          <div className="pull-right">
                            <h6>
                              <a
                                className="link"
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Need Help?
                              </a>
                            </h6>
                          </div>
                        </CardFooter>
                      </Form>
                    )}
                  </Formik>
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

            </Container>
          </div>
          <TransparentFooter />
        </div>
      </LoadingOverlay>
    </>
  );
}

export default LoginPage;
