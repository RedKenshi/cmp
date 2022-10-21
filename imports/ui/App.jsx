import React, { Fragment } from 'react';
import AppBody from './AppBody';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => (
  <Fragment>
    <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} pauseOnFocusLoss={false} newestOnTop rtl/>
    <AppBody/>
  </Fragment>
);
