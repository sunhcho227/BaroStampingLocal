import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default () => {
  const user = Meteor.user();

  // qr 정보
  const qrSize = 160;
  const qrData = JSON.stringify({ type: "user", user_id: user?._id });

  return (
    <div className="qr-img-text-box">
      <div className="qr_img">
        <QRCodeCanvas value={qrData} size={qrSize} />
      </div>
      <div className="text_body_l font_black_light text_align_center">
        카운터에 이 화면을 제시해주세요
      </div>
    </div>
  );
};
