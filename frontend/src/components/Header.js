import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

const Header = (props) => {
    const currLocation = props.location.pathname.substring(1);
    const navigate = (route) => () => props.history.push(route);

    return (
        <Navbar bg="primary" expand="sm">
            <Navbar.Brand>
                <img src="elsahilft_Baden.jpg" className="mr-3" width="50" height="50" alt="" />
                <span className="font-weight-bold">Elsa hilft</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav activeKey={currLocation} className="mr-auto">
                    <Nav.Link onClick={navigate("/")} eventKey="" className="text-dark font-weight-bold">Home</Nav.Link>
                    <Nav.Link onClick={navigate("/ping")} eventKey="ping" className="text-dark font-weight-bold">Ping</Nav.Link>
                    <Nav.Link onClick={navigate("/about")} eventKey="about" className="text-dark font-weight-bold">Über Elsa hilft</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;

