import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { signUpUser, signInUser } from '../redux/userSlice';
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AuthForm({ authType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (authType === 'SignUp' && password !== confirmPassword) {
      toast.error("Passwords do not match")
      return;
    }
  
    if (authType === 'SignUp')
    {
      dispatch(signUpUser({email, password, firstName, lastName, confirmPassword}))
    } 
    if (authType === 'SignIn') {
      dispatch(signInUser({email, password}))
    }
  }

  return (
    <section className="flex flex-col justify-center sm:items-center lg:items-stretch lg:w-[80%] lg:pl-64 gap-5">
      <div className="flex justify-center items-center font-semibold text-2xl pt-2">
        {authType === 'SignUp' ? 'Register' : 'Login'}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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

        {authType === "SignUp" && (
          <>
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="first-name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm placeholder:p-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 placeholder:p-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
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

        {authType === "SignUp" && (
          <div className="sm:col-span-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm Password
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
        )}
        <div className="flex flex-col justify-center items-center">
          <button
            type="submit"
            className="text-white bg-black hover:bg-black focus:ring-4 focus:ring-black-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-black-600 dark:hover:bg-black-700 focus:outline-none dark:focus:ring-black-800"
          >
            Submit
          </button>
          <footer className="flex justify-center gap-1 pt-2">
            <p className="text-14 font-normal text-gray-600">
              {authType === "SignIn"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              className="form-link"
              to={authType === "SignIn" ? "/register" : "/login"}
            >
              {authType === "SignIn" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </div>
      </form>
    </section>
  );
}
