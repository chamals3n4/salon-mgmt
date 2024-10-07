import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber) {
      navigate(`/customer/profile/${phoneNumber}`);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Enter Your Phone Number</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
        >
          Access Profile
        </button>
      </form>
    </div>
  );
}
