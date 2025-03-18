import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthWrapper";
import imageCompression from "browser-image-compression";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // New state for image
  const navigate = useNavigate(); // For navigation after successful post
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch posts from the backend
    axios
      .get("http://localhost:5000/api/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      try {
        // Set compression options
        const options = {
          maxSizeMB: 1, // Limit image size to 1MB
          maxWidthOrHeight: 1024, // Resize to max 1024px width/height
          useWebWorker: true, // Enable multi-threading for faster processing
        };
  
        // Compress the image
        const compressedFile = await imageCompression(file, options);
  
        // Convert the compressed file to base64 (if needed)
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setImage(compressedFile); // Set the file (not base64) for upload
        };
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };
  

  const createPost = async () => {
    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("username", user.username);
  
    if (image) {
      formData.append("image", image); // Send the compressed file
    }
  
    axios
      .post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setPosts([...posts, res.data]);
        setTitle("");
        setContent("");
        setImage("");
      })
      .catch((err) => console.log(err));
  };  

  return (
    <div>
      <h1>Forum</h1>
      {user ? (
        <>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // Handle image selection
          />
          {image && (
            <img
              src={typeof image === "string" ? image : URL.createObjectURL(image)}
              alt="Post Preview"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}{" "} {/* Display the image preview */}
          <button onClick={createPost}>Create Post</button>
        </>
      ) : (
        <p>Please log in to create a post.</p>
      )}

      <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post._id}>
          <Link to={`/forum/post/${post._id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p>{post.content}</p>
          {post.image && (
            <img
            src={post.image.startsWith("data:") || post.image.startsWith("http") ? post.image : `data:image/jpeg;base64,${post.image}`}
              alt="Post Image"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}{" "}
          {/* Image display */}
          <p>
            <strong>Posted by:</strong> {post.username}{" "}
            {/* Display the username */} <strong> on </strong>{" "}
            {new Date(post.date).toLocaleString()}{" "}
          </p>
          {/* Display comments for each post */}
          <div className="comments-section">
            <h4>Comments</h4>
            {post.comments && post.comments.length > 0 ? (
              post.comments
                .filter((c) => !c.deleted) // Filter out deleted comments
                .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date (ascending)
                .slice(0, 5) // Limit the number of comments displayed
                .map((c, index) => (
                  <div key={index} className="comment">
                    <p>
                      <strong>{c.username}</strong>: {c.text}
                    </p>
                    {/* <small>{c.date.toLocaleString()}</small> Display the date in a human-readable format */}
                  </div>
                ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Forum;
