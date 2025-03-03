const NoteModel = require("../models/note.model.js");

// ✅ Read notes
const readNote = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const notes = await NoteModel.find({ userId }).sort({ isPinned: -1 }); // Sorting by isPinned in descending order to show pinned notes first

    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error reading notes:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

// ✅ Add note
const addNote = async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    const userId = req.userId; // Get the userId from the token (set by middleware)

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!content)
      return res.status(400).json({ message: "Content is required" });

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const note = new NoteModel({
      title,
      content,
      tag: tag || [],
      userId: userId, // Use the userId from the token
    });

    await note.save();

    return res.status(201).json({
      message: "Note added successfully",
      status: true,
      note,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

// ✅ Update note
const updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId; // Note ID from URL params
    const { title, content, tag, isPinned } = req.body; // Get new data from the request body
    const userId = req.userId; // User ID from the token (set by middleware)

    if (!title && !content && !tag && isPinned) {
      return res.status(400).json({ message: "No change provided" });
    }

    // Ensure userId is available
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    // Find the note by noteId (using _id) and userId
    const note = await NoteModel.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found", status: false });
    }

    // Update fields if provided
    if (title) note.title = title;
    if (content) note.content = content;
    if (tag) note.tag = tag;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      message: "Note updated successfully",
      status: true,
      note,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

// ✅ Delete note
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.userId; // Assuming the user ID is coming from the token middleware (not req.user)

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    // Find and delete the note by noteId and userId
    const note = await NoteModel.findOneAndDelete({
      _id: noteId,
      userId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found", status: false });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
      status: true,
      data: note,
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

const updateNotePinned = async (req, res) => {
  try {
    const noteId = req.params.noteId; // Correct parameter name
    const { isPinned } = req.body; // Extract isPinned from request body
    const userId = req.userId; // Ensure correct user ID retrieval

    if (typeof isPinned !== "boolean") {
      return res.status(400).json({ message: "Invalid isPinned value", status: false });
    }

    // Find the note with matching noteId and userId
    const note = await NoteModel.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found", status: false });
    }

    // Update the isPinned field
    note.isPinned = isPinned;
    await note.save(); // Save the updated note

    return res.status(200).json({
      message: "Note pinned status updated successfully!",
      status: true,
      data: note,
    });
  } catch (error) {
    console.error("Update Note Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      error: error.message,
    });
  }
};


const searchNote = async (req, res) => {
  try {
    const userId = req.userId;
    const query = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required " });
    }

    const matchingNote = await NoteModel.find({
      userId: userId,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.status(200).json({
      message: "Note is matching to search!",
      matchingNote,
      status: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

module.exports = {
  addNote,
  readNote,
  updateNote,
  deleteNote,
  updateNotePinned,
  searchNote,
};
