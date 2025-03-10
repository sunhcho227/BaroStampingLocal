import React, { useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate } from "react-router-dom";
import { Admins } from "/imports/api/collections";

export default () => {
  const navigate = useNavigate();

  const usernameRef = useRef("");
  const passwordRef = useRef("");

  const { user, isAdmin } = useTracker(() => {
    const user = Meteor.user();
    const isAdmin = user ? !!Admins.findOne({ user_id: user._id }) : false;
    return { user, isAdmin };
  });

  const handleLogout = () => {
    Meteor.logout(() => {
      navigate("/");
    });
  };

  const handleLogin = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    Meteor.loginWithPassword(username, password, (err, rslt) => {
      if (err) {
        return alert(err.reason);
      }
      else console.log("로그인 성공!", rslt);
    });
  };

  return (
    <>
      <header className="main-nav-container">
        <nav>
          <ul>
            <li>
              {user ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <div>
                  <input
                    id="username"
                    ref={usernameRef}
                    type="text"
                    placeholder="username"
                  />
                  <input
                    id="password"
                    ref={passwordRef}
                    type="password"
                    placeholder="password"
                  />
                  <button onClick={handleLogin}>Login</button>
                </div>
              )}
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              {isAdmin ? (
                <div>
                  <Link to="/admins">Admin Page</Link>
                </div>
              ) : (
                <Link to="/customers">Customer Page</Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};
