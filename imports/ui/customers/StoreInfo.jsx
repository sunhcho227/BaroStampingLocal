import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Stores, StoreAnnouncements, Admins } from "/imports/api/collections";
import Header from "/imports/ui/customers/Header.jsx";
import KakaoMap from "/imports/ui/KakaoMap";

export default () => {
  const { storeUrlName } = useParams();
  const store = Stores.findOne({ storeUrlName });
  const user = useTracker(() => Meteor.user(), []);

  // useTracker 선언
  useTracker(() => {
    Admins.find().fetch();
    Stores.find().fetch();
    StoreAnnouncements.find().fetch();
  });

  // 지도에 사용될 좌표 설정
  // const defaultLat = 37.539449;
  // const defaultLng = 127.066732;
  // const mapCenter = {
  //   lat: store?.storeLatitude || defaultLat,
  //   lng: store?.storeLongitude || defaultLng,
  // };

  // 지도 컴포넌트
  // const KakaoMap = () => (
  //   <Map center={mapCenter} style={{ width: "100%", height: "100%" }} level={3}>
  //     <MapMarker position={mapCenter}>
  //       <div>{store ? store.storeName : "여기입니다!"}</div>
  //     </MapMarker>
  //   </Map>
  // );

  return (
    <div>
      <div className="announcement-section">
        {/* Store Information */}
        <div className="coupon-store-info">
          <div className="text_title_m">{store.storeName}</div>
          <div className="text_body_l">{store.storeInformation}</div>
          <div className="text_body_m">
            전화번호 : {store.storePhoneNumber}
            <br />
            주소 : {store.storeAddress}
          </div>
          <div className="coupon-store-map-placeholder">
            <KakaoMap
              center={{ lat: store?.storeLatitude, lng: store?.storeLongitude }}
              markerText={store ? store.storeName : "여기입니다!"}
            />
          </div>
        </div>
        <div className="divider-sc"></div>
        <div className="text_title_m primary">공지사항</div>

        {StoreAnnouncements.find({ store_id: store._id })
          .fetch()
          .map((announcement) => (
            <div className="announcement-list" key={announcement._id}>
              <div className="announcement-item">
                <div className="announcement-title">
                  <div className="text_title_xs">{announcement.title}</div>
                  <div className="text_body_xs">
                    {announcement.createdAt.toLocaleDateString().slice(0, -1)}
                  </div>
                </div>
                <div className="text_body_s">
                  {announcement.contents}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
