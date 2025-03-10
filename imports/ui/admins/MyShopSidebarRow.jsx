// MyShopSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const MyShopSidebarRow = () => {
  return (
    <aside className="bg-[#414B55] p-6">
      <nav className="flex flex-col gap-y-4">
        <Link
          to="/admins/myshop"
          className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
        >
          마이샵 관리
        </Link>
        <Link
          to="/admins/storeInformation"
          className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
        >
          우리 가게 설명
        </Link>
        <Link
          to="/admins/storeimage"
          className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
        >
          우리 가게 이미지
        </Link>
        <Link
          to="/admins/announcement"
          className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
        >
          우리 가게 공지
        </Link>
        <Link
          to="/admins/product"
          className="text-white font-medium text-sm hover:bg-[#00838C] rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-x-2 "
        >
          우리 가게 상품
        </Link>
      </nav>
    </aside>
  );
};

export default MyShopSidebarRow;
