import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const ResetPassword = () =>  {
  const authResult = new URLSearchParams(window.location.search); 
  const token = authResult.get('token')
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

      const handleResetPassword = (data) =>{
        setMessage("");
        setSuccessful(false);
        setLoading(true);
        AuthService.resetPassword(data.token, data.password).then(
            (response) => {
              setMessage("You have successfully changed your password.");
              setSuccessful(true);
              setLoading(false);
              console.log(response.data);
              console.log(JSON.stringify(data, null, 2));
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();

                setLoading(false);
                setSuccessful(false);
                setMessage(resMessage);
            }
          );
    }
  return (
    <div className="container" style={{width: '40rem'}}>
			<div className="card">
				  <div className="card-header alert-info text-center h3">
				  <h2>Reset Password</h2>
				  </div>
                  <form onSubmit={handleSubmit(handleResetPassword)}>
                    <div className="card-body">
                             <div className="form-group">
                                <input  {...register('token')} type="text" className="form-control" name='token' id="token" aria-describedby="newpassword" value={token} placeholder="Enter your new password" style={{ display: "none" }}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="newpassword" className='col-form-label font-weight-bold'>Password: </label>
                                <input 
                                type="password" 
                                name='password' 
                                id="newpassword" 
                                aria-describedby="newpassword" 
                                placeholder="Enter your new password" 
                                autoFocus 
                                {...register('password')}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                />
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className='col-form-label font-weight-bold'>Confirm Password: </label>
                                <input 
                                type="password" 
                                name="confirmPassword" 
                                id="confirmPassword"  
                                aria-describedby="email" 
                                placeholder="Enter your confirm password"
                                {...register('confirmPassword')}
                                className={`form-control ${
                                  errors.confirmPassword ? 'is-invalid' : ''
                                }`}
                                />
                                <div className="invalid-feedback">
                                  {errors.confirmPassword?.message}
                                </div>
                            </div>                          
                            <div className="form-group">
                            <button type='submit' className="btn btn-primary btn-block" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span> Change Password</span>
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
export default ResetPassword