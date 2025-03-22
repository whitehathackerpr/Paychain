import React from "react";
import { AuthClient } from "@dfinity/auth-client";
import { motion } from "framer-motion";

const Navbar = ({ authClient, setAuthClient, setIsLoggedIn, setShowLogin, setShowRegister, userEmail }) => {
const login = async () => {
                await authClient.login({
                identityProvider: "https://identity.ic0.app",
                onSuccess: () => {
                console.log("Logged in!");
                setIsLoggedIn(true);
},
});
};

const logout = async () => {
await authClient.logout();
console.log("Logged out!");
setIsLoggedIn(false);
                };

                return (
                <motion.nav
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 p-4"
>
<div className="container mx-auto flex justify-between items-center">
<div className="flex items-center">
<img src="/logo2.svg" alt="PayChain Logo" className="w-10 h-10 mr-2" />
<h1 className="text-white text-2xl font-bold">PayChain</h1>
</div>
<div className="flex items-center">
                {userEmail ? (
                <>
                <span className="text-white mr-4">Welcome, {userEmail}</span>
                <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
>
                Logout
                </button>
                </>
) : (
                <>
<button
                onClick={() => setShowLogin(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-blue-600 transition-all"
                >
                Login
                </button>
                <button
                onClick={() => setShowRegister(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
>
                Register
                </button>
                </>
                )}
                </div>
                </div>
                </motion.nav>
                );
};

export default Navbar;