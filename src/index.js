import React from 'react';
import ReactDOM from 'react-dom/client';
//import { BrowserRouter } from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage/landingPage';
import LoginPage from './pages/Login/login'
import RegistrationPage from './pages/Registration/registration'
import PatientPage from './pages/patientDashboard/patientDashboard'
import DoctorPage from './pages/doctorDashboard/doctorDashboard'
import PaymentPage from './pages/paymentPage/paymentPage'
import DiscussionBoard from './pages/discussionPosts/discussion'
import PostAppointmentPage from './pages/doctorDashboard/PostAppointment';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PostAppointmentReview from "./pages/patientDashboard/PostAppointment";

const router = createBrowserRouter([
  {
    path: "",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <RegistrationPage />,
  },
  {
    path: "/patient",
    element: <PatientPage />,
  },
  {
    path: "/doctors",
    element: <DoctorPage />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/post-appointment",
    element: <PostAppointmentPage />,
  },
  {
    path: "/patient-post-appointment",
    element: <PostAppointmentReview/>
  },
  {
    path: "/discuss",
    element: <DiscussionBoard/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// <RouterProvider router={router} />

/*
<BrowserRouter>
      <LandingPage />
    </BrowserRouter>
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
