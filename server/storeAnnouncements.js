import { StoreAnnouncements, Admins } from "/imports/api/collections";

Meteor.methods({
  // 공지사항 작성
  "storeAnnouncements.insert"(store_id, title, contents) {
    return StoreAnnouncements.insert({
      store_id,
      createdAt: new Date(),
      title,
      contents,
    });
  },
  // 공지사항 업데이트
  "storeAnnouncements.update"(announcementId, title, contents) {
    return StoreAnnouncements.update(
      { _id: announcementId },
      { $set: { title, contents } }
    );
  },
  // 공지사항 삭제
  "storeAnnouncements.remove"(_id) {
    return StoreAnnouncements.remove({ _id });
  },
});
