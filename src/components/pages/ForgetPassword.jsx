import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

function ForgetPassword() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
  });
    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm({
      resolver: yupResolver(validationSchema)
    });   

      const handleForgetPassword = data =>{
         setMessage("");
         setLoading(true);
        AuthService.fogetPassword(data.email).then(response => {
          console.log(JSON.stringify(data, null, 2));
          setMessage("We have sent a reset password link to your email. Please check.");
          setSuccessful(true);
          setLoading(false);
          console.log(response.data);  
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
        setLoading(false);
      }
        );
    }
  return (
    <div className="container" style={{width: '40rem'}}>
			<div className="card">
				  <div className="card-header alert-danger text-center h3">
				  <h2>Forgot Password</h2>
				  </div>
                  <form onSubmit={handleSubmit(handleForgetPassword)}>
                    <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="email" className='col-form-label font-weight-bold'>Email address: </label>
                                <input 
                                type="email" 
                                name='email' 
                                id="email"
                                aria-describedby="email" 
                                placeholder="Enter your email address" 
                                autoFocus
                                {...register('email')}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                                <small id="emailHelp" className="form-text text-muted">We will be sending a reset password link to your email.</small>                               
                            </div>
                            
                            <div className="form-group">
                            <button className="btn btn-primary btn-block" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span> Send</span>
                            </button>
                            </div>
                            {message && (
                                <div className="form-group">
                                <div
                                    className={ successful ? "alert alert-success" : "alert alert-danger" }
                                      role="alert"
                                    >
                                    {message}
                                </div>
                                </div>
                            )}
                        </div>
                    </form>
            </div>
    </div>
  )
}
export default ForgetPassword