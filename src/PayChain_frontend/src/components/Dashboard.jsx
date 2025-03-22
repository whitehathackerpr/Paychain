import React, { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { motion } from "framer-motion";
import { idlFactory } from "../../.dfx/local/canisters/paychain_backend/paychain_backend.did.js";

const Dashboard = ({ authClient, userEmail }) => {
const [balance, setBalance] = useState(0);
const [transactions, setTransactions] = useState([]);
const [recipient, setRecipient] = useState("");
const [amount, setAmount] = useState(0);

                useEffect(() => {
                const fetchData = async () => {
if (!authClient) return;

const agent = new HttpAgent({ identity: authClient.getIdentity() });
const paychainBackend = Actor.createActor(idlFactory, {
                agent,
                canisterId: "Our CANISTER_ID", 
                });

const balance = await paychainBackend.getBalance();
const transactions = await paychainBackend.getMyTransactions();
setBalance(balance);
setTransactions(transactions);
                };

fetchData();
                }, [authClient]);

const sendFunds = async () => {
if (!authClient) return;

const agent = new HttpAgent({ identity: authClient.getIdentity() });
const paychainBackend = Actor.createActor(idlFactory, {
                agent,
                canisterId: "Our CANISTER_ID", 
                });

try {
                const result = await paychainBackend.send(recipient, amount);
                alert(result);

                const balance = await paychainBackend.getBalance();
                const transactions = await paychainBackend.getMyTransactions();
                setBalance(balance);
                setTransactions(transactions);
} catch (error) {
                alert(error);
}
};

                return (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="p-6"
                >
                <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Balance Card */}
<motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
>
                <h3 className="text-2xl font-bold mb-4">Your Balance</h3>
                <p className="text-4xl font-semibold">{balance} ICP</p>
                </motion.div>

        {/* Send Funds Form */}
                <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
<h3 className="text-2xl font-bold mb-4">Send Funds</h3>
<input
                type="text"
                placeholder="Recipient Principal"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 rounded"
/>
                <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 rounded"
/>
                <button
                onClick={sendFunds}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
>     
Send
                </button>
                </motion.div>
                </div>

      {/* Transaction History */}
                <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8"
                >
<h3 className="text-2xl font-bold mb-4">Transaction History</h3>
<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                {transactions.length === 0 ? (
                <p className="text-gray-400">No transactions yet.</p>
) : (
                <ul>
                {transactions.map((tx, index) => (
                <li key={index} className="mb-2">
                <span className="text-gray-400">From: {tx.from.toString()}</span> →{" "}
                <span className="text-gray-400">To: {tx.to.toString()}</span> -{" "}
                <span className="text-green-400">{tx.amount} ICP</span>
                </li>
))}
                </ul>
)}
                </div>
</motion.div>
</motion.div>
);
};

export default Dashboard;