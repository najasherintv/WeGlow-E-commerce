import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("cart");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  useEffect(() => {
    axios
      .get("accounts/admin/users/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleExpand = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  const deleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`accounts/admin/users/${userToDelete.id}/delete/`);

      setUsers(users.filter((u) => u.id !== userToDelete.id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const openModal = (data, type) => {
    setModalData(data);
    setModalType(type);
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Manage Users</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 md:p-6 rounded shadow bg-gray-50"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  {user.name} ({user.email})
                </h2>
              </div>
              <div className="flex space-x-2 md:space-x-3 mt-2 md:mt-0">
                <button
                  onClick={() => toggleExpand(user.id)}
                  className="text-blue-600 hover:underline text-sm md:text-base"
                >
                  {expandedUserId === user.id ? "Collapse" : "Expand"}
                </button>
                <button
                  onClick={() => deleteUser(user)}
                  className="text-red-500 hover:underline text-sm md:text-base"
                >
                  Delete
                </button>
              </div>
            </div>

            {expandedUserId === user.id && (
              <div className="mt-4 space-y-4 text-sm md:text-base">
                <div>
                  <strong>Cart:</strong>{" "}
                  <button
                    onClick={() => openModal(user.cart || [], "cart")}
                    className="text-blue-600 underline ml-1"
                  >
                    View Cart
                  </button>
                </div>
                <div>
                  <strong>Orders:</strong>{" "}
                  <button
                    onClick={() => openModal(user.orders || [], "orders")}
                    className="text-blue-600 underline ml-1"
                  >
                    View Orders
                  </button>
                </div>
                <div>
                  <strong>Watchlist:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {user.watchlist?.length > 0 ? (
                      user.watchlist.map((item, i) => (
                        <li key={i}>{item.title}</li>
                      ))
                    ) : (
                      <li>No items in watchlist.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

     
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg relative">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              {modalType === "cart" ? "Cart Items" : "Order Details"}
            </h2>

            {modalData.length > 0 ? (
              <ul className="space-y-2">
                {modalData.map((item, index) => (
                  <li
                    key={index}
                    className="border p-2 rounded bg-gray-100"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} — ₹{item.price}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No items to show.</p>
            )}

            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-600 text-lg hover:text-black"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-sm text-center shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">{userToDelete?.name}</span>?
            </p>
            <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
              <button
                onClick={confirmDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
