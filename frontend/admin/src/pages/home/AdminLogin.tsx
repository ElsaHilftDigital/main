import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as authentication from 'apis/authentication';
import { useLocation, useHistory } from 'react-router-dom';
import styled from "styled-components";
import { Container } from "react-bootstrap";
import background from 'assets/ElsaHilftMehrBackgroundCropped.png';
import logo from 'assets/elsahilft_Baden.png';

const Background = styled.div`
    background-image: url(${background});
    background-color: hsl(240, 100%, 99%);
    background-attachment: fixed;
    background-size: auto;
    background-position-x: right;
    background-position-y: bottom;
    background-repeat: no-repeat;
    min-height: 100vh;
`;

const AdminLogin = () => {
    const { errors, handleSubmit, register } = useForm();
    const [invalidCredentials, setInvalidCredentials] = useState(false);

    const history = useHistory();
    const location = useLocation<{ from: { pathname: string } }>();
    const { from } = location.state || { from: { pathname: "/" } };

    const onSubmit = (values: any) => {
        authentication.login(values)
            .then(() => history.replace(from))
            .catch(() => setInvalidCredentials(true));
    };

    return (
        <Background>
            <Container>
                <div className="d-flex flex-column align-items-center">
                    <img src={logo} className="align-middle mt-5" width="auto" height="auto" alt=""/>
                </div>

                <h1 className="mb-4">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="username">Benutzername</label>
                        <input name="username" ref={register()} type="text" className="form-control" id="username"
                               placeholder="Username"/>
                        {errors.username && (<span className="text-danger">Benutzername wird benötigt</span>)}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Passwort</label>
                        <input name="password" ref={register()} type="password" className="form-control mb-4"
                               id="password" placeholder="Passwort"/>
                        {errors.password && (<span className="text-danger">Passwort wird benötigt</span>)}
                        {invalidCredentials && (
                            <span className="text-danger">Benutzername oder Passwort ist inkorrekt.</span>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary mb-5">Einloggen</button>
                </form>
            </Container>
        </Background>
    );
};

export default AdminLogin;