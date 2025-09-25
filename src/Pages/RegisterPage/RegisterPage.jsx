import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Password is required")
});

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.get('http://localhost:3000/users', {
        params: { username: values.username },
      });

      const existingUsers = response.data;

      if (existingUsers.length > 0) {
        setFieldError('username', 'Username already exists');
      } else {
        const newUser = {
          username: values.username,
          password: values.password,
        };

      
        const res = await axios.post('http://localhost:3000/users', newUser);
        const savedUser = res.data; 
        localStorage.setItem('user', JSON.stringify(savedUser));

        
        navigate('/landing');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong, please try again.');
    }

    setSubmitting(false);
  };

  return (
    <div className="container-login">
      <div className="row col-md-4">
        <Formik
          initialValues={{ username: '', password: '', confirmpassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form className='form'>
              <h2 className="text-center mb-5">Create New Account</h2>
              <div className="item-form">
                <label>Username</label>
                <Field className="input-feild" name="username" type="text" />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              <div className="item-form">
                <label>Password</label>
                <Field className="input-feild" name="password" type="password" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="item-form">
                <label>Confirm Password</label>
                <Field className="input-feild" name="confirmpassword" type="password" />
                <ErrorMessage name="confirmpassword" component="div" className="error" />
              </div>

              <div className="item-form">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Register"}
                </button>
                <p>Already have an account? <Link className='bttn' to="/">Login</Link></p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
