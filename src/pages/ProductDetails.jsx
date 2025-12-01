import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { addToCart, isLoggedIn } from "../utils/cartUtils";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    addToCart(product, 1);
    navigate("/cart");
  };

  if (!product) return <div className="p-8 text-center">Loading product...</div>;

  return (
    <div className="pt-24 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg md:flex gap-8">
        <div className="md:w-1/2 flex justify-center items-start">
          <img src={product.image} alt={product.name} className="w-full max-w-md h-auto object-contain rounded-lg" />
        </div>

        <div className="md:w-1/2 flex flex-col justify-between mt-6 md:mt-0">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-3">{product.description}</p>
            <p className="text-pink-600 text-2xl font-semibold mt-4">₹{parseFloat(product.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={handleAddToCart}
              className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"
            >
              Add to Cart
            </button>
          </div>

          <div className="mt-4">
            <Link to="/shop" className="text-blue-500 hover:underline">← Back to Shop</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
