import { useState } from 'react';
import { PayChain_backend } from 'declarations/PayChain_backend';
import React, { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import { idlFactory } from "../../.dfx/local/canisters/paychain_backend/paychain_backend.did.js";

function App() {
  const [authClient, setAuthClient] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
    };
    initAuth();
  }, []);

  const fetchData = async () => {
    if (!authClient) return;

    const agent = new HttpAgent({ identity: authClient.getIdentity() });
    const paychainBackend = Actor.createActor(idlFactory, {
      agent,
      canisterId: "Our CANNISTER ID", 
    });

    const balance = await paychainBackend.getBalance();
    const transactions = await paychainBackend.getTransactions();
    setBalance(balance);
    setTransactions(transactions);
  };

  useEffect(() => {
    if (authClient) fetchData();
  }, [authClient]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Navbar
        authClient={authClient}
        setAuthClient={setAuthClient}
        setIsLoggedIn={setIsLoggedIn}
        setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
      />
      <AnimatePresence>
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setIsLoggedIn={setIsLoggedIn}
            authClient={authClient}
          />
        )}
        {showRegister && (
          <Register
            setShowRegister={setShowRegister}
            authClient={authClient}
          />
        )}
      </AnimatePresence>
      {isLoggedIn && <Dashboard balance={balance} transactions={transactions} />}
    </motion.div>
  );
}

export default App;