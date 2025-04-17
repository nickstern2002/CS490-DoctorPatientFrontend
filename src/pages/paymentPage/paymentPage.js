import React from "react";
//import { useState } from "react";
import { useNavigate, useLocation  } from 'react-router-dom';
import { paymentStyles } from './paymentStyles';

const PaymentPage = () => {
  //for navigating to the landing page
  const navigate = useNavigate();
  // Imported Transaction Info
  const { state } = useLocation();
  const txnId = state?.transaction_id;
  //

  // Returns you to your last page
  const returnToLastPlace = () => {
    navigate(-1); // Sends you back one page
  };
  //
  return (
    <div className={paymentStyles.background}>
      <div className={paymentStyles.card}>
        <h2 className={paymentStyles.h2}>
          Enter Your Payment Details
        </h2>
        <div className={paymentStyles.svgimg}>
          {/* I could have tried to store the SVG locally but I don't care that much */}
          <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" 
          alt="Visa Logo" 
          className="h-6"
          />
        </div>

        <form className="space-y-4">
          <div>
            <label className={paymentStyles.label}>
              CARDHOLDER NAME
            </label>
            <input
              type="text"
              required
              className={paymentStyles.inputone}
            />
          </div>

          <div>
            <label className={paymentStyles.label}>
              CARD NUMBER
            </label>
            <div className="flex items-center border-b border-gray-400">
              <input
                type="text"
                required
                className={paymentStyles.inputtwo}
              />
              <span className="text-xl text-gray-500">→</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className={paymentStyles.label}>
                EXPIRATION DATE
              </label>
              <input
                type="text"
                required
                className={paymentStyles.inputone}
              />
            </div>
            <div className="flex-1">
              <label className={paymentStyles.label}>
                CVV
              </label>
              <div className="flex items-center border-b border-gray-400">
                <input
                  type="text"
                  required
                  className={paymentStyles.inputtwo}
                />
                <span className="text-gray-400 ml-1">?</span>
              </div>
            </div>
          </div>
          {/* Saving payment details checkmark */}
          {/* I'm just going to remove it for now while I just try to get this done
          <div className="flex items-center space-x-2 mt-4">
            <input type="checkbox" id="save" className="accent-black" />
            <label htmlFor="save" className="text-sm text-gray-700">
              Save my details for future payments
            </label>
          </div>
          */}
          <button
            type="submit"
            className={paymentStyles.buttonsubmit}
          >
            Pay Now
          </button>
        </form>
        <button className={paymentStyles.buttonleave} onClick={returnToLastPlace}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default PaymentPage