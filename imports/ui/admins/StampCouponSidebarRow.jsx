import React from "react";
import { Link } from "react-router-dom";

const StampCouponSidebarRow = () => {
  return (
    <>
      <aside className="bg-[#414B55] p-6">
        <nav className="flex flex-col gap-y-4">
          <Link
            to="/admins/StampCoupon"
            className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
          >
            <div>스탬프/쿠폰 발급</div>
          </Link>
          <Link
            to="/readerAdmin"
            state={{ type: "stampplus" }}
            className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
          >
            <div>스탬프 QR 발급</div>
          </Link>
          <Link
            to="/readerAdmin"
            state={{ type: "serviceCouponPlus" }}
            className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
          >
            <div>쿠폰 QR 발급</div>
          </Link>
          <Link
            to="/readerAdmin"
            state={{ type: "couponuse" }}
            className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
          >
            <div>쿠폰 QR 사용</div>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default StampCouponSidebarRow;
