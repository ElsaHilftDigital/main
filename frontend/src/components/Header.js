import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

import Authentication from './Authentication';

const Header = (props) => {
    const currLocation = props.location.pathname;
    const navigate = (route) => () => {
        if (route === currLocation) {
            return;
        }

        props.history.push(route)
    };

    return (
        <Navbar sticky="top" bg="primary" expand="sm">
            <Navbar.Brand onClick={navigate("/")} className="hover-pointer" >
                <img src="elsahilft_Baden.jpg" className="mr-3" width="50" height="50" alt="" />
                <span className="text-light font-weight-bold">Elsa hilft</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav activeKey={currLocation} className="mr-auto">
                    <Nav.Link onClick={navigate("/")} eventKey="/" className="text-light font-weight-bold">Home</Nav.Link>
                    <Nav.Link onClick={navigate("/ping")} eventKey="/ping" className="text-light font-weight-bold">Ping</Nav.Link>
                    <Nav.Link onClick={navigate("/register")} eventKey="/register" className="text-light font-weight-bold">Registrieren</Nav.Link>
                    <Nav.Link onClick={navigate("/about")} eventKey="/about" className="text-light font-weight-bold">Über Elsa hilft</Nav.Link>
                </Nav>
                <Authentication />
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;

