import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import ParallaxBG from "../components/cards/ParallaxBG";
import axios from "axios";
import PostPublic from "../components/cards/PostPublic";
import Head from "next/head";
import Link from "next/link";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

const Home = ({ posts }) => {
  const [state, setState] = useContext(UserContext);

  const [newsFeed, setNewsFeed] = useState([]);

  // useEffect(() => {
  //   // console.log("SOCKETIO ON JOIN", socket);
  //   socket.on("receive-message", (newMessage) => {
  //     alert(newMessage);
  //   });
  // }, []);

  useEffect(() => {
    socket.on("new-post", (newPost) => {
      setNewsFeed([newPost, ...posts]);
    });
  }, []);

  const head = () => (
    <Head>
      <title>StayConnected - A social network by devs for devs</title>
      <meta
        name="description"
        content="A social network by developers for other web developers"
      />
      <meta
        property="og:description"
        content="A social network by developers for other web developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="stayConnected" />
      <meta property="og:url" content="http://stayconnected.com" />
      <meta
        property="og:image:secure_url"
        content="http://stayconnected.com/images/default.jpg"
      />
    </Head>
  );

  const collection = newsFeed.length > 0 ? newsFeed : posts;

  return (
    <>
      {head()}
      {/* <ParallaxBG url="/images/default.jpg" /> */}

      <div className="container ">
        {/* <button
          onClick={() => {
            socket.emit("send-message", "This is abhilash!!!");
          }}
        >
          Send message
        </button> */}
        <div className="row " style={{ paddingTop:"150px"}}>
          {collection.length == 0 ? (
            <h3 style={({ fontFamily: "Times New Roman" }, { color: "red" }, {textAlign:"center"})}>
              No posts to show
            </h3>
          ) : (
            collection.map((post) => (
              <div key={post._id} className="col-md-4">
                <Link href={`/post/view/${post._id}`}  >
                  <a >
                    <PostPublic key={post._id} post={post} />
                  </a>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get("/posts");
  // console.log(data);
  return {
    props: {
      posts: data,
    },
  };
}

export default Home;
