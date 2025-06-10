import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import { all } from "axios";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addNoteImg from "../../assets/Images/add-note.svg";
import NoteNotFoundImg from "../../assets/Images/no-note-found.svg";

// Modal.setAppElement("#root");

export const Home = () => {
	const [openAddEditNoteModal, setOpenAddEditNoteModal] = useState({
		isShown: false,
		type: "add",
		data: null,
	});

	const [showToastMsg, setShowToastMsg] = useState({
		isShown: false,
		message: "",
		type: "add",
	});

	const [userInfo, setUserInfo] = useState(null);

	const [allNotes, setAllNotes] = useState([]);

	const [isSearch, setIsSearch] = useState(false);

	const navigate = useNavigate();

	const handleEdit = (noteDetails) => {
		setOpenAddEditNoteModal({ isShown: true, type: "edit", data: noteDetails });
	};

	const showToastMessage = (message, type) => {
		setShowToastMsg({
			isShown: true,
			message: message,
			type: type,
		});
	};

	const handleCloseToast = () => {
		setShowToastMsg({
			isShown: false,
			message: "",
		});
	};

	//Get User Info
	const getUserInfo = async () => {
		try {
			const response = await axiosInstance.get("/get-user");

			if (response.data && response.data.user) {
				setUserInfo(response.data.user);
			}
		} catch (error) {
			if (error.response.status === 401) {
				localStorage.clear();
				navigate("/login");
			}
		}
	};

	//Get All Notes
	const getAllNotes = async () => {
		try {
			const response = await axiosInstance.get("/get-all-notes");

			if (response.data && response.data.notes) {
				setAllNotes(response.data.notes);
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
		}
	};

	//Delete Note
	const deleteNote = async (data) => {
		const noteId = data._id;

		try {
			const response = await axiosInstance.delete("/delete-note/" + noteId);

			if (response.data && !response.data.error) {
				showToastMessage("Note Deleted Successfully", "delete");
				getAllNotes();
			}
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				console.log("An Unexpected error occured.Please Try Again");
			}
		}
	};

	//Update Pinned Note
	const updateIsPinned = async (noteData) => {
		const noteId = noteData._id;

		try {
			const response = await axiosInstance.put(
				"/update-note-pinned/" + noteId,
				{
					isPinned: !noteData.isPinned,
				}
			);
			if (response.data && response.data.note) {
				showToastMessage("Note Updated Successfully");
				getAllNotes();
			}
		} catch (error) {
			console.log(error);
		}
	};

	//Search for a Note
	const onSearchNote = async (query) => {
		try {
			const response = await axiosInstance.get("/search-notes", {
				params: { query },
			});

			if (query.trim().length == "") {
				getAllNotes();
				return;
			}

			if (response.data && response.data.notes) {
				setIsSearch(true);
				setAllNotes(response.data.notes);
			}
		} catch (error) {
			console.log(error);
		}
	};

	//Clear Search
	const handleClearSearch = () => {
		setIsSearch(false);
		getAllNotes();
	};
	useEffect(() => {
		getAllNotes();
		getUserInfo();
		return () => {};
	}, []);

	return (
		<>
			<Navbar
				userInfo={userInfo}
				onSearchNote={onSearchNote}
				handleClearSearch={handleClearSearch}
			/>

			<div className="w-[90%] mx-auto mt-20">
				{allNotes.length > 0 ? (
					<div className="grid grid-cols-3 gap-4 mt-8">
						{allNotes.map((item, index) => (
							<NoteCard
								key={item._id}
								title={item.title}
								date={item.createdOn}
								content={item.content}
								tags={item.tags}
								isPinned={item.isPinned}
								onEdit={() => handleEdit(item)}
								onDelete={() => deleteNote(item)}
								onPinNote={() => updateIsPinned(item)}
							/>
						))}
					</div>
				) : (
					<EmptyCard
						imgSrc={isSearch ? NoteNotFoundImg : addNoteImg}
						message={
							isSearch
								? `No Notes found matching your search`
								: `Start creating your first Note! Click the "+" icon to jot down your thoughts, ideas and reminders. Let's get started`
						}
					/>
				)}
			</div>
			<button
				className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
				onClick={() =>
					setOpenAddEditNoteModal({
						isShown: true,
						type: "add",
						data: null,
					})
				}>
				<MdAdd className="text-[32px] text-white" />
			</button>

			<Modal
				isOpen={openAddEditNoteModal.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: "rgba(0,0,0,0.2)",
					},
				}}
				contentLabel=""
				className="w-[40%] max-h-3/4 bg-white border shadow-xl rounded-md mx-auto mt-14 p-5 overflow-scoll">
				<AddEditNotes
					type={openAddEditNoteModal.type}
					noteData={openAddEditNoteModal.data}
					onClose={() => {
						setOpenAddEditNoteModal({
							isShown: false,
							type: "add",
							data: null,
						});
					}}
					getAllNotes={getAllNotes}
					showToastMessage={showToastMessage}
				/>
			</Modal>
			<Toast
				isShown={showToastMsg.isShown}
				message={showToastMsg.message}
				type={showToastMsg.type}
				onClose={handleCloseToast}
			/>
		</>
	);
};
