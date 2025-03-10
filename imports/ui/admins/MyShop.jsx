import React, { useState, useRef, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import Nav from "./Nav.jsx";
import {
  Admins,
  AIprompts,
  Stores,
  Products,
  StoreAnnouncements,
} from "/imports/api/collections";
import Modal from "../Modal.jsx";
import { Link } from "react-router-dom";
import StoreImageCollection from "./StoreImageCollection.jsx";
import {
  Bars3Icon,
  MinusSmallIcon,
  PlusSmallIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import MyShopSidebar from "./MyShopSidebar.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import MyShopSidebarRow from "./MyShopSidebarRow.jsx";
import Loading from "../Loading.jsx";

const MyShop = () => {
  const { user, admin, store, products, storeId } = useTracker(() => {
    const user = Meteor.user();
    const admin = user && Admins.findOne({ user_id: user._id });
    const store = admin && Stores.findOne({ _id: admin.store_id });
    const storeId = store._id;
    const products = Products.find({ store_id: admin.store_id }).fetch();
    return { user, admin, store, products, storeId };
  }, []);

  const [maxStamp, setMaxStamp] = useState(store?.maxStamp || 1);
  const [couponInformation, setCouponInformation] = useState(
    store?.couponInformation || "현재 보상 없음"
  );
  const [editingField, setEditingField] = useState(null); // 수정 중인 필드 ('category' 또는 'product')
  const [currentValue, setCurrentValue] = useState("");
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [blobInfo, setBlobInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  const productNameRef = useRef(null);
  const productPriceRef = useRef(null);

  // AI프롬프트 수정
  // 해당 storeId에 맞는 프롬프트 가져오기
  const prompt = AIprompts.findOne({ store_id: storeId });

  // 수정 버튼 클릭 시 호출
  const handleEditClick = (field, value) => {
    setEditingField(field);
    setCurrentValue(value);
  };

  // 저장 버튼 클릭 시 호출
  const handleSaveClick = () => {
    if (!prompt || currentValue.trim() === "") return;

    const methodName =
      editingField === "category"
        ? "aiprompts.updateCategoryByStoreId"
        : "aiprompts.updateProductByStoreId";

    Meteor.call(methodName, storeId, currentValue, (err) => {
      if (err) {
        console.error(`Error updating ${editingField}:`, err);
      } else {
        setEditingField(null);
        setCurrentValue("");
      }
    });
  };

  // 취소 버튼 클릭 시 호출
  const handleCancelClick = () => {
    setEditingField(null);
    setCurrentValue("");
  };

  // 리워드 수정
  const handleCouponInformationChange = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    if (couponInformation !== store?.couponInformation) {
      Meteor.call(
        "couponInformation.update",
        store._id,
        couponInformation, // 공백만 입력된 경우를 방지
        (error) => {
          if (error) {
            console.error("Error updating nickname:", error);
          } else {
            setIsEditing(false);
          }
        }
      );
    } else {
      setIsEditing(false);
    }
  };

  // 리워드 수정 취소
  const handleCouponInformationCancle = () => {
    setIsEditing(false);
  };



  // 최대 스탬프 갯수 수정
  const handleUpdate = () => {
    if (store) {
      Stores.update(store._id, { $set: { maxStamp } });
      setModalMessage("최대 스탬프 갯수가 수정되었습니다!");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const increment = () => setMaxStamp((prev) => prev + 1);
  const decrement = () => setMaxStamp((prev) => (prev > 1 ? prev - 1 : 1));

  const handleProductAdd = (e) => {
    e.preventDefault();

    const productName = productNameRef.current.value;
    const productPrice = Number(productPriceRef.current.value);

    if (!productName || productPrice <= 0) {
      alert("상품명과 가격을 올바르게 입력하세요.");
      return;
    }

    // Meteor 메서드 호출
    Meteor.call(
      "addProducts",
      admin.store_id,
      productName,
      productPrice,
      (err) => {
        if (err) {
          console.error("새 상품 삽입 도중 에러 발생: ", err.reason);
        } else {
          alert("상품이 성공적으로 추가되었습니다!");
          productNameRef.current.value = "";
          productPriceRef.current.value = "";
        }
      }
    );
  };

  const handleProductRemove = (product_id) => {
    Meteor.call("removeProducts", product_id, (err, result) => {
      if (err) {
        console.error("상품을 지우는 도중 에러 발생: ", err.reason);
      } else {
        alert("상품이 성공적으로 삭제되었습니다!", result);
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Nav />
      <div className="w-full mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:min-h-screen">
          {/* 마이샵사이드바 */}
          {isMobile ? <MyShopSidebarRow /> : <MyShopSidebar />}

          {/* 페이지 본문 */}
          <div className="flex-1 p-6 bg-gray-100">
            {/* 헤드섹션 */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              마이샵 관리
            </h1>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              목표 스탬프와 AI프롬프트를 변경할 수 있습니다. 가게의 주요 정보를
              한번에 확인 할 수 있습니다.
            </p>

            {/* 상단 설정 3section */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* 스탬프 설정 섹션 */}
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-1 text-center">
                  목표 스탬프 수정
                </h2>
                <div className="flex text-center text-center justify-center items-center gap-4 mb-4 mt-4">
                  <button
                    onClick={decrement}
                    className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    value={maxStamp}
                    onChange={(e) =>
                      setMaxStamp(Math.max(Number(e.target.value), 1))
                    }
                    min="1"
                    className="h-10 w-20 text-center items-center rounded-md border border-gray-300 bg-white text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00838C]"
                  />
                  <button
                    onClick={increment}
                    className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <button
                  onClick={handleUpdate}
                  className="w-full bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
                >
                  스탬프 목표갯수 수정하기
                </button>
              </div>

              {/* 스탬프 달성 보상 설정 */}
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-3 text-center">
                  스탬프 달성 보상
                </h2>
                <p className="bg-gray-100 text-gray-600 mb-4 px-4 py-2 rounded-md text-center">
                  {store.couponInformation}
                </p>
                {isEditing ? (
                  <form onSubmit={handleCouponInformationChange}>
                    <div>
                      <div>
                        <input
                          type="text"
                          value={couponInformation}
                          onChange={(e) => setCouponInformation(e.target.value)}
                          placeholder="리워드보상을 입력해주세요"
                          required // 필수 입력 처리
                          minLength={1} // 최소 1자 입력
                          className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm"
                        />
                      </div>
                      <div className="flex flex-row gap-2 justify-end">
                        <div>
                          <button
                            type="button"
                            onClick={handleCouponInformationCancle}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            취소
                          </button>
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#00838C] hover:bg-[#006d75]"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setCouponInformation(store?.couponInformation || "");
                      }}
                      className="w-full bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
                    >
                      리워드 보상 수정
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI 프롬프트 관리 */}
            <div className="w-full bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-1">AI프롬프트 관리</h2>
              <div className="text-sm text-gray-500 mb-1">
                고객님이 가게 방문 데이터를 가지고 AI이미지를 작성 할수 있게
                이미지 프롬프트를 입력해주세요
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-[#00A9B5]">Tip</span> 영어로
                작성해주시면 정확도가 더 올라갑니다
              </div>

              <div className="flex flex-col md:flex-row gap-3 bg-white">
                {prompt ? (
                  <>
                    {/* Category Section */}
                    <div className="w-full md:w-1/2 mb-3 mt-3 flex flex-col">
                      {/* sub title _ description */}
                      <div className="flex flex-col">
                        <div className="font-semibold mb-1">어디서?</div>
                        <div className="text-sm text-gray-500 mb-2">
                          예 : 세련된 도시의 카페에서, In a stylish café in the
                          city
                        </div>
                      </div>

                      {editingField === "category" ? (
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm"
                          />
                          <div className="flex flex-row gap-3">
                            <button
                              onClick={handleCancelClick}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              취소
                            </button>
                            <button
                              onClick={handleSaveClick}
                              className="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#00838C] hover:bg-[#006d75]"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-gray-100 text-gray-600 mb-3 px-4 py-2 rounded-md">
                            {prompt.category}
                          </div>
                          <button
                            onClick={() =>
                              handleEditClick("category", prompt.category)
                            }
                            className="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#00838C] hover:bg-[#006d75]"
                          >
                            수정하기
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Product Section */}
                    <div className="w-full md:w-1/2 mb-3 mt-3 flex flex-col">
                      {/* sub title _ description */}
                      <div className="flex flex-col">
                        <div className="font-semibold mb-1">무엇을?</div>
                        <div className="text-sm text-gray-500 mb-2">
                          예 : 카페라떼를 마시는, Drinking a café latte
                        </div>
                      </div>
                      {editingField === "product" ? (
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm"
                          />
                          <div className="flex flex-row gap-3">
                            <button
                              onClick={handleCancelClick}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              취소
                            </button>
                            <button
                              onClick={handleSaveClick}
                              className="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#00838C] hover:bg-[#006d75]"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-gray-100 text-gray-600 mb-3 px-4 py-2 rounded-md">
                            {prompt.product}
                          </div>
                          <button
                            onClick={() =>
                              handleEditClick("product", prompt.product)
                            }
                            className="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#00838C] hover:bg-[#006d75]"
                          >
                            수정하기
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p>해당 가게에 대한 프롬프트가 없습니다.</p>
                )}
              </div>
            </div>

            {/* 가게 정보 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-1">
                {
                  Stores.findOne({
                    _id: Admins.findOne({ user_id: user._id }).store_id,
                  }).storeName
                }
              </h2>
              <div className="text-sm text-gray-500 mb-2">
                가게에 대한 정보를 수정할 수 있습니다. 변경 후 저장 버튼을
                눌러주세요.
              </div>
              <p className="bg-gray-100 text-gray-600 mb-4 px-4 py-2 rounded-md">
                {
                  Stores.findOne({
                    _id: Admins.findOne({ user_id: user._id }).store_id,
                  }).storeInformation
                }
              </p>
              <Link to="/admins/storeinformation">
                <button className="w-full md:w-auto bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors">
                  가게 설명 수정하기
                </button>
              </Link>
            </div>

            {/* 가게 이미지 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-1">가게 이미지</h3>
              <div>
                <div className="text-sm text-gray-500 mb-4">
                  메인 이미지와 서브 이미지를 등록하거나 수정할 수 있습니다.
                  이미지를 선택한 후 저장 버튼을 눌러주세요
                </div>
                <div className="bg-gray-100 text-gray-600 mb-4 px-4 py-2 rounded-md">
                  <StoreImageCollection />
                </div>
              </div>
              <Link to="/admins/storeimage">
                <button className="w-full md:w-auto bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors">
                  가게 이미지 수정하기
                </button>
              </Link>
            </div>

            {/* 공지사항 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-1">공지사항 목록</h3>
              <div className="text-sm text-gray-500 mb-4">
                이벤트, 휴무일, 새로운 소식을 입력할 수 있습니다. 제목과 내용을
                작성한 후 등록 버튼을 눌러주세요
              </div>
              <div className="bg-gray-100 text-gray-600 mb-4 px-4 py-4 rounded-md">
                <ul className="space-y-4 mb-4">
                  {StoreAnnouncements.find({
                    store_id: Admins.findOne({ user_id: user._id }).store_id,
                  })
                    .fetch()
                    .map((announcement) => (
                      <li
                        key={announcement._id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex flex-col gap-y-2">
                          <h4 className="text-lg font-semibold">
                            {announcement.title}
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {announcement.contents}
                          </p>
                          <div className="text-sm text-gray-500 self-end">
                            {announcement.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

              <Link to="/admins/announcement">
                <button className="w-full md:w-auto bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors">
                  공지사항 작성하기
                </button>
              </Link>
            </div>

            {/* 상품등록 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-1">상품등록 하기</h3>
              <div className="text-sm text-gray-500 mb-4">
                가게에서 판매할 상품을 등록할 수 있습니다. 상품명과 가격을
                입력한 후 등록 버튼을 눌러주세요.
              </div>
              <Link to="/admins/product">
                <button className="w-full md:w-auto bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors">
                  상품 등록하기
                </button>
              </Link>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          message={modalMessage}
          onClose={closeModal}
        />
      </div>
    </>
  );
};

export default MyShop;
