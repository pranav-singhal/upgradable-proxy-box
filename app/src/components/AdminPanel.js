import React, {useEffect, useState} from "react";
import {connectToWeb3, getImplementationFunctions, switchTo} from "../Web3/adminPanel";
import SegregatedPanel from "./segregatedPanel/SegregatedPanel";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import "../App.scss";
import Loading from "./Loading";
import {Form} from "react-bootstrap";

const readFormArray = [];
const writeFormArray = [];
const readPanelViewBoolean = true;
const writePanelViewBoolean = false;

const AdminPanel = props => {
  const [readForm, setReadForm] = useState(readFormArray);
  const [writeForm, setWriteForm] = useState(writeFormArray);
  const [readPanelView, setReadPanelView] = useState(readPanelViewBoolean);
  const [writePanelView, setWritePanelView] = useState(writePanelViewBoolean);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [currentContractAddress, setCurrentContractAddress] = useState('')
  const [alternateContractAddress, setAlternateContractAddress] = useState('')


  useEffect(() => {
    let tempRead = [];
    let tempWrite = [];
    setLoadingStatus(true);
    connectToWeb3().then(addressObj => {
      console.log(addressObj)

      setCurrentContractAddress(addressObj.IMPLEMENTATION_ADDRESS)
      setAlternateContractAddress(addressObj.unImplementedAddress)
      return true
    }).then(() => {
      return getImplementationFunctions()

    }).then(implementationFunctions => {
      console.log(implementationFunctions);
      implementationFunctions.forEach(func => {
        if (func.isView) {
          tempRead.push(func);
        } else {
          tempWrite.push(func);
        }

      });
      setReadForm(tempRead);
      setWriteForm(tempWrite);
      setLoadingStatus(false)
    })
  }, []);


  const readClick = () => {
    setReadPanelView(true);
    setWritePanelView(false);
  };

  const writeClick = () => {
    setReadPanelView(false);
    setWritePanelView(true);
  };
  const switchContract = (e) => {
    console.log(e.target.value)
    switchTo(e.target.value).then(()=>{
      window.location.reload()
    })

  }

  return (
      <Container fluid={"true"}>
        <Navbar expand="lg">

          <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"> </span>
          </button>

          <Navbar.Collapse>
            <Nav className={'justify-content-left'}>
              <Nav.Link>
                <Form.Label>
                  Switch Contracts
                </Form.Label>
                <Form.Control as={'select'} onChange={switchContract}>
                  <option value={currentContractAddress}>{currentContractAddress}</option>
                  <option value={alternateContractAddress}>{alternateContractAddress} </option>
                </Form.Control>
              </Nav.Link>

            </Nav>
            <Nav className={"ml-auto"}>
              <Nav.Link>
                <Button onClick={readClick}>Read Panel</Button>
              </Nav.Link>
              <Nav.Link>
                <Button onClick={writeClick}>Write Panel</Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Row>
          <Col md={12}>
            <h1> Admin Panel</h1>
          </Col>
        </Row>

        {loadingStatus ? (
            <Loading heading={"Loading Contract..."}/>
        ) : (
            <Row>
              {!readPanelView ? (
                  <SegregatedPanel
                      panelName={"write"}
                      form={writeForm}
                      view={writePanelView}
                  />
              ) : (
                  <SegregatedPanel
                      panelName={"read"}
                      form={readForm}
                      view={readPanelView}
                  />
              )}
            </Row>
        )}
      </Container>
  );
};


export default AdminPanel;
