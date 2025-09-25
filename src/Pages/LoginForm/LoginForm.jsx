import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react'
import './LoginForm.css'

const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});



export default function LoginForm() {
    const navigate = useNavigate();
    const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
        const response = await axios.get('http://localhost:3000/users', {
            params: {
                username: values.username,
                password: values.password,
        }
    });

    const users = response.data;

    if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/landing');
    } else {
        setFieldError('username', 'Invalid username or password');
    }


    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong, please try again.");
    }

    setSubmitting(false);
};

    return <div className="container-login">
        
        <div className="row col-md-4">
            
            <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}>
            
            {({ isSubmitting }) => (
                <Form className='form'>
                    <h2 className="text-center mb-5">Login to Your Account</h2>
                <div className="item-form">
                    <label>Username</label>
                    <Field className="input-feild" name="username" type="text" />
                    <ErrorMessage  name="username" component="div" className="error" />
                </div>

                <div className="item-form">
                    <label>Password</label>
                    <Field className="input-feild" name="password" type="password" />
                    <ErrorMessage name="password" component="div" className="error" />
                </div>

                <div className="item-form">
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                    <p>Don't have an account? <Link className='bttn' to="/register">Sign up here</Link></p>

                </div>
                </Form>
            )}
        </Formik>
        </div>
    </div>
}
