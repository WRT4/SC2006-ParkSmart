import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

  if (!post) return <p className="dark:text-white">Loading...</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4 dark:bg-gray-800">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-700">
          <h1 className="mb-6 text-2xl font-bold dark:text-white">Edit Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Edit post title"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Edit post content"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                rows="6"
              />
            </div>

            {/* Display image preview if there is an image */}
            {image && !uploaded && (
              <div className="mt-4">
                <img
                  src={post.image.startsWith("data:") || post.image.startsWith("http") ? post.image : `data:image/jpeg;base64,${post.image}`}
                  alt="Post Image"
                  className="mb-2 max-h-60 rounded-lg"
                />
                <button 
                  type="button" 
                  onClick={deleteImage}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete Image
                </button>
              </div>
            )}
            {image && uploaded && (
              <div className="mt-4">
                <img
                  src={typeof image === "string" ? image : URL.createObjectURL(image)}
                  alt="Post Image"
                  className="mb-2 max-h-60 rounded-lg"
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setImage("");
                    setUploaded(false);
                  }}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete Image
                </button>
              </div>
            )}
            {/* Allow the user to upload a new image */}
            {!image && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:text-md w-full rounded-lg border border-gray-300 p-2 text-gray-600 file:cursor-pointer file:rounded-md file:border file:border-gray-600 file:bg-gray-200 file:p-1 file:px-2 file:text-black hover:file:bg-gray-300 active:file:bg-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:file:bg-gray-700 dark:file:border-gray-600 dark:file:text-white"
                /> 
              </div>
            )}
            <div className="flex space-x-2 pt-4">
              <button 
                type="submit"
                className="flex-1 rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 active:bg-blue-700"
              >
                Save Changes
              </button>
              <button 
                type="button"
                onClick={() => navigate(`/forum/post/${id}`)}
                className="flex-1 rounded-lg bg-gray-500 py-2 text-white transition hover:bg-gray-600 active:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditPost;