import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function SinglePost() {
    const params = useParams();
    const navigate =  useNavigate();

    const [post, setPost] = useState({});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(`https://kekambas-blog-api.onrender.com/${params.postId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPost(data);
                setTitle(data.title);
                setContent(data.content);
            })
    }, [params.postId])
    
	async function handleSubmit(e) {
		e.preventDefault();

		// Get the updated data from the form
		let updatedTitle = title;
		let updatedContent = content;

		// Get the JWT token from localStorage
		let token = localStorage.getItem("token");

		// Set up the request headers
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${token}`);

		// Set up the request body
		let requestBody = JSON.stringify({
			title: updatedTitle,
			content: updatedContent,
		});

		// Make the fetch request
		let response = await fetch(
			`https://kekambas-blog-api.onrender.com/api/posts/${params.postId}`,
			{
				method: "PUT",
				headers: myHeaders,
				body: requestBody,
			}
		);

		let data = await response.json();

		if (data.error) {
			console.log(data.error, "danger");
			navigate("/login");
		} else {
			console.log(`${data.title} has been updated`, "success");
			navigate("/");
		}
	}

     async function handleDelete(e) {
				e.preventDefault();

				// Get the JWT token from localStorage
				let token = localStorage.getItem("token");

				// Set up the request headers
				let myHeaders = new Headers();
				myHeaders.append("Authorization", `Bearer ${token}`);

				// Make the fetch request
				let response = await fetch(
					`https://kekambas-blog-api.onrender.com/api/posts/${params.postId}`,
					{
						method: "DELETE",
						headers: myHeaders,
					}
				);

				let data = await response.json();

				if (data.error) {
					console.log(data.error, " error");
				} else {
					console.log(`${data.success}`, " success");
					navigate("/");
				}
			}
    
	return (
		<>
			<h2 className="text-center">Post Options</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input type="text" name="title" className="form-control my-3" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
					<textarea name="content" className="form-control my-3" placeholder="Enter Body" value={content} onChange={(e) => setContent(e.target.value)}/>
                    <div className="btn-group text-center">
                        <input type="submit" value="Update Post" className="text-center btn btn-success w-50"/>
                        <button className="btn btn-danger w-50" onClick={handleDelete}>Delete Post</button>
				    </div>
                </div>
			</form>
		</>
	);
};