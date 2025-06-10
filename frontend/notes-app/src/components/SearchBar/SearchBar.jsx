import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, onClearSearch }) => {
	return (
		<>
			<div className="w-80 flex items-center bg-slate-200 rounded-full px-7 shadow-md">
				<input
					type="text"
					placeholder="Search"
					className="w-full text-sx bg-transparent py-[11px] outline-none"
					value={value}
					onChange={onChange}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSearch();
						}
					}}
				/>

				{value && (
					<IoMdClose
						onClick={onClearSearch}
						className="text-slate-400 mr-2 cursor-pointer hover:text-black"
					/>
				)}

				<FaMagnifyingGlass
					// onClick={handleSearch}
					className="text-slate-400 cursor-pointer hover:text-black"
				/>
			</div>
		</>
	);
};

export default SearchBar;
