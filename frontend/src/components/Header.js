import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

import history from '../history';
import AuthenticationHeader from './AuthenticationHeader';

const Header = (props) => {
    const currLocation = props.history.location.pathname;

    const navigate = (route) => () => {
        if (route === currLocation) {
            return;
        }

        history.push(route)
    };

    const adminLoginLocation = !!currLocation.match(/^\/admin(\/)?$/i);
    if (adminLoginLocation) {
        // don't show header on admin login page
        return null;
    }

    const adminHeader = !!currLocation.match(/^\/admin.*$/i);

    return (
        <Navbar sticky="top" bg="primary" expand="md">
            {adminHeader && (
                <>
                <Navbar.Brand onClick={navigate("/admin")} className="hover-pointer" >
                <img src="ElsaHilftMehr.png" className="mr-3" width="50" height="50" alt="" />
                <span className="text-light font-weight-bold">Elsa hilft</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav activeKey={currLocation} className="mr-auto">
                        <Nav.Link onClick={navigate("/admin/new-request")} eventKey="/admin/new-request" className="text-light font-weight-bold">Neuer Auftrag</Nav.Link>
                        <Nav.Link onClick={navigate("/admin/purchases")} eventKey="/admin/purchases" className="text-light font-weight-bold">Aufträge</Nav.Link>
                        <Nav.Link onClick={navigate("/admin/customers")} eventKey="/admin/customers" className="text-light font-weight-bold">Kunden</Nav.Link>
                        <Nav.Link onClick={navigate("/admin/volunteers")} eventKey="/admin/volunteers" className="text-light font-weight-bold">Helfer</Nav.Link>
                    </Nav>
                    <AuthenticationHeader />
                </Navbar.Collapse>
            </>
            )}
            {!adminHeader && (
                <>
                    <Navbar.Brand onClick={navigate("/")} className="hover-pointer" >
                    <img src="ElsaHilftMehr.png" className="mr-3" width="50" height="50" alt="" />
                    <span className="text-light font-weight-bold">Elsa hilft</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav activeKey={currLocation} className="mr-auto">
                            <Nav.Link onClick={navigate("/")} eventKey="/" className="text-light font-weight-bold">Home</Nav.Link>
                            <Nav.Link onClick={navigate("/register")} eventKey="/register" className="text-light font-weight-bold">Registrieren</Nav.Link>
                            <Nav.Link onClick={navigate("/about")} eventKey="/about" className="text-light font-weight-bold">Über Elsa hilft</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </>
            )}
        </Navbar>
    );
};

export default Header;

