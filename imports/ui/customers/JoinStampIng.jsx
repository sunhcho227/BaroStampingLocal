import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import Loading from "../Loading.jsx";

const JoinStampIng = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    try {
      // QR에서 데이터 parsing
      const queryParams = new URLSearchParams(location.search);
      const data = queryParams.get("data");

      if (!data) {
        console.error("데이터가 전달되지 않았습니다.");
        return;
      }

      const { storeId, stampCount, paymentId } = JSON.parse(
        decodeURIComponent(data)
      );
      console.log("paymentId", paymentId);

      // user 확인
      let currentUsername = Meteor.user()?.username;
      if (!currentUsername) {
        currentUsername = "Guest_" + Random.id();
      }
      setUsername(currentUsername);

      if (paymentId) {
        console.log("paymentId 로직 안", paymentId);
        console.log("currentUsername 로직 안", currentUsername);

        Meteor.call(
          "updatePayment",
          paymentId,
          currentUsername,
          (error, result) => {
            if (error) {
              console.log("에러1", paymentId);
              console.log("에러2", currentUsername);
              console.error("결제 업데이트 실패:", error.reason);
            } else {
              console.log("result1", paymentId);
              console.log("result2", currentUsername);
              console.log("결제 업데이트 성공:", result);
            }
          }
        );
      }

      // 가게 QR을 통해 user의 stamp 적립
      Meteor.call(
        "addStampsbyQR",
        storeId,
        stampCount,
        currentUsername,
        (error, result) => {
          if (error) {
            console.error("스탬프 적립 실패:", error);
          } else {
            console.log(result);

            // 로그인 처리
            if (!Meteor.user()) {
              Meteor.loginWithPassword(currentUsername, "1234", (err) => {
                if (err) {
                  console.error("자동 로그인 실패:", err.reason);
                } else {
                  console.log("로그인 성공");
                  navigate("/customers");
                }
              });
            } else {
              navigate("/customers");
            }
          }
        }
      );
    } catch (error) {
      console.error("데이터 처리 중 오류 발생:", error.reason);
    }
  }, []);

  return <Loading />;
};

export default JoinStampIng;
