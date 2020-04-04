import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Nav, Navbar } from 'react-bootstrap';

import history from '../history';
import { authenticationSelectors } from '../store/authentication';
import Authentication from './Authentication';

const Header = () => {
    const currLocation = history.location.pathname;
    const isLoggedIn = !!useSelector(authenticationSelectors.currentUser);
    const [ adminHeader, setAdminHeader ] = useState(!!currLocation.match(/^\/admin.*$/i))

    history.listen((location) => {
        setAdminHeader(!!location.pathname.match(/^\/admin.*$/i))
    });

    const navigate = (route) => () => {
        if (route === currLocation) {
            return;
        }

        history.push(route)
    };

    if (adminHeader && !isLoggedIn) {
        // no header for mainPage if not logged in 
        return null;
    }

    return (
        <Navbar sticky="top" bg="primary" expand="md">
            {adminHeader && (
                <>
                <Navbar.Brand onClick={navigate("/admin")} className="hover-pointer" >
                <img src="elsahilft_Baden.jpg" className="mr-3" width="50" height="50" alt="" />
                <span className="text-light font-weight-bold">Elsa hilft</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav activeKey={currLocation} className="mr-auto">
                        <Nav.Link onClick={navigate("/admin")} eventKey="/" className="text-light font-weight-bold">Dashboard</Nav.Link>
                    </Nav>
                    <Authentication />
                </Navbar.Collapse>
            </>
            )}
            {!adminHeader && (
                <>
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
                </>
            )}
        </Navbar>
    );
};

export default Header;

