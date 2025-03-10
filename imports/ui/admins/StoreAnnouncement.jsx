// StoreAnnouncement.jsx
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Admins, StoreAnnouncements, Stores } from "/imports/api/collections";
import Modal from "../Modal.jsx";
import Nav from "./Nav.jsx";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import MyShopSidebar from "./MyShopSidebar.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import MyShopSidebarRow from "./MyShopSidebarRow.jsx";

export default () => {
  const user = useTracker(() => Meteor.user(), []);
  useTracker(() => {
    Admins.find().fetch();
    Stores.find().fetch();
    StoreAnnouncements.find().fetch();
  });

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContents, setEditContents] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !contents) {
      alert("제목과 내용을 모두 입력해주세요");
      return;
    }

    Meteor.call(
      "storeAnnouncements.insert",
      Admins.findOne({ user_id: user._id }).store_id,
      title,
      contents,
      (error) => {
        if (error) {
          setMessage("공지사항 작성 중 오류가 발생했습니다. " + error.reason);
        } else {
          setMessage("공지사항 작성이 성공적으로 저장되었습니다. ");
          setTitle("");
          setContents("");
        }
        setIsModalOpen(true);
      }
    );
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    const selectedAnnouncement = StoreAnnouncements.find(
      (ann) => ann._id === id
    );
    setEditTitle(selectedAnnouncement.title);
    setEditContents(selectedAnnouncement.contents);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!editTitle || !editContents) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    Meteor.call(
      "storeAnnouncements.update",
      selectedId,
      editTitle,
      editContents,
      (error) => {
        if (error) {
          setMessage("공지사항 수정 중 오류가 발생했습니다: " + error.reason);
        } else {
          setMessage("공지사항이 성공적으로 수정되었습니다.");
          setSelectedId(null);
          setEditTitle("");
          setEditContents("");
        }
        setIsModalOpen(true);
      }
    );
  };

  const handleRemove = (selectedId) => {
    Meteor.call("storeAnnouncements.remove", selectedId, (error) => {
      if (error) {
        setMessage("공지사항 삭제 중 오류가 발생했습니다. " + error.reason);
      } else {
        setMessage("공지사항이 성공적으로 삭제되었습니다.");
      }
      setIsModalOpen(true);
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Nav />

      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:min-h-screen">
          {/* 마이샵사이드바 */}
          {isMobile ? <MyShopSidebarRow /> : <MyShopSidebar />}
          {/* 페이지 본문 */}
          <div className="flex-1 p-6 bg-gray-100">
            {/* 헤드섹션 */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              공지사항 목록
            </h1>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              공지사항을 작성하거나 수정하고 필요하지 않은 공지사항은 삭제할 수
              있습니다.
            </p>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* 공지사항 작성 섹션 */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  신규 공지사항 작성
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      제목
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700"
                    >
                      내용
                    </label>
                    <textarea
                      id="content"
                      value={contents}
                      onChange={(e) => setContents(e.target.value)}
                      rows="4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
                    >
                      <PlusCircleIcon className="h-5 w-5 mr-2" />
                      저장하기
                    </button>
                  </div>
                </form>
              </div>

              <hr className="my-8 border-t border-gray-300" />

              {/* 공지사항 목록 섹션 */}
              <div className="space-y-6 mb-6">
                {StoreAnnouncements.find(
                  { store_id: Admins.findOne({ user_id: user._id }).store_id },
                  { sort: { createdAt: -1 } }
                )
                  .fetch()
                  .map((announcement) => (
                    <div
                      key={announcement._id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      {selectedId === announcement._id ? (
                        // 수정 폼
                        <form onSubmit={handleSubmitEdit} className="space-y-4">
                          <div>
                            <label
                              htmlFor="edit-title"
                              className="block text-sm font-medium text-gray-700"
                            >
                              제목
                            </label>
                            <input
                              type="text"
                              id="edit-title"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="edit-content"
                              className="block text-sm font-medium text-gray-700"
                            >
                              내용
                            </label>
                            <textarea
                              id="edit-content"
                              value={editContents}
                              onChange={(e) => setEditContents(e.target.value)}
                              rows="4"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setSelectedId(null)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#00838C] hover:bg-[#006d75]"
                            >
                              수정완료
                            </button>
                          </div>
                        </form>
                      ) : (
                        // 공지사항 표시
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {announcement.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {announcement.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(announcement._id)}
                                className="p-2 text-gray-400 hover:text-indigo-600"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleRemove(announcement._id)}
                                className="p-2 text-gray-400 hover:text-red-600"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {announcement.contents}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <Modal
              isOpen={isModalOpen}
              message={message}
              onClose={handleModalClose}
            />
          </div>
        </div>
      </div>
    </>
  );
};
