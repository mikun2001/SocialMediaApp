import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import { useRouter, userRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Avatar, Modal } from "antd";
import {
	DeleteOutlined,
	RollbackOutlined,
	EyeTwoTone,
} from "@ant-design/icons";
import { imageSource } from "../../functions";
import moment from "moment";

import { Popconfirm } from "antd";
import React from "react";
import { userPost } from "../../../server/controllers/post";

const Users = () => {
	const [state, setState] = useContext(UserContext);
	// posts
	const [posts, setPosts] = useState([]);
	// users
	const [users, setUsers] = useState([]);
	const [countPost, setCountPost] = useState(0);
	// route
	const router = useRouter();

	useEffect(() => {
		if (state && state.token) {
			newsFeed();
			userData();
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
	const userData = async () => {
		try {
			const { data } = await axios.get(`/admin/users`);
			// console.log("user data => ", data);

			setUsers(data);
		} catch (err) {
			console.log(err);
		}
	};

	const postCount = (user) => {
		const counter = 0;
		posts &&
			posts.map(async (post) => {
				if (post.postedBy === user._id) {
					counter = counter + 1;
				}
			});

		setCountPost(counter);
	};

	const handleDelete = async (user) => {
		try {
			const answer = window.confirm(
				"Are you sure to delete the user and its data?"
			);
			if (!answer) return;

			//Remove following
			user.following &&
				user.following.map(async (id) => {
					const data = await axios.put("/admin/user-unfollow", {
						user_id: user._id,
						body_id: id,
					});
				});
			//Remove followers
			user.followers &&
				user.followers.map(async (id) => {
					const data = await axios.put("/admin/user-unfollow", {
						user_id: id,
						body_id: user._id,
					});
				});

			//remove all posts posted by the user
			posts &&
				posts.map(async (post) => {
					if (post.postedBy._id == user._id) {
						try {
							const { data } = await axios.delete(
								`/admin/delete-post/${post._id}`
							);
							newsFeed();
							newsFeed();
						} catch (err) {
							console.log(err);
						}
					} else {
						post &&
							post.comments &&
							post.comments.map(async (c) => {
								try {
									const postId = post._id;
									if (user._id === c.postedBy._id) {
										const { data } = await axios.put(
											"/admin/remove-comment",
											{
												postId,
												c,
											}
										);
									}
									newsFeed();
								} catch (err) {
									console.log(err);
								}
							});
						post &&
							post.likes &&
							post.likes.map(async (c) => {
								try {
									if (user._id === c) {
										const { data } = await axios.put(
											"/admin/unlike-post",
											{
												user_id: c,
												post_id: post._id,
											}
										);
									}
									newsFeed();
								} catch (err) {
									console.log(err);
								}
							});
					}
				});

			const { data } = await axios.delete(
				`/admin/delete-user/${user._id}`
			);
			toast.error("User deleted");
			userData();
			userData();
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
					<a>Total Users : {users.length}</a>
				</div>
			</div>
			<div className="row-cols-md-5 p-5 table-responsive">
				<table className="table table-striped table-hover table-light pb-lg-5">
					<thead className="table-dark">
						<tr>
							<th>Image</th>
							<th>Name</th>
							<th>Username</th>
							<th>Email</th>
							<th>Role</th>
							{/* <th>Posts</th> */}
							<th>Following</th>
							<th>Followers</th>
							<th>Created At</th>
							<th>Operation</th>
							<th>View Profile</th>
						</tr>
					</thead>
					<tbody>
						{users &&
							users.map((user) => (
								<>
									{/* {postCount(user)} */}
									<tr
										key={user._id}
										className="justify-content-between">
										<td>
											<Avatar
												size={40}
												src={imageSource(user)}
											/>
										</td>
										<td>
											<Link href={`/user/${user._id}`}>
												<a className="h6">
													{user.name}
												</a>
											</Link>
										</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>{user.role}</td>
										{/* <td>{countPost}</td> */}

										<td>{user.following.length}</td>
										<td>{user.followers.length}</td>
										<td>
											{moment(user.createdAt).fromNow()}
										</td>
										<td>
											{user && user.role !== "Admin" && (
												<DeleteOutlined
													onClick={() =>
														handleDelete(user)
													}
													className="text-danger pt-2 h5 px-2"
												/>
											)}
										</td>

										<td>
											<Link
												href={`../user/${user._id}`}>
												<a>
													<EyeTwoTone className=" text-primary pt-2 h5 px-2" />
												</a>
											</Link>
										</td>
									</tr>
								</>
							))}
					</tbody>
				</table>
			</div>
			<div className="row">
				<Link href="/admin">
					<a className="d-flex justify-content-center pt-3">
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

export default Users;
