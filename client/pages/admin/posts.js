import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import { useRouter, userRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import renderHTML from "react-render-html";
import Link from "next/link";
import { Avatar, Modal } from "antd";
import { imageSource } from "../../functions";
import {
	DeleteOutlined,
	RollbackOutlined,
	EyeTwoTone,
} from "@ant-design/icons";

import moment from "moment";

const Admin = () => {
	const [state, setState] = useContext(UserContext);
	// posts
	const [posts, setPosts] = useState([]);
	// users
	const [users, setUsers] = useState([]);

	// route
	const router = useRouter();

	useEffect(() => {
		if (state && state.token) {
			newsFeed();
		}
	}, [state && state.token]);

	const newsFeed = async () => {
		try {
			const { data } = await axios.get(`/posts`);
			// console.log("user posts => ", data);

			setPosts(data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleDelete = async (post) => {
		try {
			const answer = window.confirm(
				"Are you sure want to delete he post?"
			);
			if (!answer) return;
			const { data } = await axios.delete(
				`/admin/delete-post/${post._id}`
			);
			toast.error("Post deleted");
			newsFeed();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="container-fluid align-content-center">
			{/* <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>ADMIN</h1>
        </div>
      </div> */}
			{/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
			{/* <pre>{JSON.stringify(users, null, 4)}</pre> */}
			<div className="row">
				<div className="col adminHead p-lg-5">
					<a>Total posts : {posts.length}</a>
				</div>
			</div>
			<div className="row-cols-md-5 p-5 table-responsive">
				<table className="table table-striped table-hover table-light pb-lg-5">
					<thead className="table-dark">
						<tr>
							<th>Image</th>
							<th>Content</th>
							<th>Posted By</th>
							<th>Likes</th>
							<th>comments</th>
							<th>Created At</th>
							<th>Operation</th>
							<th>View Post</th>
						</tr>
					</thead>
					<tbody>
						{posts &&
							posts.map((post) => (
								<tr
									key={post._id}
									className="justify-content-between">
									<td>
										<Avatar
											size={40}
											src={
												post.image
													? post.image.url
													: null
											}
											alt="No Image"
										/>
									</td>
									<td>{renderHTML(post.content)}</td>
									<td>{post.postedBy.name}</td>
									<td>{post.likes.length}</td>
									<td>{post.comments.length}</td>
									{/* <td>{countPost}</td> */}

									<td>{moment(post.createdAt).fromNow()}</td>
									<td>
										<DeleteOutlined
											onClick={() => handleDelete(post)}
											className="text-danger pt-2 h5 px-2"
										/>
									</td>
									<td>
										<Link href={`../post/view/${post._id}`}>
											<a>
												<EyeTwoTone className=" text-primary pt-2 h5 px-2" />
											</a>
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
			<div className="row">
				<Link href="/admin">
					<a className="d-flex justify-content-center pt-5">
						<div className="col">
							<div className="row">
								<RollbackOutlined />
							</div>
							<div className="row justify-content-center">
								Go Back
							</div>
						</div>
					</a>
				</Link>
			</div>
		</div>
	);
};

export default Admin;
