require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For token generation

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB

// process.env.MONGO_URI not working, so replaced with hardcoded string for now

mongoose
  .connect("mongodb://localhost:27017/sc2006", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if the connection fails
  });

// Configure cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST",
    credentials: true, // Allow credentials like cookies
  }),
);

// Define Mongoose Schemas

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Add the username field
  text: { type: String, required: true }, // Text of the comment
  date: { type: Date, default: Date.now }, // Date of the comment
  deleted: { type: Boolean, default: false }, // Flag to mark the comment as deleted
});

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Base64 image string field
  comments: [commentSchema], // Add the comments array
  deleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

const ReportSchema = new mongoose.Schema({
  username: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  report: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", ReportSchema);
// API Routes

// Report a post
app.post("/api/posts/:id/report", async (req, res) => {
  const { username, report } = req.body;
  const postId = req.params.id;

  const newReport = new Report({ username, postId, report });
  await newReport.save();
  res.status(201).json(newReport);
});

// Report a comment
app.post("/api/posts/:postId/comments/:commentId/report", async (req, res) => {
  const { username, report } = req.body;
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const newReport = new Report({ username, postId, commentId, report });
  await newReport.save();
  res.status(201).json(newReport);
});

// Signup route
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the username already exists
  const temp = await User.findOne({ username: username });
  if (temp) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Check if the email already in use
  const temp2 = await User.findOne({ email: email });
  if (temp2) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  // Generate JWT token for the user
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.status(201).json({ user: newUser, token });
});

// Logout route
app.post("/logout", (req, res) => {
  // If using cookies to store the JWT, clear the cookie
  // res.clearCookie('jwtToken');  // Replace with the name of your JWT cookie
  res.status(200).send("Logged out successfully");
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    console.log("here2");

    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT token for the user
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ user, token });
});

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded; // Attach user data to the request
    next(); // Proceed to the next middleware/route handler
  });
};

// POST route to verify the JWT token
app.post("/api/auth/verify", verifyToken, (req, res) => {
  res.json({ user: req.user }); // Return the user data if token is valid
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, username, image } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newPost = new Post({ title, content, username, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a comment to a post
app.post("/api/posts/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { username, text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Create a new comment object with username and text
    const newComment = {
      username, // Add the username
      text,
      date: new Date(), // Optionally, you can add a date for when the comment was posted
    };

    // Push the new comment into the post's comments array
    post.comments.push(newComment);

    // Save the updated post with the new comment
    const updatedPost = await post.save();

    // Send the updated post or just the new comment back as the response
    res.json(newComment); // Send the new comment as the response
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to edit a comment
app.put("/api/posts/:postId/comments/:commentId", async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the comment text
    comment.text = text;

    await post.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to delete a comment
app.delete("/api/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Set deleted to true
    comment.deleted = true;

    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a post
app.patch("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.deleted = true;
    await post.save();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a specific post by ID
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title;
    post.content = content;
    post.image = image; // Update the image field

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST route to upload image as base64 string
app.post("/api/posts/:id/upload-image", async (req, res) => {
  const { imageBase64 } = req.body; // Assuming the base64 string is sent in the body

  if (!imageBase64) {
    return res.status(400).json({ message: "No image provided" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Store the base64 image string in the post's image field
    post.image = imageBase64;

    // Save the updated post
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete image
app.put("/api/posts/:id/delete-image", (req, res) => {
  const postId = req.params.id;

  // Update the post and set the image field to null or an empty string
  Post.findByIdAndUpdate(postId, { image: "" }, { new: true })
    .then((updatedPost) => res.json(updatedPost))
    .catch((err) => res.status(500).json({ error: "Failed to delete image" }));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
