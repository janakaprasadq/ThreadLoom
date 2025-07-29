import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email }
      );
      if (response.data.success) {
        toast.success("Password reset link sent to your email.");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to send reset link." + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-4 border rounded"
    >
      <h2 className="text-xl mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded mb-4"
      />
      <button type="submit" className="w-full bg-black text-white p-2 rounded">
        Send Reset Link
      </button>
    </form>
  );
};

export default ForgotPassword;
