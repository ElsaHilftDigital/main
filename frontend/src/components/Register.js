import React from 'react';
import { useForm } from 'react-hook-form';

const Register = () => {
    const { errors, handleSubmit, register } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <div className="container mt-3">
            <form onSubmit={handleSubmit(onSubmit)} >
            <div className="form-group">
                <label htmlFor="registerFormName">Name</label>
                <input name="registerFormName" ref={register({ required: true })} type="text" className="form-control" id="registerFormName" placeholder="Name" />
                {errors.registerFormName && (<span className="text-danger">Name wird benötigt</span>)}
            </div>
            <div className="form-group">
                <label htmlFor="registerFormEmail">Email address</label>
                <input name="registerFormEmail" ref={register({ required: true })} type="email" className="form-control" id="registerFormEmail" placeholder="Email" />
                {errors.registerFormEmail && (<span className="text-danger">Email wird benötigt</span>)}
            </div>
            <button type="submit" className="btn btn-primary">Absenden</button>
        </form>
        </div>
    );

};

export default Register;