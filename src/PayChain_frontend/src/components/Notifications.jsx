import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Notifications = ({ notifications }) => {
                return (
<motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-4 right-4"
>
                {notifications.map((notification, index) => (
<div
                key={index}
                className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg"
>
                <p className="text-white">{notification.message}</p>
                </div>
))}
                </motion.div>
                );
};

export default Notifications;