import { useState, useEffect , useContext} from "react";
import { useRouter } from "next/router";
import axios from "axios";
import UserRoute from "../../components/routes/UserRoute";
import { UserContext } from "../../context";
import { toast } from "react-toastify";
import Post from "../../components/cards/Post";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";

const PostComments = () => {


  const [state, setState] = useContext(UserContext);
  // state
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  // posts
  const [posts, setPosts] = useState([]);
  // people
  const [people, setPeople] = useState([]);
  // comments
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  // pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  // route
  const router = useRouter();

  useEffect(() => {
		if (state && state.token) {
			newsFeed();
			findPeople();
		}
  }, [state && state.token, page]);

  useEffect(() => {
		try {
			axios.get("/total-posts").then(({ data }) => setTotalPosts(data));
		} catch (err) {
			console.log(err);
		}
  }, []);

  const newsFeed = async () => {
		try {
			//console.log("NewsFeed : "+page);
			const { data } = await axios.get(`/news-feed/${page}`);
			// console.log("user posts => ", data);
			setPosts(data);
		} catch (err) {
			console.log(err);
		}
  };

  const findPeople = async () => {
		try {
			const { data } = await axios.get("/find-people");
			setPeople(data);
		} catch (err) {
			console.log(err);
		}
  };

  const postSubmit = async (e) => {
		e.preventDefault();
		// console.log("post => ", content);
		try {
			const { data } = await axios.post("/create-post", {
				content,
				image,
			});
			//console.log("create post response => ", data);
			if (data.error) {
				toast.error(data.error);
			} else {
				setPage(1);
				newsFeed();
				toast.success("Post created");
				setContent("");
				setImage({});
				// socket
				socket.emit("new-post", data);
			}
		} catch (err) {
			console.log(err);
		}
  };

  const handleImage = async (e) => {
		const file = e.target.files[0];
		let formData = new FormData();
		formData.append("image", file);
		// console.log([...formData]);
		setUploading(true);
		try {
			const { data } = await axios.post("/upload-image", formData);
			// console.log("uploaded image => ", data);
			setImage({
				url: data.url,
				public_id: data.public_id,
			});
			setUploading(false);
		} catch (err) {
			console.log(err);
			setUploading(false);
		}
  };

  const handleDelete = async (post) => {
		try {
			const answer = window.confirm("Are you sure?");
			if (!answer) return;
			const { data } = await axios.delete(`/delete-post/${post._id}`);
			toast.error("Post deleted");
			newsFeed();
		} catch (err) {
			console.log(err);
		}
  };

  const handleFollow = async (user) => {
		// console.log("add this user to following list ", user);
		try {
			const { data } = await axios.put("/user-follow", { _id: user._id });
			// console.log("handle follow response => ", data);
			// update local storage, update user, keep token
			let auth = JSON.parse(localStorage.getItem("auth"));
			auth.user = data;
			localStorage.setItem("auth", JSON.stringify(auth));
			// update context
			setState({ ...state, user: data });
			// update people state
			let filtered = people.filter((p) => p._id !== user._id);
			setPeople(filtered);
			// rerender the posts in newsfeed
			newsFeed();
			toast.success(`Following ${user.name}`);
		} catch (err) {
			console.log(err);
		}
  };
  const handleUnfollow = async (user) => {
		try {
			const { data } = await axios.put("/user-unfollow", {
				_id: user._id,
			});
			let auth = JSON.parse(localStorage.getItem("auth"));
			auth.user = data;
			localStorage.setItem("auth", JSON.stringify(auth));
			// update context
			setState({ ...state, user: data });
			// update people state
			let filtered = people.filter((p) => p._id !== user._id);
			setPeople(filtered);
			toast.error(`Unfollowed ${user.name}`);
			newsFeed();
		} catch (err) {
			console.log(err);
		}
  };

  const handleLike = async (_id) => {
		// console.log("like this post => ", _id);
		try {
			const { data } = await axios.put("/like-post", { _id });
			// console.log("liked", data);
			newsFeed();
		} catch (err) {
			console.log(err);
		}
  };

  const handleUnlike = async (_id) => {
		// console.log("unlike this post => ", _id);
		try {
			const { data } = await axios.put("/unlike-post", { _id });
			// console.log("unliked", data);
			newsFeed();
		} catch (err) {
			console.log(err);
		}
  };

  const handleComment = (post) => {
		setCurrentPost(post);
		setVisible(true);
  };

  const addComment = async (e) => {
		e.preventDefault();
		// console.log("add comment to this post id", currentPost._id);
		// console.log("save comment to db", comment);
		try {
			const { data } = await axios.put("/add-comment", {
				postId: currentPost._id,
				comment,
			});
			//console.log("add comment", data);
			setComment("");
			setVisible(false);
			newsFeed();
		} catch (err) {
			console.log(err);
		}
  };

  // const removeComment = async (postId, comment) => {
	// 	// console.log(postId, comment);
	// 	let answer = window.confirm("Are you sure want to delete the comment?");

	// 	if (!answer) return;
	// 	try {
	// 		const { data } = await axios.put("/remove-comment", {
	// 			postId,
	// 			comment,
	// 		});
	// 		//console.log("comment removed", data);
	// 		newsFeed();
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
  // };








  const [post, setPost] = useState({});
  // const router = useRouter();
   const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (postId, comment) => {
    // console.log(postId, comment);
    let answer = window.confirm("Are you sure?");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-comment", {
        postId,
        comment,
      });
      console.log("comment removed", data);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  return (
		<div className="container-fluid">
			{/* <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Stay Connected</h1>
        </div>
      </div> */}

			<div className="container col-md-8 offset-md-2 pt-5">
				{/* <Post
					post={post}
					commentsCount={100}
					removeComment={removeComment}
				/> */}
				<Post
					commentsCount={100}
					post={post}
					handleDelete={handleDelete}
					handleLike={handleLike}
					handleUnlike={handleUnlike}
					handleComment={handleComment}
					removeComment={removeComment}
				/>
			</div>

			<Link href="/user/dashboard">
				<a className="d-flex justify-content-center p-5">
					<RollbackOutlined /> Go Back
				</a>
			</Link>
		</div>
  );
};

export default PostComments;
