import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { matchPath } from 'react-router-dom';

import history from '../history';

const Header = (props) => {
    const currLocation = props.history.location.pathname;

    const navigate = (route) => () => {
        if (route === currLocation) {
            return;
        }

        history.push(route)
    };

    if (!!matchPath(history.location.pathname, "/login")) {
        return null;
    }

    return (
        <Navbar sticky="top" bg="primary" expand="md">
            <Navbar.Brand onClick={navigate("/")} className="hover-pointer" >
            <img src="ElsaHilftMehr.png" className="mr-3" width="50" height="50" alt="" />
            <span className="text-light font-weight-bold">Elsa hilft</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav activeKey={currLocation} className="mr-auto">
                    <Nav.Link onClick={navigate("/new-request")} eventKey="/new-request" className="text-light font-weight-bold">Neuer Auftrag</Nav.Link>
                    <Nav.Link onClick={navigate("/purchases")} eventKey="/purchases" className="text-light font-weight-bold">Aufträge</Nav.Link>
                    <Nav.Link onClick={navigate("/customers")} eventKey="/customers" className="text-light font-weight-bold">Kunden</Nav.Link>
                    <Nav.Link onClick={navigate("/volunteers")} eventKey="/volunteers" className="text-light font-weight-bold">Helfer</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;

