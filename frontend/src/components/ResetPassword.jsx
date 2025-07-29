import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/reset-password/${token}`,
        { password }
      );
      if (response.data.success) {
        toast.success("Password reset successfully. Please login.");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to reset password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-4 border rounded"
    >
      <h2 className="text-xl mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded mb-4"
      />
      <button type="submit" className="w-full bg-black text-white p-2 rounded">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
