import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { toast } from 'react-toastify';
import { resetPassword } from '../redux/userSlice';

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (confirmPassword !== password) {
            toast.error("Passwords do not match!");
            return;
        }

        dispatch(resetPassword({email, newPassword:password}));
    }
    
  return (
    <div className='flex flex-col items-center justify-center pt-[5%]'>
        <h1 className='py-4 font-serif text-2xl'>Reset Password</h1>
        <form className='space-y-6 py-4' onSubmit={handleSubmit}>
        <div className="sm:col-span-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email Address
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
              className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset placeholder:p-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            New Password
          </label>
          <div className="mt-2 flex justify-between shadow-sm rounded-md text-gray-900 ring-1 ring-inset ring-gray-300 p-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full border-0 p-2 py-1.5 text-gray-900 sm:text-sm sm:leading-6 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="">{showPassword ? <BiShow /> : <BiHide />}</span>
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm New Password
            </label>
            <div className="mt-2 flex justify-between shadow-sm rounded-md text-gray-900 ring-1 ring-inset ring-gray-300 p-2">
              <input
                type={showPassword2 ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full border-0 p-2 py-1.5 text-gray-900  sm:text-sm sm:leading-6 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                <span className="">
                  {showPassword2 ? <BiShow /> : <BiHide />}
                </span>
              </button>
            </div>
          </div>

        <div className='flex justify-center items-center text-center'>
          <button
            type="submit"
            disabled={!email || !password || !confirmPassword}
            className="text-white bg-black hover:bg-black focus:ring-4 focus:ring-black-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-black-600 dark:hover:bg-black-700 focus:outline-none dark:focus:ring-black-800 disabled:bg-gray-400"
          >
            Reset Password
          </button>
          </div>
        </form>
    </div>
  )
}

export default ResetPassword