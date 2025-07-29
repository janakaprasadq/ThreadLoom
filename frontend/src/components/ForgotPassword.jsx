import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false); // hide spinner
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700">Sending reset link...</p>
      </div>
    );
  }

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
