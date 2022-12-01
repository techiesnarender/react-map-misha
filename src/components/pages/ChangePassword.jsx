import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const ChangePassword = () => {

  const currentUser = AuthService.getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

    const validationSchema = Yup.object().shape({
        oldpassword: Yup.string()
        .required('Old password is required'),
        newpassword: Yup.string()
        .required('New Password is required')
        .min(4, 'Password must be at least 4 characters')
        .max(40, 'Password must not exceed 40 characters')
        .notOneOf([Yup.ref('oldpassword'), null], 'New password must be different'),
    });

    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm({
      resolver: yupResolver(validationSchema)
    });

    const handleChangePassword = data =>{
        setMessage("");
        setSuccessful(false);
        setLoading(true);
        AuthService.changepassword(data.oldpassword, data.newpassword, currentUser.email).then(response => {
          setMessage("You have successfully changed your password.");
          setSuccessful(true);
          setLoading(false);
          console.log(JSON.stringify(data, null, 2));
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
    <div className="col-md-12">
      <div className="card card-container">
      <div className="card-header p-3 mb-2 bg-dark text-white">
            Change Password
      </div>
        <form onSubmit={handleSubmit(handleChangePassword)}>     
          <div>
          <div className="form-group">
            <label htmlFor="oldpassword">Old password</label>
            <input
              type="password"
              name="oldpassword"
              {...register('oldpassword')}
              className={`form-control ${errors.oldpassword ? 'is-invalid' : ''}`}
            />
             <div className="invalid-feedback">{errors.oldpassword?.message}</div>
          </div>
          <div className="form-group">
            <label htmlFor="newpassword">New password</label>
            <input
              type="password"
              name="newpassword"
              {...register('newpassword')}
              className={`form-control ${errors.newpassword ? 'is-invalid' : ''}`}
            />
             <div className="invalid-feedback">{errors.newpassword?.message}</div>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Update Password</span>
            </button>
          </div>
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
        </form>
      </div>
    </div>
  )
}
export default ChangePassword