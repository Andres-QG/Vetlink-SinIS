import React, { createContext } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <StripeContext.Provider value={{ stripe, elements }}>
      {children}
    </StripeContext.Provider>
  );
};

export default StripeContext;
