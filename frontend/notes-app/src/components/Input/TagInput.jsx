import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const addNewTag = () => {
		if (inputValue.trim() !== "") {
			// Removes any whitespace from the beginning and end of the input and checks if the string is not empty
			setTags([...tags, inputValue.trim()]); //using spread operator to create a new array with existing tags
			setInputValue(""); // Clears the input value
		}
	};

	const handleKeyDown = (e) => {
		if (e.key == "Enter") {
			addNewTag(); // when user presses enter it create a tag and clear the input value
		}
	};

	const handleRemovetag = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};
	return (
		<>
			<div>
				{tags.length > 0 && (
					<div className="flex items-center gap-2 flex-wrap mt-2 ">
						{tags.map((tag, index) => (
							<span key={index} className="flex items-center text-sm gap-1 bg-slate-50 rounded-md px-2">
								#{tag}
								<button
									onClick={() => {
										handleRemovetag(tag);
									}}>
									<MdClose />
								</button>
							</span>
						))}
					</div>
				)}
				<div className="flex items-center gap-4 my-3">
					<input
						type="text"
						className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
						placeholder="Add tags"
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						value={inputValue}
					/>

					<button
						className="w-8 h-8 flex items-center justify-center border border-blue-700 hover:bg-blue-700 rounded"
						onClick={() => {
							addNewTag();
						}}>
						<MdAdd className="text-2xl text-blue-700 hover:text-white" />
					</button>
				</div>
			</div>
		</>
	);
};

export default TagInput;
