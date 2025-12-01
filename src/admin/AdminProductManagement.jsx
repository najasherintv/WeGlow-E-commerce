import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "../utils/axiosInstance";

const AdminProductManagement = () => {
  const initialFormState = {
    title: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    productId: null,
    productTitle: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const formRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("products/");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    try {
      if (editingId) {
        await axios.put(`products/admin/${editingId}/update/`, data); 
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...data } : p))
        );
      } else {
        const res = await axios.post("products/admin/create/", data);
        setProducts((prev) => [...prev, res.data]);
      }

      setForm(initialFormState);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirmDelete = (id, title) => {
    setDeleteModal({ open: true, productId: id, productTitle: title });
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteModal.productId) return;

    try {
      await axios.delete(`products/admin/${deleteModal.productId}/delete/`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.productId));

      setDeleteModal({ open: false, productId: null, productTitle: "" });

      const lastPage = Math.ceil((products.length - 1) / productsPerPage);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, productId: null, productTitle: "" });
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = useMemo(() => {
    return products.slice(startIndex, startIndex + productsPerPage);
  }, [products, startIndex]);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Product Management</h2>

    
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mb-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            type="number"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-2 rounded col-span-1 sm:col-span-2 w-full"
            required
          />
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

     
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Price</th>
                  <th className="py-2 px-4 border">Stock</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((p) => (
                  <tr key={p.id} className="text-sm md:text-base">
                    <td className="py-2 px-2 md:px-4 border">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-contain"
                      />
                    </td>
                    <td className="py-2 px-2 md:px-4 border">{p.name}</td>
                    <td className="py-2 px-2 md:px-4 border">{p.category}</td>
                    <td className="py-2 px-2 md:px-4 border">₹{p.price}</td>
                    <td className="py-2 px-2 md:px-4 border">{p.stock}</td>
                    <td className="py-2 px-2 md:px-4 border flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-400 px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(p.id, p.title)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-sm md:text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-500">
                {deleteModal.productTitle}
              </span>
              ?
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
