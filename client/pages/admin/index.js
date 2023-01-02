import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import { useRouter, userRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import renderHTML from "react-render-html";
import Link from "next/link";

const Admin = () => {
  const [state, setState] = useContext(UserContext);
  // posts
  const [posts, setPosts] = useState();
  // users
  const [users, setUsers] = useState();

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
      const { data } = await axios.get(`/total-posts`);
      // console.log("user posts => ", data);

      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };
  const userData = async () => {
    try {
      const { data } = await axios.get(`/admin/total-users`);
      // console.log("user data => ", data);

      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/admin/delete-post/${post._id}`);
      toast.error("Post deleted");
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminRoute>
      <div className="container-fluid">
        {/* <div className="row py-5 text-light bg-default-image">
          <div className="col text-center">
            <h1>ADMIN</h1>
          </div>
        </div> */}
        {/* <pre>{JSON.stringify(posts, null, 4)}</pre>
        <pre>{JSON.stringify(users, null, 4)}</pre> */}
        <div className="row">
          <div className="col-md-6 adminHead align-content-center p-lg-5">
            <Link href={`/admin/posts`} >
              <a>
                Manage all Posts : <br />
                {posts}
              </a>
            </Link>
          </div>
          <div className="col-md-6 adminHead align-content-center p-lg-5">
            <Link href={`/admin/users`}>
              <a>
                Manage all Users : <br />
                {users}
              </a>
            </Link>
          </div>
        </div>

        
      </div>
    </AdminRoute>
  );
};

export default Admin;
