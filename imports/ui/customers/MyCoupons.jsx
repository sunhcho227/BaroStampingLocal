import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Coupons, Stores, Stamps } from "/imports/api/collections";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import CouponsAvailable from "/imports/ui/customers/CouponsAvailable.jsx";
import CouponsUsed from "/imports/ui/customers/CouponsUsed.jsx";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = useTracker(() => Meteor.user(), []);

  // useTracker 선언
  useTracker(() => {
    Stamps.find().fetch();
    Stores.find().fetch();
    Coupons.find().fetch();
  });

  const [unusedDisplayCount, setUnusedDisplayCount] = useState(5);
  const [usedDisplayCount, setUsedDisplayCount] = useState(5);

  const handleLoadMoreUnused = () => {
    setUnusedDisplayCount(unusedDisplayCount + 3);
  };

  const handleLoadMoreUsed = () => {
    setUsedDisplayCount(usedDisplayCount + 3);
  };

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState("available"); // 기본 탭: 사용 가능

  const pageTitle = "마이 쿠폰";
  document.title = `Stamping - ${pageTitle}`;
  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />

      <div className="coupon-page-container mycoupons">
        <div className="coupon-navigation">
          <div
            className={`nav-item ${activeTab === "available" ? "active" : ""}`}
            onClick={() => setActiveTab("available")}
          >
            <div className="text_title_m">
              사용 가능{" "}
              <span className="text_title_m primary">
                {" "}
                {
                  Coupons.find({
                    couponUsage: false,
                    user_id: user._id,
                  }).fetch().length
                }
              </span>
              개
            </div>
          </div>

          <div
            className={`nav-item ${activeTab === "used" ? "active" : ""}`}
            onClick={() => setActiveTab("used")}
            // disabled={activeTab === "used"}
          >
            <div className="text_title_m">
              사용 불가{" "}
              <span className="text_title_m primary">
                {" "}
                {
                  Coupons.find({ couponUsage: true, user_id: user._id }).fetch()
                    .length
                }
              </span>
              개
            </div>
          </div>
        </div>

        {/* 탭 내용 */}
        {activeTab === "available" && (
          <div>
            <CouponsAvailable
              unusedDisplayCount={unusedDisplayCount}
              handleLoadMoreUnused={handleLoadMoreUnused}
              user={user}
            />
          </div>
        )}

        {activeTab === "used" && (
          <div>
            <CouponsUsed
              usedDisplayCount={usedDisplayCount}
              handleLoadMoreUsed={handleLoadMoreUsed}
              user={user}
            />
          </div>
        )}
      </div>
    </>
  );
};
