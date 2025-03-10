import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Admins, Stores, Payments, Orders } from "/imports/api/collections";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal.jsx";

const Nav = () => {
  const user = Meteor.user();
  const admin = user && Admins.findOne({ user_id: user._id });
  const store = admin && Stores.findOne({ _id: admin.store_id });
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const payments = useTracker(() => {
    if (!store) return [];
    return Payments.find({ store_id: store._id, status: "대기" }).fetch();
  });

  useEffect(() => {
    if (payments.length > 0) {
      const storedPayments = localStorage.getItem("informedPayments");
      const informedPayments = storedPayments ? JSON.parse(storedPayments) : [];

      const newPayments = payments.filter(
        (payment) => !informedPayments.includes(payment._id)
      );

      if (newPayments.length > 0) {
        setMessage("새로운 주문이 들어왔습니다");
        setIsModalOpen(true);

        const updatedPayments = [
          ...informedPayments,
          ...newPayments.map((payment) => payment._id),
        ];
        localStorage.setItem(
          "informedPayments",
          JSON.stringify(updatedPayments)
        );
      }
    }
  }, [payments]);

  const handleLogout = () => {
    Meteor.logout(() => {
      navigate("/");
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/admins/shopOrders");
  };

  return (
    <div>
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                {/* 왼쪽 - 로고 */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 hidden lg:block">
                    <img
                      src="/icons/baro_logo.svg"
                      alt="Logo"
                      className="h-6 w-auto"
                    />
                  </div>
                </div>

                {/* 모바일 메뉴 버튼 */}
                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00838C]">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>

                {/* 중앙 - 네비게이션 링크 (데스크탑 전용) */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
                  <div className="flex space-x-8 h-16">
                    <NavLink to="/admins" label="가게홈" />
                    <NavLink to="/admins/StampCoupon" label="스탬프 쿠폰" />
                    <NavLink to="/admins/myshop" label="마이샵" />
                    <NavLink to="/admins/POS" label="POS" />
                    <NavLink to="/admins/shopOrders" label="주문목록" />
                    <NavLink to="/admins/usersearch" label="회원 정보 조회" />
                    <NavLink
                      to="/admins/storeallreview"
                      label="스마트 AI 리뷰"
                      icon="/icons/ai-brain.svg"
                    />
                  </div>
                </div>

                {/* 오른쪽 - 알림 및 프로필 드롭다운 */}
                <div className="flex items-center">
                  {/* <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00838C]">
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="flex rounded-full bg-white text-sm">
                      <p className="text-sm text-[#00A9B5] hover:underline">
                        {store.storeName}님 환영합니다.
                      </p>
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-[#00838C]">
                      <MenuItem>
                        <Link
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </Link>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>

            {/* 모바일 네비게이션 메뉴 */}
            <DisclosurePanel className="lg:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                <MobileNavLink to="/admins" label="가게홈" />
                <MobileNavLink to="/admins/StampCoupon" label="스탬프 쿠폰" />
                <MobileNavLink to="/admins/myshop" label="마이샵" />
                <MobileNavLink to="/admins/POS" label="POS" />
                <MobileNavLink to="/admins/shopOrders" label="주문목록" />
                <MobileNavLink to="/admins/usersearch" label="회원 정보 조회" />
                <MobileNavLink
                  to="/admins/storeallreview"
                  label="스마트 AI 리뷰"
                />
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
      <Modal isOpen={isModalOpen} message={message} onClose={closeModal} />
    </div>
  );
};

// 데스크탑 네비게이션 링크 컴포넌트
function NavLink({ to, label, icon }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-[#00838C] border-b-2 border-transparent"
    >
      {icon && <img src={icon} alt="" className="h-5 w-5 mr-1" />}
      {label}
    </Link>
  );
}

// 모바일 네비게이션 링크 컴포넌트
function MobileNavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {label}
    </Link>
  );
}

export default Nav;
