'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const PiContext = createContext();

export function PiProvider({ children }) {
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // === Init Pi SDK saat pertama load ===
  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        if (window.Pi && typeof window.Pi.init === "function") {
          console.log("✅ Pi SDK ditemukan, inisialisasi...");
          window.Pi.init({
            version: "2.0",
            sandbox: process.env.NEXT_PUBLIC_PI_ENV === "sandbox",
          });
          setIsSdkReady(true);
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, []);

  // === Login User ===
  const authenticate = async () => {
    if (!window.Pi) {
      console.warn("⚠️ Pi SDK tidak ada, fallback ke fake user.");
      const fake = { uid: "local-1", username: "tester", role: "user" };
      setUser(fake);
      setIsAdmin(false);
      return fake;
    }

    const scopes = ["username", "payments"];
    const authResult = await window.Pi.authenticate(scopes, (payment) =>
      console.log("Incomplete payment found", payment)
    );

    const userData = {
      uid: authResult.user.uid,
      username: authResult.user.username,
      role: "user",
    };
    setUser(userData);
    setIsAdmin(false);
    return userData;
  };

  // === Upgrade ke Admin ===
  const upgradeToAdmin = () => {
    if (!window.Pi) {
      console.warn("⚠️ SDK tidak ada, simulasi admin.");
      const adminUser = { uid: "local-1", username: "tester", role: "admin" };
      setUser(adminUser);
      setIsAdmin(true);
      return Promise.resolve({ paymentId: "simulated", txid: "simulated" });
    }

    const paymentData = {
      amount: 0.001,
      memo: "Upgrade ke Admin di Broom Marketplace",
      metadata: { type: "admin-upgrade" },
    };

    return new Promise((resolve, reject) => {
      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) =>
          console.log("Server approval needed:", paymentId),
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Pembayaran sukses", { paymentId, txid });
          const updated = { ...user, role: "admin" };
          setUser(updated);
          setIsAdmin(true);
          setLastPayment({ paymentId, txid });
          resolve({ paymentId, txid });
        },
        onCancel: (paymentId) => reject(new Error("❌ Pembayaran dibatalkan.")),
        onError: (err) => reject(err),
      });
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setLastPayment(null);
  };

  const value = useMemo(
    () => ({
      isSdkReady,
      user,
      isAdmin,
      lastPayment,
      authenticate,
      upgradeToAdmin,
      handleUserLogin: authenticate,
      handleAdminLogin: upgradeToAdmin,
      logout,
    }),
    [isSdkReady, user, isAdmin, lastPayment]
  );

  return <PiContext.Provider value={value}>{children}</PiContext.Provider>;
}

export function useAppContext() {
  return useContext(PiContext);
}
