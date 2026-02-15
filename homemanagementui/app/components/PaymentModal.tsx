"use client";

import { useState } from "react";
import GooglePayButton from "./GooglePayButton";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  planPeriod: string;
  planType: "inspection" | "maintenance";
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  planPeriod,
  planType,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleGooglePaySuccess(paymentData: google.payments.api.PaymentData) {
    setIsProcessing(true);
    setPaymentStatus("idle");
    setErrorMessage("");

    try {
      // Send payment token to your backend
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentToken: paymentData.paymentMethodData.tokenizationData.token,
          amount: planPrice,
          planName,
          planType,
          planPeriod,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus("success");
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (err) {
      setPaymentStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleGooglePayError(error: Error) {
    setPaymentStatus("error");
    setErrorMessage(error.message || "Payment failed. Please try again.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Complete Your Purchase
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Secure payment powered by Google Pay
          </p>
        </div>

        {/* Order Summary */}
        <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{planName}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {planType === "inspection" ? "One-time inspection" : `${planPeriod}ly subscription`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                ${planPrice}
              </p>
              {planType === "maintenance" && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">/{planPeriod}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus === "success" && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-semibold text-green-700 dark:text-green-400">
              Payment Successful!
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-500">
              Redirecting to confirmation...
            </p>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="font-semibold text-red-700 dark:text-red-400">Payment Failed</p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errorMessage}</p>
          </div>
        )}

        {/* Payment Options */}
        {paymentStatus === "idle" && (
          <div className="space-y-4">
            {/* Primary: Credit/Debit Card via Stripe */}
            <button
              onClick={() => {
                // Trigger Stripe checkout
                window.location.href = `/api/create-checkout-session?plan=${encodeURIComponent(planName)}&amount=${planPrice}&type=${planType}&period=${planPeriod}`;
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
              </svg>
              Pay with Card
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  or
                </span>
              </div>
            </div>

            {/* Google Pay Button */}
            <GooglePayButton
              amount={planPrice}
              onPaymentSuccess={handleGooglePaySuccess}
              onPaymentError={handleGooglePayError}
              disabled={isProcessing}
            />
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Secure, encrypted payment</span>
        </div>
      </div>
    </div>
  );
}
