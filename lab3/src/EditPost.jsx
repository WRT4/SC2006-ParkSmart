import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPost() {
    const { id } = useParams(); // Get the post ID from the URL
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();  // Correct way in React Router v6

    // Fetch the post by ID when the component mounts
    useEffect(() => {
        axios.get(`http://localhost:5000/api/posts/${id}`)
            .then(res => {
                setTitle(res.data.title);
                setContent(res.data.content);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Update the post with the new title and content
        axios.put(`http://localhost:5000/api/posts/${id}`, { title, content })
            .then(() => {
                // Redirect back to the post details page after successful update
                navigate(`/post/${id}`);
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
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditPost;
