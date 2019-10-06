import React, { useEffect, useState } from "react";
import { connectToWeb3, getImplementationFunctions } from "../Web3/adminPanel";
import SegregatedPanel from "./segregatedPanel/SegregatedPanel";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import "../App.scss";
import Loading from "./Loading";

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

  useEffect(() => {
    async function fetchData() {
      setLoadingStatus(true);
      await connectToWeb3();
      let form = await getImplementationFunctions();
      let tempRead = [];
      let tempWrite = [];
      form.forEach(func => {
        if (func.isView) {
          tempRead.push(func);
        } else {
          tempWrite.push(func);
        }
      });
      console.log("after foreach");
      setReadForm(tempRead);
      setWriteForm(tempWrite);
      console.log("loadingStatus", "loadingStatus");
      setLoadingStatus(false);
    }

    fetchData();
    console.log("loadingStatus", loadingStatus);
  }, []);

  const readClick = () => {
    setReadPanelView(true);
    setWritePanelView(false);
  };

  const writeClick = () => {
    setReadPanelView(false);
    setWritePanelView(true);
  };

  return (
    <Container fluid={"true"}>
      <Navbar expand="lg">
        <a className="navbar-brand" href="#">
          <img src={"./assets/logo.png"} />
        </a>
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
        <Loading heading={"Loading Contract..."} />
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

// export default withRouter(WithAuth(AdminPanel));
export default AdminPanel;
