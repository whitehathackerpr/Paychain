import React, { useState } from "react";
import { motion } from "framer-motion";

const Register = ({ setShowRegister, authClient }) => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleRegister = async () => {
const agent = new HttpAgent({ identity: authClient.getIdentity() });
const paychainBackend = Actor.createActor(idlFactory, {
                agent,
                canisterId: "Our CANNISTER ID",
                });

const result = await paychainBackend.register(email, password);
                if (result.ok) {
                alert("Registration successful!");
                setShowRegister(false);
} else {
                alert(result.err);
                }
};

return (
<motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
>
<motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="bg-white p-6 rounded-lg shadow-lg"
>
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
/>
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
/>
                <button
                onClick={handleRegister}
                className="w-full p-2 bg-green-500 text-white rounded"
>
                Register
</button>
                </motion.div>
                </motion.div>
                );
};

export default Register;