import { useContext, useState, useEffect } from "react";
import { Avatar, List } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";

const Followers = () => {
  const [state, setState] = useContext(UserContext);
  // state
  const [people, setPeople] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) fetchFollowers();
  }, [state && state.token]);

  const fetchFollowers = async () => {
    try {
      const { data } = await axios.get("/user-followers");
    //   console.log("followers => ", data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/people.png";
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
      {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)} />}
              title={
                <div className="d-flex justify-content-between">
                  {user.name}{" "}
                  {/* <span
                    onClick={() => handleUnfollow(user)}
                    className="text-primary pointer"
                  >
                    Unfollow
                  </span> */}
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Link href="/user/dashboard">
        <a className="d-flex justify-content-center pt-5">
          <div className="col">
            <div className="row">
              <RollbackOutlined />
            </div>
            <div className="row justify-content-center">Go Back</div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default Followers;
