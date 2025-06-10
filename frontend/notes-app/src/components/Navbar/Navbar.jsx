import React, { useState ,useEffect } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	const onLogout = () => {
		localStorage.clear();
		navigate("/login");
	};

	// const handleSearch = () => {
	// 	if (searchQuery) {
	// 		onSearchNote(searchQuery);
	// 	}
	// };

	const onClearSearch = () => {
		setSearchQuery("");
		handleClearSearch();
	};

	useEffect(() => {
		if (!searchQuery) {
			handleClearSearch;
		}
		if (searchQuery) {
			onSearchNote(searchQuery);
		}
	}, [searchQuery]);

	return (
		<>
			<div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-md">
				<h2 className=" text-xl font-semibold text-black py-2 drop-shadow-lg">
					Notes{" "}
				</h2>

				<SearchBar
					value={searchQuery}
					onChange={({ target }) => {
						setSearchQuery(target.value);
					}}
					onClearSearch={onClearSearch}
				/>
				<ProfileInfo userInfo={userInfo} onLogout={onLogout} />
			</div>
		</>
	);
};

export default Navbar;
