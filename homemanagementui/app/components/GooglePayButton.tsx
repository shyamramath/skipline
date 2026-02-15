"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Google Pay configuration
const MERCHANT_ID = "BCR2DN5TR2WNLATC"; // Your Google Pay merchant ID
const MERCHANT_NAME = "Escuela Technologies";

// Helper to check if running on localhost (only call in browser context)
function isLocalhost(): boolean {
  if (typeof window === "undefined") return true; // Default to TEST for SSR
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

// Environment will be determined at runtime
function getEnvironment(): "TEST" | "PRODUCTION" {
  return isLocalhost() ? "TEST" : "PRODUCTION";
}

interface GooglePayButtonProps {
  amount: number;
  onPaymentSuccess: (paymentData: google.payments.api.PaymentData) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
}

// Declare Google Pay types
declare global {
  namespace google.payments.api {
    interface PaymentData {
      paymentMethodData: {
        tokenizationData: {
          token: string;
          type: string;
        };
        info: {
          cardNetwork: string;
          cardDetails: string;
        };
      };
    }

    class PaymentsClient {
      constructor(options: { environment: string });
      isReadyToPay(request: object): Promise<{ result: boolean }>;
      createButton(options: object): HTMLElement;
      loadPaymentData(request: object): Promise<PaymentData>;
    }
  }
}

const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "MASTERCARD", "VISA"];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

// Get tokenization specification based on environment
function getTokenizationSpecification() {
  // For now, always use Stripe gateway (works in both TEST and PRODUCTION)
  return {
    type: "PAYMENT_GATEWAY",
    parameters: {
      gateway: "stripe",
      "stripe:version": "2020-08-27",
      "stripe:publishableKey": process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    },
  };
}

const baseCardPaymentMethod = {
  type: "CARD",
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks,
  },
};

function getCardPaymentMethod() {
  return {
    ...baseCardPaymentMethod,
    tokenizationSpecification: getTokenizationSpecification(),
  };
}

function getGooglePaymentsClient() {
  if (typeof window !== "undefined" && window.google?.payments?.api) {
    return new window.google.payments.api.PaymentsClient({
      environment: getEnvironment(),
    });
  }
  return null;
}

export default function GooglePayButton({
  amount,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}: GooglePayButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paymentsClientRef = useRef<google.payments.api.PaymentsClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleGooglePayClick = useCallback(async () => {
    const paymentsClient = paymentsClientRef.current;
    if (!paymentsClient) return;

    const paymentDataRequest = {
      ...baseRequest,
      allowedPaymentMethods: [getCardPaymentMethod()],
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: amount.toFixed(2),
        currencyCode: "USD",
        countryCode: "US",
      },
      merchantInfo: {
        merchantId: MERCHANT_ID,
        merchantName: MERCHANT_NAME,
      },
    };

    try {
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      onPaymentSuccess(paymentData);
    } catch (err) {
      if ((err as { statusCode?: string }).statusCode === "CANCELED") {
        // User closed the payment sheet
        console.log("Payment cancelled by user");
      } else {
        onPaymentError(err as Error);
      }
    }
  }, [amount, onPaymentSuccess, onPaymentError]);

  const createGooglePayButton = useCallback(() => {
    const paymentsClient = paymentsClientRef.current;
    if (!buttonContainerRef.current || !paymentsClient) return;

    // Clear any existing button
    buttonContainerRef.current.innerHTML = "";

    const button = paymentsClient.createButton({
      onClick: handleGooglePayClick,
      buttonColor: "black",
      buttonType: "pay",
      buttonRadius: 8,
      buttonSizeMode: "fill",
    });

    buttonContainerRef.current.appendChild(button);
  }, [handleGooglePayClick]);

  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.payments?.api) {
      initGooglePay();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src="https://pay.google.com/gp/p/js/pay.js"]'
    );

    if (existingScript) {
      // Script exists, wait for it to load
      existingScript.addEventListener("load", initGooglePay);
      return;
    }

    // Load Google Pay script
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;
    script.onload = () => {
      initGooglePay();
    };
    document.body.appendChild(script);

    async function initGooglePay() {
      const paymentsClient = getGooglePaymentsClient();
      if (!paymentsClient) {
        setIsLoading(false);
        return;
      }

      // Store the client for later use
      paymentsClientRef.current = paymentsClient;

      try {
        const isReadyToPayRequest = {
          ...baseRequest,
          allowedPaymentMethods: [baseCardPaymentMethod],
        };

        const response = await paymentsClient.isReadyToPay(isReadyToPayRequest);

        if (response.result) {
          setIsReady(true);
        }
      } catch (err) {
        console.error("Error initializing Google Pay:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Separate effect to create button when ready and when container is available
  useEffect(() => {
    if (isReady && buttonContainerRef.current) {
      createGooglePayButton();
    }
  }, [isReady, createGooglePayButton]);

  if (isLoading) {
    return (
      <div className="flex h-12 w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-600" />
      </div>
    );
  }

  if (!isReady) {
    // Show a message when Google Pay isn't available
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Google Pay not available in this browser</span>
      </div>
    );
  }

  return (
    <div
      ref={buttonContainerRef}
      className={`w-full ${disabled ? "pointer-events-none opacity-50" : ""}`}
      style={{ minHeight: "48px" }}
    />
  );
}
