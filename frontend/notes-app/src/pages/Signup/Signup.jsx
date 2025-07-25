import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

export const Signup = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();

		if (!name) {
			setError("Please Enter Your Name");
			return;
		}

		if (!validateEmail(email)) {
			setError("Please Enter a Valid Email Address.");
			return;
		}

		if (!password) {
			setError("Please Enter the Password");
			return;
		}
		setError("");

		// Sign Up API call

		try {
			const response = await axiosInstance.post("/create-account", {
				fullName: name,
				email: email,
				password: password,
			});

			// handle successful registration response

			if (response.data && response.data.error) {
				setError(response.data.message);
				return;
			}

			if (response.data && response.data.accessToken) {
				localStorage.setItem("token", response.data.accessToken);
				navigate("/dashboard");
			}
		} catch (error) {
			//Handle Login Error
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
			} else setError("An unexpected error occured, Please try again");
		}
	};
	return (
		<>
			<Navbar />
			<div className="flex items-center justify-center mt-28">
				<div className="w-96 border rounded-lg bg-white px-7 py-10">
					<form onSubmit={handleSignUp}>
						<h4 className="text-2xl mb-7">SignUp</h4>

						<input
							type="text"
							placeholder="Name"
							className="input-box"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<input
							type="text"
							placeholder="Email"
							className="input-box"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<PasswordInput
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{error && <div className="text-red-500 text-xs pd-1">{error}</div>}

						<button type="submit" className="btn-primary ">
							Create Account
						</button>
						<p className="text-sm text-center mt-4">
							Already Registered?{"  "}
							<Link to="/Login" className="font-medium text-primary underline">
								Login
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
};
