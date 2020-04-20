import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import logo from 'assets/elsahilft_Baden.png';
import { useCookies } from "react-cookie";


const StyledNavbar = styled(Navbar)`
    max-height: 5rem;
`;

const Header = () => {
    const [cookies] = useCookies(['token']);
    const user = JSON.parse(atob(cookies.token)).sub;

    return (
        <StyledNavbar collapseOnSelect sticky="top" bg="primary" variant="dark" expand="md">
            <Navbar.Brand href="#">
                <img src={logo} className="mr-3" width="50" height="50" alt="logo"/>
                <span className="font-weight-bold">Elsa hilft</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#new-request">Neuer Auftrag</Nav.Link>
                    <Nav.Link href="#purchases">Aufträge</Nav.Link>
                    <Nav.Link href="#customers">Kunden</Nav.Link>
                    <Nav.Link href="#volunteers">Helfer</Nav.Link>
                </Nav>
                <Nav>
                    <NavDropdown alignRight id="user-dropdown" title={user} className="text-light">
                        <NavDropdown.Item>Passwort ändern</NavDropdown.Item>
                        <NavDropdown.Item>Abmelden</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </StyledNavbar>
    );
};

export default Header;

