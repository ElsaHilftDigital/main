import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { authenticationActions, authenticationSelectors } from '../../../store/authentication';

const AdminLogin = () => {
    const dispatch = useDispatch();
    const { errors, handleSubmit, register } = useForm();
    const loginError = useSelector(authenticationSelectors.loginError);

    const onSubmit = (values) => {
        dispatch(authenticationActions.login({
            username: values.loginUsername,
            password: values.loginPassword,
        }));
    };

    return (
        <div className="view bg border h-100" style={{padding: "0", backgroundImage: `url("ElsaHilftMehrBackgroundCropped.png")`, backgroundPositionX: "right", backgroundPositionY: "bottom",
        backgroundSize: "contain", backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 98.5%)"}}>
            <div className="container mt-3 mb-5" >
                <div className="d-flex flex-column align-items-center">
                    <img src="ElsaHilftMehrContour.png" className="align-middle" width="200" height="200" alt="" />
                </div>

                <h1 className="mb-4">Login</h1>
                {loginError && (
                    <span className="text-danger">Username/Passwort sind inkorrekt.</span>
                )}
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="form-group">
                        <label htmlFor="loginUsername">Username</label>
                        <input name="loginUsername" ref={register({ required: true })} type="text" className="form-control" id="loginUsername" placeholder="Username" />
                        {errors.loginUsername && (<span className="text-danger">Username wird benötigt</span>)}
                    </div>
                    <div className="form-group">
                        <label htmlFor="loginPassword">Passwort</label>
                        <input name="loginPassword" ref={register({ required: true })} type="password" className="form-control mb-4" id="loginPassword" placeholder="Passwort"/>
                        {errors.loginPassword && (<span className="text-danger">Passwort wird benötigt</span>)}
                    </div>
                    <button type="submit" className="btn btn-primary mb-5">Einloggen</button>
                </form>
                <a href="">Hier neu registrieren als Moderator</a>
            </div>
        </div>
    );
};

export default AdminLogin;