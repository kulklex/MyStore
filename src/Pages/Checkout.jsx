import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart as clear } from "../redux/cartSlice.js";
import { baseUrl } from "../main";
import { toast } from "react-toastify";
import { createOrder } from "../redux/orderSlice";
import { usePaystackPayment } from "react-paystack";
import { logout } from "../redux/userSlice.js";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const user = JSON.parse(localStorage.getItem('userToken')).user

  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone, setPhone] = useState("");
  const [postCode, setPostCode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  let orderData = {
    user: user._id,
    items: cart?.items.map((item) => ({
      product: item._id,
      quantity: item.cartQty,
    })),
    totalAmount: Number(cart.totalAmount),
    status: "Completed",
    delivery: {
        address, 
        address2,
        phone,
        postCode,
        city,
        state,
    }
  };
  const handlePaymentSuccess = async (reference) => {
    orderData = { ...orderData, paymentReference: reference };
    dispatch(createOrder(orderData));
  };

  const handlePaystackSuccessAction = (reference) => {
    handlePaymentSuccess(reference.reference);
  };

  const handlePaystackCloseAction = () => {
    toast.error("Transaction was not completed, window closed.");
  };

  const config = {
    email: email,
    amount: Number(cart.totalAmount) * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    initializePayment(handlePaystackSuccessAction, handlePaystackCloseAction);
  };

  let clearCart = () => {
    toast.success(`Thanks for shopping with us`, {
      autoClose: 5000,
      position: "bottom-left",
      theme: "colored",
      closeOnClick: true,
      pauseOnHover: true,
    });
    dispatch(clear());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createOrder(orderData))
      .then(() => {
        clearCart();
        navigate("/");
      })
      .catch((error) => {
        console.error(error)
        toast.error("Error creating order: " + error.message);
      });
  };

  return (
    <div className="p-2">
      <h1 className="text-center m-3 text-lg md:text-xl font-bold font-sans">
        Checkout
      </h1>
      <hr />

      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 pb-4">
            <tr>
              <th scope="col" className="py-8 md:py-3 px-6">
                Image
              </th>
              <th scope="col" className="py-8 md:py-3 px-6">
                Product
              </th>
              <th scope="col" className="py-8 md:py-3 px-6">
                Qty
              </th>
              <th scope="col" className="py-8 md:py-3 px-6">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.items?.map((item) => (
              <tr key={item._id} className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-700 whitespace-nowrap dark:text-white"
                >
                  <img
                    src={baseUrl + "/uploads/" + item.image}
                    height={80}
                    width={50}
                  />
                </th>
                <td className="py-4 px-6">{item.title}</td>
                <td className="py-4 px-6">{item.cartQty}</td>
                <td className="py-4 px-6">£{item.price?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-gray-900 dark:text-white">
              <th scope="row" className="py-3 px-6 text-base"></th>
              <th
                scope="row"
                className="hidden md:block py-3 px-6 text-base"
              ></th>
              <td className="py-3 px-6"></td>
              <td className="py-3 px-6"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border rounded-lg shadow dark:bg-gray-900 dark:text-gray-400 mt-6"
      >
        <div className="space-y-6 w-full flex flex-col md:justify-center md:items-center p-4 text-gray-700">
          <div className="flex items-center justify-center">
            <h2 className="text-semibold text-gray-500 text-lg font-serif">
              Fill form to complete order
            </h2>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center md:space-x-4 space-y-6  md:space-y-0">
            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full md:w-[250px] lg:w-[500px] rounded-md border-0 p-2 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  autoComplete="phone"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="block w-full md:w-[250px] lg:w-[500px] rounded-md border-0 p-2 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center md:space-x-4 space-y-6  md:space-y-0">
            <div className="sm:col-span-3">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="address"
                  placeholder="Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="block w-full md:w-[250px] lg:w-[500px] rounded-md border-0 p-2 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="address2"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                Address 2
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address2"
                  id="address2"
                  autoComplete="address2"
                  placeholder=""
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="block w-full md:w-[250px] lg:w-[500px] rounded-md border-0 p-2 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center md:space-x-4 space-y-6 md:space-y-0">
            <div className="sm:col-span-3">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="city"
                  name="city"
                  id="city"
                  autoComplete="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="block w-full md:w-[166px] lg:w-[333px] rounded-md border-0 p-2 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                State or Region
              </label>
              <div className="mt-2">
                <input
                  type="state"
                  name="state"
                  id="state"
                  autoComplete="state"
                  placeholder="eg. Greater London"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="block w-full md:w-[166px] lg:w-[333px] rounded-md border-0 p-2 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="postCode"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                Post Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postCode"
                  id="postCode"
                  autoComplete="postCode"
                  placeholder="Postal Code"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  required
                  className="block w-full md:w-[166px] lg:w-[333px] rounded-md border-0 p-2 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col md:flex-row justify-center items-center space-y-1">
          <button
            className="text-white w-[50%] md:w-[15%] bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-black-300 font-medium rounded-lg text-sm py-2.5 mr-2 dark:bg-black-600 dark:hover:bg-black-700 focus:outline-none mx-9 dark:focus:ring-black-800 disabled:bg-gray-400"
            {...config}
            onClick={handlePayment}
            disabled={
              !email || !address || !phone || !postCode || !state || !city
            }
          >
            Pay with paystack
          </button>

          <button
            type="submit"
            disabled={
              !email || !address || !phone || !postCode || !state || !city
            }
            className="text-white w-[50%] md:w-[15%] bg-black hover:bg-black-800 focus:ring-4 focus:ring-black-300 font-medium rounded-lg text-sm py-2.5 mr-2 dark:bg-black-600 dark:hover:bg-black-700 focus:outline-none mx-9 dark:focus:ring-black-800 disabled:bg-gray-400"
          >
            Pay
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;

