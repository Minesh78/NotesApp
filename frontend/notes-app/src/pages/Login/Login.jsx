import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

export const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		if (!validateEmail(email)) {
			setError("Please Enter a Valid Email Address.");
			return;
		}

		if (!password) {
			setError("Please Enter the Password");
			return;
		}
		setError("");

		// Login API call

		try {
			const response = await axiosInstance.post("/login", {
				email: email,
				password: password,
			});

			// handle successful Login response

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
					<form onSubmit={handleLogin}>
						<h4 className="text-2xl mb-7">Login</h4>

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
							Login
						</button>
						<p className="text-sm text-center mt-4">
							If Not Registered yet?{"  "}
							<Link to="/signUp" className="font-medium text-primary underline">
								Create an Account
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
};
