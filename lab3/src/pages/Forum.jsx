import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthWrapper";
import imageCompression from "browser-image-compression";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ForumCard from "../components/ForumCard";

export default function Forum() {
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
    <>
      <Header></Header>
      <main className="flex flex-col gap-4 bg-gray-100 p-4 min-[840px]:flex-row">
        <section className="flex flex-col gap-4 min-[840px]:grow min-[840px]:basis-0">
          <p className="text-center text-2xl font-bold">Forum</p>
          {user ? (
            <form
              className="flex items-center justify-center"
              onSubmit={(e) => {
                e.preventDefault();
                createPost();
              }}
            >
              <div className="w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Create a Post
                </h2>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-400 p-2 focus:outline-4 focus:outline-blue-200"
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-400 p-2 focus:outline-4 focus:outline-blue-200"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something..."
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Upload File
                  </label>
                  <input
                    type="file"
                    className="file:text-md w-full rounded-lg border border-gray-400 p-2 text-gray-600 file:cursor-pointer file:rounded-md file:border file:border-gray-600 file:bg-gray-200 file:p-1 file:px-2 file:text-black hover:file:bg-gray-300 active:file:bg-gray-400"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {image && (
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt="Post Preview"
                      className="mt-2 w-[200px] justify-self-center"
                    />
                  )}{" "}
                  {/* Display the image preview */}
                </div>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 active:bg-blue-700"
                >
                  Create Post
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-red-600">
              Please log in to create a post.
            </p>
          )}
        </section>
        <section className="flex flex-col gap-4 min-[840px]:grow min-[840px]:basis-0">
          <p className="text-center text-2xl font-bold">Posts</p>
          {posts.map((post) => (
            <ForumCard key={post._id} post={post}></ForumCard>
          ))}
        </section>
      </main>
      <Footer></Footer>
    </>
  );
}
