require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING)
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error("MongoDB connection error:", error));



// mongoose
//   .connect(process.env.MONGODB_CONNECTION_STRING)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => console.error("MongoDB connection error:", error));


const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
	cors({
		origin: [
			"https://notes-app-k8ik.vercel.app", // Your frontend
			"http://localhost:5173", // Local dev, if needed
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true, // Only if you use cookies or auth headers
	})
);

app.get("/", (req, res) => {
	res.json({ data: "hello" });
});

//Create Account
app.post("/create-account", async (req, res) => {
	const { fullName, email, password } = req.body;

	if (!fullName) {
		return res
			.status(400)
			.json({ error: true, message: "Full Name is required" });
	}

	if (!email) {
		return res.status(400).json({ error: true, message: "Email is required" });
	}

	if (!password) {
		return res
			.status(400)
			.json({ error: true, message: "Password is required" });
	}

	const isUser = await User.findOne({ email: email });

	if (isUser) {
		return res.json({
			error: true,
			message: "User aleady exists",
		});
	}

	const user = new User({
		fullName,
		email,
		password,
	});

	await user.save();

	const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "36000m",
	});

	return res.json({
		error: false,
		user,
		accessToken,
		message: "Registration Successful",
	});
});

//Login
app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email) {
		return res.status(400).json({ error: true, message: "Email is required" });
	}

	if (!password) {
		return res
			.status(400)
			.json({ error: true, message: "Password is Required" });
	}
	
	try {
		const userInfo = await User.findOne({ email: email });

	if (!userInfo) {
		return res.status(400).json("User Not Found");
	}

	if (userInfo.email == email && userInfo.password == password) {
		const user = { user: userInfo };
		const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "36000m",
		});

		return res.json({
			error: false,
			message: " Login Successful",
			email,
			accessToken,
		});
	} else {
		return res.status(400).json({
			error: true,
			message: "Invalid Credentials",
		});
	}
	} catch (error) {
		
		console.log(error);
	}
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
	const { user } = req.user;

	const isUser = await User.findOne({ _id: user._id });

	if (!isUser) {
		return res.sendStatus(401).json({ error: true, message: "User not found" });
	}

	return res.json({
		user: {
			fullName: isUser.fullName,
			email: isUser.email,
			_id: isUser._id,
			createdOn: isUser.createdOn,
		},
		message: "All notes retreived successfully",
	});
});

//Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
	const { title, content, tags } = req.body;
	const { user } = req.user;

	if (!title) {
		return res.status(400).json({ error: true, message: "Title is required" });
	}

	if (!content) {
		return res
			.status(400)
			.json({ error: true, message: "Description is Required" });
	}
	try {
		const note = new Note({
			title,
			content,
			tags: tags || [],
			userId: user._id,
		});

		await note.save();

		return res.json({
			error: false,
			note,
			message: "Note added successfully",
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
	}
});

//Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
	const noteId = req.params.noteId;
	const { title, content, tags, isPinned } = req.body;
	const { user } = req.user;

	if (!title && !content && !tags) {
		return res
			.status(400)
			.json({ error: true, message: "No Changes Provided" });
	}

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note) {
			return res.status(400).json({ error: true, message: "Note Not Found" });
		}

		if (title) note.title = title;
		if (content) note.content = content;
		if (tags) note.tags = tags;
		if (isPinned) note.isPinned = isPinned;

		await note.save();

		return res.json({
			error: false,
			note,
			message: "Note Updated Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
	}
});
//Get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
	const { user } = req.user;

	try {
		const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

		return res.json({
			error: false,
			notes,
			message: "All notes retrieved successfully",
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
	}
});

//Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
	const noteId = req.params.noteId;
	const { user } = req.user;

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note) {
			return res.status(404).json({ error: true, message: "Note Not Found" });
		}

		await Note.deleteOne({ _id: noteId, userId: user._id });

		return res.json({
			error: false,
			message: "Note deleted successfully",
		});
	} catch (error) {
		return res.json({
			error: true,
			message: "Internal Server Error",
		});
	}
});

//Update IsPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
	const noteId = req.params.noteId;
	const { isPinned } = req.body;
	const { user } = req.user;

	// if (!noteId) {
	// 	return res
	// 		.status(400)
	// 		.json({ error: true, message: "No Changes provided" });
	// }

	try {
		const note = await Note.findOne({ _id: noteId, userId: user._id });

		if (!note) {
			return res.status(404).json({ error: true, message: "Note Not Found" });
		}

		note.isPinned = isPinned;
		await note.save();

		return res.json({
			error: false,
			note,
			message: isPinned
				? "Note Pinned Successfully"
				: "Note Unpinned Successfully",
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: true, message: "Internal Sever Error" });
	}
});

//Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
	const { user } = req.user;
	const { query } = req.query;

	if (!query) {
		return res
			.status(400)
			.json({ error: true, message: "Search query is Required!F" });
	}

	try {
		const matchingNotes = await Note.find({
			userId: user._id,
			$or: [
				{ title: { $regex: new RegExp(query, "i") } },
				{ content: { $regex: new RegExp(query, "i") } },
				{ tags: { $regex: new RegExp(query, "i") } },
			],
		});

		return res.json({
			error: false,
			notes: matchingNotes,
			message: "Notes matching the serach query retireved successfully",
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: true, message: "Internal Server Error" });
	}
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
