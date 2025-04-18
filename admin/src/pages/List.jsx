import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.products) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        {
          id,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name,
        description,
        price,
        category,
        subCategory,
        sizes,
        bestseller,
      };

      const response = await axios.put(
        backendUrl + "/api/product/update/" + `${editProduct._id}`,
        updatedProduct,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditProduct(null);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (product) => {
    if (editProduct && editProduct._id === product._id) {
      setEditProduct(null);
    } else {
      setEditProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setBestseller(product.bestseller);
      setSizes(product.sizes);
    }
  };

  const handleSizeToggle = (size) => {
    setSizes((prev) => {
      const found = prev.find((item) => item.size === size);
      if (found) {
        return prev.filter((item) => item.size !== size);
      } else {
        return [...prev, { size, quantity: 0 }];
      }
    });
  };

  const handleQuantityChange = (size, quantity) => {
    setSizes((prev) =>
      prev.map((item) =>
        item.size === size ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List table title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* --------Product List------------- */}
        {list.map((item, index) => (
          <React.Fragment key={item._id}>
            <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
              <img className="w-12" src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <div className="flex space-x-2 ">
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-blue-500 cursor-pointer"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-500 cursor-pointer"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {editProduct && editProduct._id === item._id && (
              <form
                onSubmit={handleUpdateSubmit}
                className="mt-8 p-4 border rounded flex flex-col gap-3"
              >
                <h3 className="text-lg font-medium mb-2">Edit Product</h3>

                <div className="w-full">
                  <p className="mb-2">Product name</p>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full max-w-[500px] px-3 py-2"
                    type="text"
                    placeholder="Type here"
                    required
                  />
                </div>

                <div className="w-full">
                  <p className="mb-2">Product description</p>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full max-w-[500px] px-3 py-2"
                    type="text"
                    placeholder="write content here"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-ful sm:gap-8">
                  <div>
                    <p className="mb-2">Product category</p>
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <p className="mb-2">Sub category</p>
                    <select
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full px-3 py-2"
                    >
                      <option value="Top">Top</option>
                      <option value="Bottom">Bottom</option>
                      <option value="Winterwear">Winterwear</option>
                    </select>
                  </div>
                  <div>
                    <p className="mb-2">Product Price</p>
                    <input
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                      className="w-full px-3 py-2 sm:w-[120px]"
                      type="number"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <p className="mb-2">Sizes & Quantities</p>
                  <div className="flex flex-col gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((size) => {
                      const selected = sizes.find((s) => s.size === size);
                      return (
                        <div key={size} className="flex items-center gap-3">
                          <div
                            onClick={() => handleSizeToggle(size)}
                            className={`cursor-pointer px-3 py-1 ${
                              selected ? "bg-pink-100" : "bg-slate-200"
                            }`}
                          >
                            {size}
                          </div>
                          {selected && (
                            <input
                              type="number"
                              className="px-2 py-1 border rounded w-24"
                              min={0}
                              placeholder="Qty"
                              value={selected.quantity}
                              onChange={(e) =>
                                handleQuantityChange(size, e.target.value)
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <label className="flex gap-2 items-center mt-2">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={() => setBestseller((prev) => !prev)}
                  />
                  Add to bestseller
                </label>

                <button
                  type="submit"
                  className="w-28 py-2 bg-black text-white mt-3"
                >
                  UPDATE
                </button>
              </form>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default List;
