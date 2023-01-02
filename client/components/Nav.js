import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import { Avatar } from "antd";
import { imageSource } from "../functions";

const Nav = () => {
  const [current, setCurrent] = useState("");
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary d-flex justify-content-between px-3"
      style={{}}
    >
      <Link href="/">
        <a className={`navbar-brand logo ${current === "/" && "active"}`}>
          <Avatar src="/images/logo.png" />
          StayConnected
        </a>
      </Link>

      {state !== null ? (
        <>
          <div className="nav-item dropdown d-flex ">
            <Avatar size={40} src={imageSource(state.user)} />
            <h5 className="text-white pt-1 px-2">
              {state && state.user && state.user.name}
            </h5>
            <a
              className="btn dropdown-toggle text-light "
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></a>
            <ul
              className="dropdown-menu px-2"
              aria-labelledby="dropdownMenuLink"
            >
              <li>
                <Link href="/user/dashboard">
                  <a
                    className={`nav-link dropdown-item ${
                      current === "/user/dashboard" && "active"
                    }`}
                  >
                    Dashboard
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/user/profile/update">
                  <a
                    className={`nav-link dropdown-item ${
                      current === "/user/profile/update" && "active"
                    }`}
                  >
                    Profile
                  </a>
                </Link>
              </li>

              {state.user && state.user.role === "Admin" && (
                <li>
                  <Link href="/admin">
                    <a
                      className={`nav-link dropdown-item ${
                        current === "/admin" && "active"
                      }`}
                    >
                      Admin
                    </a>
                  </Link>
                </li>
              )}

              <li>
                <a
                  onClick={logout}
                  className={`nav-link dropdown-item ${
                    current === "/logout" && "active"
                  }`}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="nav-item pt-2">
            <Link href="/login">
              <a
                className={`nav-link text-light ${
                  current === "/login" && "active"
                }`}
              >
                <h5 className="text-white">Login</h5>
              </a>
            </Link>
          </div>
          <div className="nav-item pt-2">
            <Link href="/register">
              <a
                className={`nav-link text-light ${
                  current === "/register" && "active"
                }`}
              >
                <h5 className="text-white">Register</h5>
              </a>
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Nav;
