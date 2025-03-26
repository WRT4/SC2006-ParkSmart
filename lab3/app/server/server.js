const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For token generation
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("image"); // 'image' is the name of the form field in the frontend

const fs = require("fs");
const os = require("os");
const path = require("path");
// Define the path to the .env file located in the root directory (outside the server folder)
const envFilePath = path.resolve(__dirname, "..", ".env");
require("dotenv").config({ path: envFilePath });

function setEnvValue(key, value) {
  // Read the contents of the .env file
  const ENV_VARS = fs.readFileSync(envFilePath, "utf8").split(os.EOL);

  // Find the env we want based on the key
  const target = ENV_VARS.indexOf(
    ENV_VARS.find((line) => {
      // (?<!#\s*)   Negative lookbehind to avoid matching comments (lines that start with #).
      // (?==)       Positive lookahead to check if there is an equal sign right after the key.
      // This is to prevent matching keys prefixed with the key of the env var to update.
      const keyValRegex = new RegExp(`(?<!#\\s*)${key}(?==)`);
      return line.match(keyValRegex);
    }),
  );

  // If key-value pair exists in the .env file
  if (target !== -1) {
    // Replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);
  } else {
    // If it doesn't exist, add it instead
    ENV_VARS.push(`${key}=${value}`);
  }

  // Write everything back to the file system in the root directory
  fs.writeFileSync(envFilePath, ENV_VARS.join(os.EOL)); // Use the updated envFilePath
}

const app = express();
app.use(express.json());
app.use(cors());

// Increase limit for JSON payloads
app.use(express.json({ limit: "10mb" })); // Increase the limit as needed (e.g., 10mb)

// Reauthenticate API token

const url = "https://www.onemap.gov.sg/api/auth/post/getToken";

// Prepare the data payload
const data = JSON.stringify({
  email: process.env.ONEMAP_EMAIL,
  password: process.env.ONEMAP_PASSWORD,
});

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: data,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse response as JSON
  })
  .then((data) => {
    console.log(data); // Log the response data to the console
    // process.env.ONEMAP_API_KEY = data.access_token;
    setEnvValue("ONEMAP_API_KEY", data.access_token);
  })
  .catch((error) => {
    console.error("Error:", error); // Log any errors
  });

// Connect to MongoDB

mongoose
  .connect(process.env.MONGO_URI, {
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
  carPlateNumber: { type: String },
  name: { type: String, required: true },
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

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

// API Routes

// Get all feedback
app.get("/api/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Feedback route
app.post("/api/feedback", async (req, res) => {
  const { name, email, subject, message, rating } = req.body;

  // Create new feedback entry with ID and timestamp
  const newFeedback = new Feedback({
    name,
    email,
    subject,
    message,
    rating,
    createdAt: new Date().toISOString(),
  });

  await newFeedback.save();

  // Send feedback to server
  res.status(201).json(newFeedback);
});

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
  const { username, email, password, carPlateNumber, name } = req.body;

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

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    carPlateNumber,
    name,
  });
  await newUser.save();
  // Generate JWT token for the user
  const token = jwt.sign(
    {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      carPlateNumber: newUser.carPlateNumber,
      name: newUser.name,
    },
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
    {
      id: user.id,
      username: user.username,
      email: user.email,
      carPlateNumber: user.carPlateNumber,
      name: user.name,
    },
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
app.post("/api/posts", upload, async (req, res) => {
  try {
    const { title, content, username } = req.body;
    const image = req.file ? req.file.buffer.toString("base64") : null; // Convert image buffer to base64 if needed

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
      _id: new mongoose.Types.ObjectId(),
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
app.put("/api/posts/:id", upload, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    post.title = title;
    post.content = content;

    // Only update the image if a new one is uploaded
    if (req.file) {
      const image = req.file.buffer.toString("base64");
      post.image = image; // Update the image field
    }
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

// Route to update user details
// app.put('/api/users/update', verifyToken, async (req, res) => {
app.put("/api/users/update", async (req, res) => {
  const { current_username, username, email, carPlateNumber, name } = req.body;
  console.log(
    "updating db",
    current_username,
    username,
    email,
    carPlateNumber,
    name,
  );

  try {
    // Check if the user exists
    const user = await User.findOne({ username: current_username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.username != username) {
      // Check if the username already exists
      const temp = await User.findOne({ username: username });
      if (temp) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    if (user.email != email) {
      // Check if the email already in use
      const temp2 = await User.findOne({ email: email });
      if (temp2) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update details
    if (username) user.username = username;
    if (email) user.email = email;
    if (carPlateNumber) user.carPlateNumber = carPlateNumber;
    if (name) user.name = name;

    await user.save();
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        carPlateNumber: user.carPlateNumber,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    // Send updated user data
    res.json({ user, token });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Change Password Route
app.put("/api/auth/change-password", async (req, res) => {
  console.log("entered server");
  const { user, currentPassword, newPassword } = req.body;
  console.log(user, currentPassword, newPassword);

  if (!currentPassword || !newPassword) {
    console.log("entered if");
    return res
      .status(400)
      .json({ message: "Both old and new passwords are required" });
  }

  try {
    const user_obj = await User.findOne({ username: user.username });

    // Compare old password with stored password
    const isMatch = await bcrypt.compare(currentPassword, user_obj.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user_obj.password = hashedNewPassword;

    // Save the updated user
    await user_obj.save();

    const token = jwt.sign(
      {
        id: user_obj.id,
        username: user_obj.username,
        email: user_obj.email,
        carPlateNumber: user_obj.carPlateNumber,
        name: user_obj.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    // Send updated user data
    res.json({ user: user_obj, token });
    console.log(user_obj);
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
