import { Admins, UserStores } from "/imports/api/collections";

Meteor.methods({
  // 유져 닉네임 수정
  "users.updatenickname"(userId, nickname) {
    // 현재 로그인된 사용자의 ID 확인
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error("not-authorized", "로그인이 필요합니다.");
    }

    if (userId !== currentUserId) {
      throw new Meteor.Error(
        "not-authorized",
        "자신의 계정만 수정할 수 있습니다."
      );
    }

    if (
      !nickname ||
      typeof nickname !== "string" ||
      nickname.trim().length === 0
    ) {
      throw new Meteor.Error(
        "invalid-nickname",
        "유효한 닉네임을 입력해주세요."
      );
    }

    // 업데이트할 데이터 구성
    const updateData = {
      "profile.nickname": nickname,
    };

    // 유저 데이터 업데이트
    Meteor.users.update({ _id: userId }, { $set: updateData });
  },

  // 유져 개인정보 수정
  "users.updateProfile"({ nickname, phoneNumber, email }) {
    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error("not-authorized", "로그인이 필요합니다.");
    }

    // 업데이트할 데이터 구성
    const updateData = {
      "profile.nickname": nickname,
      "profile.phoneNumber": phoneNumber,
      "profile.email": email,
    };

    // 필수 항목 검증 (닉네임은 필수)
    if (!nickname) {
      throw new Meteor.Error("invalid-data", "닉네임은 필수 항목입니다.");
    }

    // 사용자 정보 업데이트
    Meteor.users.update(userId, {
      $set: updateData,
    });
  },

  // 비밀번호 변경
  "users.changePassword"({ currentPassword, newPassword }) {
    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error("not-authorized", "로그인이 필요합니다.");
    }

    // 현재 비밀번호 검증 및 새 비밀번호로 변경
    const checkPassword = Accounts._checkPassword(
      Meteor.user(),
      currentPassword
    );

    if (checkPassword.error) {
      throw new Meteor.Error(
        "invalid-password",
        "현재 비밀번호가 올바르지 않습니다."
      );
    }

    Accounts.setPassword(userId, newPassword);
  },

  // 비회원 회원 전환 (사실 개인정보 수정)
  "nonMember.updateProfile"({
    nickname,
    phoneNumber,
    email,
    username,
    password,
    userGrade,
  }) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("not-authorized", "로그인이 필요합니다.");
    }

    // 필수 항목 유효성 검사
    if (!nickname || !username || !password) {
      throw new Meteor.Error("invalid-data", "필수 항목이 누락되었습니다.");
    }

    // ID 중복 체크
    const existingUser = Meteor.users.findOne({ username });
    if (existingUser && existingUser._id !== userId) {
      throw new Meteor.Error(
        "duplicate-username",
        "이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요."
      );
    }

    // 업데이트할 데이터 구성
    const updateData = {
      "profile.nickname": nickname,
      "profile.phoneNumber": phoneNumber,
      "profile.email": email,
      username: username,
    };

    // userGrade가 제공되었으면 추가
    if (userGrade) {
      updateData["profile.userGrade"] = userGrade;
    }

    // 사용자 프로필 업데이트
    Meteor.users.update(userId, {
      $set: updateData,
    });

    // 비밀번호가 있는 경우, 비밀번호도 변경
    if (password) {
      Accounts.setPassword(userId, password);
    }
  },

  // 회원 검색
  "users.search"(query) {
    if (!query.trim()) {
      return [];
    }
    const user = Meteor.user();
    const storeId = Admins.findOne({ user_id: user._id })?.store_id;

    return Meteor.users
      .find({
        _id: {
          $in: UserStores.find({ store_id: storeId }).map(
            (userStore) => userStore.user_id
          ), // 해당 가게에 속한 유저 필터링
        },
        $or: [
          { username: { $regex: query, $options: "i" } },
          { "profile.nickname": { $regex: query, $options: "i" } },
          { "profile.phoneNumber": { $regex: query, $options: "i" } },
          { "profile.email": { $regex: query, $options: "i" } },
        ],
      })
      .fetch()
      .map((user) => ({
        _id: user._id,
        username: user.username,
        profile: user.profile,
      }));
  },

  addUserforCart(currentUsername) {
    // username을 통해 기존 사용자인지 여부 확인
    let userInfo = Meteor.users.findOne({ username: currentUsername });

    // 해당 username이 없으면 새 계정 생성 (비회원)
    if (!userInfo) {
      Accounts.createUser({
        username: currentUsername,
        password: "1234",
        profile: {
          nickname: "Guest",
          phoneNumber: null,
          email: null,
          userGrade: "비회원",
          createdAt: new Date(),
        },
      });
    }
  },
});
