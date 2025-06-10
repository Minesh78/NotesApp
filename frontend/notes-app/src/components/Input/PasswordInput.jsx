import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
	const [isShowPassword, setIsshowPassword] = useState(false);

	const toggleShowPassword = () => {
		setIsshowPassword(!isShowPassword);
	};

	return (
		<>
			<div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
				<input
					value={value}
					onChange={onChange}
					type={isShowPassword ? "text" : "password"}
					placeholder={placeholder || "Password"}
					className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
				/>
				<div>
					{isShowPassword ? (
						<FaRegEye
							size={20}
							className="text-primary cursor-pointer"
							onClick={() => toggleShowPassword()}
						/>
					) : (
						<FaRegEyeSlash
							size={20}
							className="text-slate-400 cursor-pointer"
							onClick={() => toggleShowPassword()}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default PasswordInput;
