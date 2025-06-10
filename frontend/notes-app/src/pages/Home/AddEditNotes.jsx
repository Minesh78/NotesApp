import React, { useState } from "react";
import axioInstance from "../../utils/axiosInstance";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({
	type,
	noteData,
	getAllNotes,
	onClose,
	showToastMessage,
}) => {
	const [title, setTitle] = useState(noteData?.title || "");
	const [content, setContent] = useState(noteData?.content || "");
	const [tags, setTags] = useState(noteData?.tags || []);
	const [error, setError] = useState(null);

	//Add New Note
	const addNewNote = async () => {
		try {
			const response = await axioInstance.post("/add-note", {
				title,
				content,
				tags,
			});
			if (response.data && response.data.note) {
				showToastMessage("Note Added Successfully");
				getAllNotes();
				onClose();
			}
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
			}
		}
	};

	//Edit Note
	const editNote = async () => {
		const noteId = noteData._id;

		try {
			const response = await axioInstance.put("/edit-note/" + noteId, {
				title,
				content,
				tags,
			});
			if (response.data && response.data.note) {
				showToastMessage("Note Updated Successfully");
				getAllNotes();
				onClose();
			}
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
			}
		}
	};

	const handleAddNote = () => {
		//Error if both title and description is missing
		if (!title && !content) {
			setError("Please enter the Title and Description");
			return;
		}
		//Error if both title is missing
		if (!title) {
			setError("Please enter the Title");
			return;
		}
		//Error if description is missing
		if (!content) {
			setError("Please enter the Description");
			return;
		}
		setError(null);

		if (type === "edit") {
			editNote();
		} else {
			addNewNote();
		}
	};

	return (
		<>
			<div className="relative ">
				<div>
					<button
						className=" w-8 h-8 rounded-full flex items-center justify-center absolute -top-4 -right-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50"
						onClick={onClose}>
						<MdClose className="text-xl" />
					</button>
				</div>
				<div className="flex flex-col gap-2">
					<label className="input-label"> Title</label>
					<input
						type="text"
						className="text-2xl text-slate-950 outline-none"
						placeholder="Go to Gym At 5"
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div className="flex flex-col gap-2 mt-4">
					<label className="input-label">Description</label>
					<textarea
						typeof="text"
						className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded "
						placeholder="Add Description"
						rows={10}
						value={content}
						onChange={({ target }) => setContent(target.value)}
					/>
				</div>

				<div className="mt-3">
					<label className="input-label ">Tags</label>
					<TagInput tags={tags} setTags={setTags} />
				</div>
				{error && <p className="text-red-500 text-xs">{error}</p>}

				<button
					className="btn-primary font-medium mt-p p-3"
					onClick={handleAddNote}>
					{type === "edit" ? "UPDATE NOTE" : "ADD NOTE"}
				</button>
			</div>
		</>
	);
};

export default AddEditNotes;
