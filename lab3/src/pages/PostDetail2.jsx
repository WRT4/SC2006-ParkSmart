import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../auth/AuthWrapper";
import imageCompression from "browser-image-compression";
import Comment from "../components/Comment";

function PostDetail2() {
  const { id } = useParams();
  const navigate = useNavigate(); // For programmatic navigation
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // New state for image
  //
  //
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
  const [editedCommentText, setEditedCommentText] = useState(""); // Store the edited text
  const { user } = useContext(AuthContext);
  const [reportText, setReportText] = useState(""); // State to hold report text
  const [reportingPost, setReportingPost] = useState(false); // Track if reporting post
  const [reportingCommentId, setReportingCommentId] = useState(null); // Track comment being reported

  useEffect(() => {
    // Fetch the specific post by its ID
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (post) {
      setTitle(title ? title : post.title);
      setContent(content ? content : post.content);
    }
  }, [isEditingPost]);

  const addComment = () => {
    // Post the new comment to the backend
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }
    if (comment.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }
    // Post the new comment to the backend
    axios
      .post(`http://localhost:5000/api/posts/${id}/comments`, {
        username: user.username, // Include the logged-in user's username
        text: comment,
      })
      .then((res) => {
        // After successfully adding the comment, update the post data
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, res.data], // Append the new comment
        }));
        setComment(""); // Clear the comment input field after submitting
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

  const editPost = async () => {
    if (user.username !== post.username) {
      alert("You can only edit your own posts.");
      navigate(`/forum/post/${id}`);
      return;
    }
    setIsEditingPost(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("username", user.username);
    if (image) {
      formData.append("image", image); // Send the compressed file
    }

    axios
      .put(`http://localhost:5000/api/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsEditingPost(false);
      });
  };

  const deletePost = () => {
    if (user.username !== post.username) {
      alert("You can only delete your own posts.");
      return;
    }
    // Confirm deletion with the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (confirmDelete) {
      // Delete the post from the backend
      axios
        .patch(`http://localhost:5000/api/posts/${id}`, { deleted: true })
        .then(() => {
          // After successfully deleting the post, redirect to the forum page
          navigate("/forum");
        })
        .catch((err) => console.log(err));
    }
  };

  // Edit Comment Functionality
  const editComment = (e) => {
    const commentId =
      e.currentTarget.parentNode.parentNode.parentNode.getAttribute("data-id");
    const comment = post.comments.find((comment) => comment._id === commentId);
    if (user.username !== comment.username) {
      alert("You can only edit your own comments.");
      return;
    }
    // Start editing the comment by setting the current text
    setEditingCommentId(commentId);
    setEditedCommentText(comment.text); // Populate the input with the current comment text
  };

  // Save the edited comment
  const saveComment = (e) => {
    const commentId =
      e.currentTarget.parentNode.parentNode.getAttribute("data-id");
    if (!editedCommentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    // Send the updated comment to the backend
    axios
      .put(`http://localhost:5000/api/posts/${id}/comments/${commentId}`, {
        text: editedCommentText,
      })
      .then((res) => {
        // After successfully updating the comment, update the UI
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.map((c) =>
            c._id === commentId ? { ...c, text: editedCommentText } : c,
          ),
        }));
        setEditingCommentId(null); // Reset editing state
        setEditedCommentText(""); // Clear the input field
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

  const deleteComment = (e) => {
    const commentId =
      e.currentTarget.parentNode.parentNode.parentNode.getAttribute("data-id");
    const comment = post.comments.find((comment) => comment._id === commentId);
    if (user.username !== comment.username) {
      alert("You can only delete your own comments.");
      return;
    }
    // Confirm deletion with the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );
    if (confirmDelete) {
      // Delete the comment from the backend
      axios
        .delete(`http://localhost:5000/api/posts/${id}/comments/${commentId}`)
        .then(() => {
          // After successfully deleting the comment, update the comments array
          setPost((prevPost) => ({
            ...prevPost,
            comments: prevPost.comments.filter((c) => c._id !== commentId),
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  const reportPost = () => {
    if (!reportText.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }
    axios
      .post(`http://localhost:5000/api/posts/${id}/report`, {
        username: user.username,
        report: reportText,
      })
      .then((res) => {
        alert("Post reported successfully");
        setReportingPost(false); // Hide the report box
        setReportText(""); // Reset the report text
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

  const reportComment = (commentId) => {
    if (!reportText.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }
    axios
      .post(
        `http://localhost:5000/api/posts/${id}/comments/${commentId}/report`,
        {
          username: user.username,
          report: reportText,
        },
      )
      .then((res) => {
        alert("Comment reported successfully");
        setReportingCommentId(null); // Hide the report box
        setReportText(""); // Reset the report text
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

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

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Header></Header>
      {isEditingPost ? (
        <form
          className="flex items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            editPost();
          }}
        >
          <div className="w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Edit Post
            </h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                defaultValue={title ? title : post.title}
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
                defaultValue={content ? content : post.content}
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
              {image ? (
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Post Preview"
                  className="mt-2 w-[200px] justify-self-center"
                />
              ) : (
                post.image && (
                  <img
                    src={
                      post.image.startsWith("data:") ||
                      post.image.startsWith("http")
                        ? post.image
                        : `data:image/jpeg;base64,${post.image}`
                    }
                    alt="Post Image"
                    className="mt-2 w-[200px] justify-self-center"
                  />
                )
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 active:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={(e) => {
                  setIsEditingPost(false);
                }}
                type="button"
                className="w-full cursor-pointer rounded-lg bg-gray-500 py-2 text-white transition hover:bg-gray-600 active:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 bg-gray-100 p-4">
          <div className="grid w-full max-w-[800px] gap-4 rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-2xl font-semibold">
              {title ? title : post.title}
            </p>
            <p>{content ? content : post.content}</p>
            {image ? (
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt="Post Preview"
                className="mt-2 w-[200px] justify-self-center"
              />
            ) : (
              post.image && (
                <img
                  src={
                    post.image.startsWith("data:") ||
                    post.image.startsWith("http")
                      ? post.image
                      : `data:image/jpeg;base64,${post.image}`
                  }
                  alt="Post Image"
                  className="mt-2 w-[200px] justify-self-center"
                />
              )
            )}{" "}
            {/* Image display */}
            <p className="text-sm text-gray-600">
              Posted by: {post.username},{/* Display the username */}{" "}
              {timeSince(new Date(post.date).getTime())}
            </p>
            {/* Conditionally render Edit and Delete buttons */}
            {user && user.username === post.username ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditingPost(true);
                      }}
                      type="button"
                      className="cursor-pointer rounded-lg bg-blue-500 p-2 whitespace-nowrap text-white transition hover:bg-blue-600 active:bg-blue-700 min-[370px]:px-4 min-[370px]:py-2"
                    >
                      Edit Post
                    </button>
                    <button
                      onClick={deletePost}
                      type="button"
                      className="cursor-pointer rounded-lg bg-red-500 p-2 whitespace-nowrap text-white transition hover:bg-red-600 active:bg-red-700 min-[370px]:px-4 min-[370px]:py-2"
                    >
                      Delete Post
                    </button>
                  </div>
                  <p className="ml-2 text-center text-sm text-gray-600">
                    {post.comments.filter((comment) => !comment.deleted).length}{" "}
                    comment
                    {(post.comments.filter((comment) => !comment.deleted)
                      .length > 1 ||
                      post.comments.filter((comment) => !comment.deleted)
                        .length === 0) &&
                      "s"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-end text-sm text-gray-600">
                {post.comments.filter((comment) => !comment.deleted).length}{" "}
                comment
                {(post.comments.filter((comment) => !comment.deleted).length >
                  1 ||
                  post.comments.filter((comment) => !comment.deleted).length ===
                    0) &&
                  "s"}
              </p>
            )}
            {user && user.username !== post.username && (
              <div>
                <button
                  onClick={() => setReportingPost(true)}
                  className="hover cursor-pointer p-1 text-gray-400 outline-black hover:bg-gray-200 hover:text-red-600 hover:outline-1 active:bg-gray-300 active:text-red-700 active:outline-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-flag-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                  </svg>
                </button>
              </div>
            )}
            {/* Show report input for post if reportingPost is true */}
            {reportingPost && (
              <div className="grid gap-2">
                <textarea
                  rows="4"
                  className="block w-full max-w-[400px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Enter your reason for reporting the post"
                ></textarea>
                <div className="flex max-w-[400px] gap-2">
                  <button
                    type="button"
                    onClick={reportPost}
                    className="w-full cursor-pointer rounded-lg bg-blue-500 py-2 text-sm text-white transition hover:bg-blue-600 active:bg-blue-700"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setReportingPost(false)}
                    type="button"
                    className="w-full cursor-pointer rounded-lg bg-gray-500 py-2 text-sm text-white transition hover:bg-gray-600 active:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="grid w-full max-w-[800px] gap-4 rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-center text-2xl font-semibold">Comments</p>
            {post.comments && post.comments.length > 0 ? (
              post.comments
                .filter((c) => !c.deleted) // Filter out deleted comments
                .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date (ascending)
                .map((c) => (
                  <Comment
                    key={c._id}
                    comment={c}
                    editingCommentId={editingCommentId}
                    editedCommentText={editedCommentText}
                    setEditedCommentText={setEditedCommentText}
                    reportingCommentId={reportingCommentId}
                    setReportingCommentId={setReportingCommentId}
                    user={user}
                    deleteComment={deleteComment}
                    editComment={editComment}
                    setEditingCommentId={setEditingCommentId}
                    saveComment={saveComment}
                    reportText={reportText}
                    setReportText={setReportText}
                    reportComment={reportComment}
                  ></Comment>
                ))
            ) : (
              <p className="text-center">No comments yet.</p>
            )}
            {user ? (
              <form
                className="flex w-full flex-col items-center gap-0.5 sm:gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  addComment();
                }}
              >
                <label
                  htmlFor="comment"
                  className="mb-2 block text-sm font-medium text-gray-900 min-[400px]:text-base dark:text-white"
                >
                  Your comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="block w-full max-w-[400px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Leave a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  className="w-full max-w-[400px] cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 active:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-center text-red-600">
                Please log in to comment.
              </p>
            )}
          </div>
        </div>
      )}

      <Footer></Footer>
    </>
  );
}

export default PostDetail2;

function timeSince(timeStamp) {
  const seconds = new Date().getTime();
  const difference = (seconds - timeStamp) / 1000;
  let output = ``;
  if (difference < 60) {
    // Less than a minute has passed:
    output = `${Math.floor(difference)} seconds ago`;
  } else if (difference < 3600) {
    // Less than an hour has passed:
    output = `${Math.floor(difference / 60)} minutes ago`;
  } else if (difference < 86400) {
    // Less than a day has passed:
    output = `${Math.floor(difference / 3600)} hours ago`;
  } else if (difference < 2620800) {
    // Less than a month has passed:
    output = `${Math.floor(difference / 86400)} days ago`;
  } else if (difference < 31449600) {
    // Less than a year has passed:
    output = `${Math.floor(difference / 2620800)} months ago`;
  } else {
    // More than a year has passed:
    output = `${Math.floor(difference / 31449600)} years ago`;
  }
  return output;
}
