import React, { useState } from 'react';
import Header from "../../components/Header";
import { Alert, Button, Container, Form } from "react-bootstrap";
import * as authentication from 'apis/authentication';
import { useHistory } from 'react-router-dom';
import { useToast } from 'toasts/useToast';

const PasswordChange = () => {
    const history = useHistory();
    const toast = useToast();
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [unknownError, setUnknownError] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [newPasswordValid, setNewPasswordValid] = useState(true);
    const [confirmationValid, setConfirmationValid] = useState(true);

    const handleOldPasswordUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value);
        setInvalidPassword(false);
    };

    const handleNewPasswordUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setNewPasswordValid(e.target.value.length >= 8);
        setConfirmationValid(e.target.value === confirmation);
    };

    const handleConfirmationUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmation(e.target.value);
        setConfirmationValid(e.target.value === newPassword);
    };

    const isValid = newPassword.length && confirmationValid && newPasswordValid;

    const changePassword = () => {
        authentication.changePassword({
            oldPassword,
            newPassword
        })
            .then(() => {
                history.push("/")
                toast('Passwort ändern', 'Passwort wurde geändert.');
            })
            .catch((error) => {
                if (error.response.status === 412) {
                    setInvalidPassword(true);
                } else {
                    setUnknownError(true);
                    toast('Passwort ändern', 'Passwort konnte nicht geändert werden.');
                }
            });
    };

    return <>
        <Header/>
        <Container className="mt-3 mb-5">
            <h1>Passwort ändern</h1>
            <Form onSubmit={changePassword}>
                <Form.Group controlId="oldPassword">
                    <Form.Label>Altes Passwort</Form.Label>
                    <Form.Control type="password" value={oldPassword}
                                  isInvalid={invalidPassword}
                                  autoComplete='current-password'
                                  onChange={handleOldPasswordUpdate}/>
                    <Form.Control.Feedback type='invalid'>Passwort falsch</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="newPassword">
                    <Form.Label>Neues Passwort</Form.Label>
                    <Form.Control type="password" value={newPassword}
                                  autoComplete='new-password'
                                  onChange={handleNewPasswordUpdate}
                                  isInvalid={!newPasswordValid}/>
                    <Form.Control.Feedback type='invalid'>Das neue Passwort muss mindestens 8 Zeichen lang
                        sein</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="passwordConfirmation">
                    <Form.Label>Neues Passwort bestätigen</Form.Label>
                    <Form.Control type="password" isInvalid={!confirmationValid}
                                  value={confirmation}
                                  onChange={handleConfirmationUpdate}
                                  autoComplete='new-password'/>
                    <Form.Control.Feedback type="invalid">Bestätigung stimmt nicht mit neuem Passwort
                        überein</Form.Control.Feedback>
                </Form.Group>
                {unknownError &&
                <Alert variant="danger">Es ist ein Fehler beim Ändern des Passworts aufgetreten.</Alert>}
                <Button type="submit" disabled={!isValid}>Speichern</Button>
            </Form>
        </Container>
    </>;
};

export default PasswordChange;
