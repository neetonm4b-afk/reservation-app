"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export function CheckoutForm({ bookingId, amount, onSuccess }: { bookingId: string, amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "決済に失敗しました。");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        // バックエンドに決済確定を通知
        const confirmRes = await fetch(`/api/bookings/${bookingId}/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        if (!confirmRes.ok) throw new Error("確定処理に失敗しました");
        
        onSuccess();
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "エラーが発生しました");
        setIsProcessing(false);
      }
    } else {
      setMessage("決済ステータスが不明です。");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div style={{ marginBottom: 20 }}>
        <PaymentElement id="payment-element" />
      </div>
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit"
        className="btn btn-primary btn-full"
      >
        <span id="button-text">
          {isProcessing ? "決済処理中..." : `¥${amount.toLocaleString()} を決済する`}
        </span>
      </button>
      {message && <div id="payment-message" className="alert alert-error" style={{ marginTop: 16 }}>{message}</div>}
    </form>
  );
}
