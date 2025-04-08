import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import axios from "axios";

function EditPost() {
  const { id } = useParams(); // Get the post ID from the URL
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // State to store the image (base64 or URL)
  const [post, setPost] = useState(null);
  const navigate = useNavigate(); // For navigation after successful update
  const [uploaded, setUploaded] = useState(false);

  // Fetch the post by ID when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setImage(res.data.image || ""); // Assuming `image` is a field in the post document
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      setUploaded(true);
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

    const handleSubmit = (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
    
      // Only append the image if a new one is selected
      if (image && typeof image !== "string") {
        formData.append("image", image); // Append the image file
      }
    
      axios
        .put(`http://localhost:5000/api/posts/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          navigate(`/forum/post/${id}`); // Redirect after successful update
        })
        .catch((err) => console.log(err));
    };    

  const deleteImage = () => {
    // Send a request to delete the image
    axios
      .put(`http://localhost:5000/api/posts/${id}/delete-image`)
      .then(() => {
        setImage(""); // Clear the image in the state
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit post title"
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit post content"
          />
        </div>

        {/* Display image preview if there is an image */}
        {image && !uploaded && (
          <div>
            <img
              src={post.image.startsWith("data:") || post.image.startsWith("http") ? post.image : `data:image/jpeg;base64,${post.image}`}
              alt="Post Image"
              style={{ width: "200px", marginTop: "10px" }}
            />
            <button type="button" onClick={deleteImage}>
              Delete Image
            </button>
          </div>
        )}
        {image && uploaded && (
          <div>
            <img
              src={typeof image === "string" ? image : URL.createObjectURL(image)}
              alt="Post Image"
              style={{ width: "200px", marginTop: "10px" }}
            />
            <button type="button" onClick={deleteImage}>
              Delete Image
            </button>
          </div>
        )}
        {/* Allow the user to upload a new image */}
        {!image && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // Handle image selection
          />
        )}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditPost;
