import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products/");
        
        console.log(res.data);

        
        const uniqueProducts = Array.from(
          new Map(
            res.data
              .filter((item) => typeof item.name === "string" && item.name.trim() !== "")
              .map((item) => [item.name.toLowerCase(), item])
          ).values()
        );

        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      categoryFilter === "all"
        ? true
        : product.category && product.category.toLowerCase() === categoryFilter.toLowerCase()
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return parseFloat(a.price) - parseFloat(b.price);
      if (sortOrder === "highToLow") return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });

  return (
    <div className="p-8 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Shop All Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
       
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border-2 border-pink-500 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        
        <select
          className="p-2 border-2 border-pink-500 rounded-md"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Scrub">Scrub</option>
          <option value="Toner">Toner</option>
          <option value="Aloe vera gel">Aloe vera gel</option>
          <option value="Cleanser">Cleanser</option>
          <option value="Serum">Serum</option>
          <option value="Face Wash">Face Wash</option>
          <option value="Night Cream">Night Cream</option>
          <option value="Moisturizer">Moisturizer</option>
          <option value="Mist">Mist</option>
          <option value="Face Mask">Face Mask</option>
          <option value="Sunscreen">Sunscreen</option>
        </select>

        <select
          className="p-2  border-pink-500 rounded-md border-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={`${product.id}-${product.name}`} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-pink-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
