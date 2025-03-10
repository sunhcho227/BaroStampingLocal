import { Meteor } from "meteor/meteor";
import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { QRCodeCanvas } from "qrcode.react";
import { Admins, Stores, StoreAnnouncements } from "/imports/api/collections";
import Nav from "./Nav.jsx";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import {
  Bars3Icon,
  MinusSmallIcon,
  PlusSmallIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StampControl = ({ stampCount, handleIncrement, handleDecrement }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={handleDecrement}
      className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
    >
      <i className="fas fa-minus"></i>
    </button>
    <input
      type="number"
      value={stampCount}
      readOnly
      className="h-10 w-20 text-center items-center rounded-md border border-gray-300 bg-white text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00838C]"
    />
    <button
      onClick={handleIncrement}
      className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
    >
      <i className="fas fa-plus"></i>
    </button>
  </div>
);

const qr = {
  list: [
    {
      name: "스탬프 지급",
    },
    {
      name: "가게 QR",
    },
  ],
};

export default () => {
  const [stampCount, setStampCount] = useState(1);
  const [frequency, setFrequency] = useState(qr.list[0]);

  const { adminRecord, storeRecord, announcementRecords } = useTracker(() => {
    const user = Meteor.user();
    if (!user)
      return {
        adminRecord: null,
        storeRecord: null,
        announcementRecords: [],
      };

    const adminRecord = Admins.findOne({ user_id: user._id });
    if (!adminRecord)
      return { adminRecord: null, storeRecord: null, announcementRecords: [] };

    const storeRecord = Stores.findOne({ _id: adminRecord.store_id });
    const announcementRecords = StoreAnnouncements.find({
      store_id: adminRecord.store_id,
    }).fetch();

    return { adminRecord, storeRecord, announcementRecords };
  });

  const handleIncrement = () => setStampCount((prev) => prev + 1);
  const handleDecrement = () =>
    setStampCount((prev) => (prev > 1 ? prev - 1 : 1));

  // qr 정보
  const qrSize = 160;
  const stampQR = JSON.stringify({
    type: "getStamp",
    storeId: storeRecord ? storeRecord._id : null,
    stampCount: stampCount,
  });

  // client private IP
  // const [clientIp, setClientIp] = useState(null);

  // useEffect(() => {
  //   Meteor.call("getWiFiIP", (error, result) => {
  //     if (error) {
  //       console.error("IP 가져오기 오류:", error);
  //     } else {
  //       setClientIp(result);
  //     }
  //   });
  // }, []);

  const stampUrl = `http://bstamp.shop/customers/joinStampIng?data=${encodeURIComponent(
    stampQR
  )}`;

  const orderQR = JSON.stringify({
    type: "order",
    storeUrlName: storeRecord ? storeRecord.storeUrlName : null,
  });

  const orderUrl = `http://bstamp.shop/customers/order?data=${encodeURIComponent(
    orderQR
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {adminRecord ? (
          <>
            {storeRecord ? (
              <div className="bg-white p-10">
                <div className="flex justify-center">
                  <fieldset aria-label="Payment frequency">
                    <RadioGroup
                      value={frequency}
                      onChange={setFrequency}
                      className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-l/5 font-semibold ring-1 ring-inset ring-gray-200"
                    >
                      {qr.list.map((option) => (
                        <Radio
                          key={option.name}
                          value={option}
                          className="w-[140px] cursor-pointer rounded-full px-2.5 py-2 text-gray-500 data-[checked]:bg-[#00838C] data-[checked]:text-white"
                        >
                          {option.name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>
                <div className="my-8 mx-auto max-w-md text-center">
                  {frequency === qr.list[0] && (
                    <div>
                      <div className="flex justify-center items-center mb-4 p-8 bg-white">
                        <QRCodeCanvas value={stampUrl} size={qrSize} />
                      </div>

                      <div className="my-6">
                        회원고객이 스캔 시 스탬프가 적립됩니다. <br />
                        지급 스탬프 개수에 따라 QR이 변경됩니다.
                      </div>

                      <div>
                        <p className="mb-2">지급할 스탬프</p>
                        <div className="flex justify-center">
                          <StampControl
                            stampCount={stampCount}
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {frequency === qr.list[1] && (
                    <div>
                      <div className="flex justify-center items-center mb-4 p-8 bg-white">
                        <QRCodeCanvas value={orderUrl} size={qrSize} />
                      </div>

                      <div className="mt-6">가게 주문용 고정 QR</div>
                    </div>
                  )}
                  {/* 필요 시 더 많은 조건을 추가 */}
                </div>
              </div>
            ) : (
              <p>가게 정보를 찾을 수 없습니다.</p>
            )}
          </>
        ) : (
          <p>로그인하지 않았습니다.</p>
        )}
      </div>
    </div>
  );
};
