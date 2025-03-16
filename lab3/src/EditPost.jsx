import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPost() {
    const { id } = useParams(); // Get the post ID from the URL
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(""); // State to store the image (base64 or URL)
    const navigate = useNavigate();  // Correct way in React Router v6

    // Fetch the post by ID when the component mounts
    useEffect(() => {
        axios.get(`http://localhost:5000/api/posts/${id}`)
            .then(res => {
                setTitle(res.data.title);
                setContent(res.data.content);
                setImage(res.data.image || ""); // Assuming `image` is a field in the post document
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Store the base64 string of the image
            };
            reader.readAsDataURL(file); // Read the file as base64 string
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Update the post with the new title and content
        axios.put(`http://localhost:5000/api/posts/${id}`, { title, content, image })
            .then(() => {
                // Redirect back to the post details page after successful update
                navigate(`/post/${id}`);
            })
            .catch(err => console.log(err));
    };

    const deleteImage = () => {
        // Send a request to delete the image
        axios.put(`http://localhost:5000/api/posts/${id}/delete-image`)
            .then(() => {
                setImage(""); // Clear the image in the state
            })
            .catch(err => console.log(err));
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
                {image && (
                    <div>
                        <img src={image} alt="Post Image" style={{ width: "200px", marginTop: "10px" }} />
                        <button type="button" onClick={deleteImage}>Delete Image</button>
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
