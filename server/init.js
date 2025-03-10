import {
  Admins,
  AIprompts,
  Carts,
  Coupons,
  Orders,
  Products,
  Payments,
  Reviews,
  Stamps,
  StoreAnnouncements,
  Stores,
  UserNotifications,
  UserStores,
} from "/imports/api/collections";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";

if (!Stores.findOne()) {
  Stores.insert({
    storeName: "스타벅스 종각점",
    maxStamp: 18,
    storeUrlName: "Starbucks",
    couponInformation: "카페 아메리카노",
    storeLLM: null,
    storeInformation: "환영합니다, 스타벅스 종각점입니다.",
    storePhoneNumber: "1522-3232",
    storeAddress: "서울 종로구 종로 64",
    storeLatitude: 37.570042,
    storeLongitude: 126.984556,
  });
  Stores.insert({
    storeName: "꽃집",
    maxStamp: 13,
    storeUrlName: "FlowerShop",
    couponInformation: "장미 한송이",
    storeLLM: null,
    storeInformation: "꽃집에는 예쁜 꽃이 있어요.",
    storePhoneNumber: "02-3254-4839",
    storeAddress: "서울 종로구 종로8길 5-8",
    storeLatitude: 37.569384,
    storeLongitude: 126.985649,
  });
  Stores.insert({
    storeName: "종로엔약국",
    maxStamp: 10,
    storeUrlName: "JongroPharmacy",
    couponInformation: "비타500",
    storeLLM: null,
    storeInformation: "방문하시면 복약에 대한 자세한 안내가 가능합니다.",
    storePhoneNumber: "010-4329-9848",
    storeAddress: "서울 종로구 종로 65 103호",
    storeLatitude: 37.570692,
    storeLongitude: 126.984676,
  });
  Stores.insert({
    storeName: "오뜨다이아몬드",
    maxStamp: 30,
    storeUrlName: "OtteuDiamond",
    couponInformation: "기본 링반지",
    storeLLM: null,
    storeInformation:
      "오뜨다이아몬드는 100% 예약제로 운영하고 있습니다. 다이아몬드 직거래 및 다이아몬드 제품을 전문으로 취급하고 있으며 주얼리 디자인 전문샵으로 커스텀 메이드를 지향합니다.",
    storePhoneNumber: "02-725-3967",
    storeAddress: "서울 종로구 종로 83-1 덕흥빌딩 2층",
    storeLatitude: 37.570521,
    storeLongitude: 126.986539,
  });
  Stores.insert({
    storeName: "청킹마마",
    maxStamp: 20,
    storeUrlName: "ChungkingMama",
    couponInformation: "구름 꿔바로우",
    storeLLM: null,
    storeInformation:
      "종로맛집 청킹마마입니다. HK 홍콩의 낮과 밤을 담은, Hybrid Chinese Restaurant.",
    storePhoneNumber: "0507-1392-0663",
    storeAddress: "서울 종로구 우정국로2길 29 2층",
    storeLatitude: 37.569778,
    storeLongitude: 126.98469,
  });
  Stores.insert({
    storeName: "죠스떡볶이",
    maxStamp: 15,
    storeUrlName: "SharkTteokbokki",
    couponInformation: "죠스 떡볶이",
    storeLLM: null,
    storeInformation: "죠스떡볶이는 오랜 전통을 자랑하는 떡볶이 전문점입니다.",
    storePhoneNumber: "02-720-1478",
    storeAddress: "서울 종로구 종로10길 5 신우빌딩 1층",
    storeLatitude: 37.569896,
    storeLongitude: 126.984527,
  });
  Stores.insert({
    storeName: "해운대달맞이빵",
    maxStamp: 18,
    storeUrlName: "MoonBread",
    couponInformation: "트로피컬 크로플",
    storeLLM: null,
    storeInformation:
      "매일 빵을 굽고 샐러드, 샌드위치를 직접 만들어 맛과 신선함을 더해 최선을 다해 노력하겠습니다.",
    storePhoneNumber: "070-8680-0452",
    storeAddress: "서울 종로구 청계천로 59 1층",
    storeLatitude: 37.569124,
    storeLongitude: 126.98421,
  });
  Stores.insert({
    storeName: "교촌치킨 종로1호점",
    maxStamp: 25,
    storeUrlName: "KyochonChicken",
    couponInformation: "허니 콤보",
    storeLLM: null,
    storeInformation:
      "Real Flavor, True Story 우리의 정직한 이야기가 담긴, 정직한 맛을 소비자에게 전달하겠다는 이 슬로건은 교촌치킨이 지키고 이끌어나가야 할 약속입니다.",
    storePhoneNumber: "02-737-9292",
    storeAddress: "서울 종로구 종로12길 15 코아빌딩 1층",
    storeLatitude: 37.569425,
    storeLongitude: 126.985853,
  });
  Stores.insert({
    storeName: "그라벨르헤어 종로점",
    maxStamp: 20,
    storeUrlName: "GravelHair",
    couponInformation: "일반컷",
    storeLLM: null,
    storeInformation: "늘 최선을 다하는 그라벨르헤어 종로점입니다.",
    storePhoneNumber: "0507-1494-1546",
    storeAddress: "서울 종로구 우정국로2길 8 세븐빌딩 2층",
    storeLatitude: 37.569465,
    storeLongitude: 126.983443,
  });
  Stores.insert({
    storeName: "종로네일샵",
    maxStamp: 15,
    storeUrlName: "JongroNailShop",
    couponInformation: "매니큐어",
    storeLLM: null,
    storeInformation: "종로네일샵은 예쁜 네일을 만들어드립니다.",
    storePhoneNumber: "02-5532-6747",
    storeAddress: "서울 종로구 종로 62",
    storeLatitude: 37.56996,
    storeLongitude: 126.984292,
  });
  console.log("10 Stores are created");
}

if (!Meteor.users.findOne()) {
  for (let i = 1; i < 11; i++) {
    Accounts.createUser({
      username: `admin${i}`,
      password: "1234",
      profile: {
        nickname: `admin${i}`,
        phoneNumber: `010-${i}${i}${i}${i}-${i}${i}${i}${i}`,
        email: `admin${i}@mail.com`,
        userGrade: "기업",
        createdAt: new Date(),
      },
    });
  }
  console.log("Admin1-10 users are created");

  for (let i = 1; i < 6; i++) {
    Accounts.createUser({
      username: `user${i}`,
      password: "1234",
      profile: {
        nickname: `user${i}`,
        phoneNumber: `010-${i}${i}${i}${i}-${i}${i}${i}${i}`,
        email: `user${i}@mail.com`,
        userGrade: "회원",
        createdAt: new Date(),
      },
    });
  }
  console.log("Users1-5 users are created");
}

const chungkingMama = Stores.findOne({ storeUrlName: "ChungkingMama" });
const sharkTteokbokki = Stores.findOne({ storeUrlName: "SharkTteokbokki" });
const moonBread = Stores.findOne({ storeUrlName: "MoonBread" });
const kyochonChicken = Stores.findOne({ storeUrlName: "KyochonChicken" });
const flowerShop = Stores.findOne({ storeUrlName: "FlowerShop" });
const jongroPharmacy = Stores.findOne({ storeUrlName: "JongroPharmacy" });
const starbucks = Stores.findOne({ storeUrlName: "Starbucks" });
const otteuDiamond = Stores.findOne({ storeUrlName: "OtteuDiamond" });
const gravelHair = Stores.findOne({ storeUrlName: "GravelHair" });
const jongroNailShop = Stores.findOne({ storeUrlName: "JongroNailShop" });

const adminUsers = Meteor.users
  .find({ username: { $regex: /^admin\d+$/ } })
  .fetch();
const adminUserIds = adminUsers.map((adminUser) => adminUser._id);

// array shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let storeIds = Stores.find({})
  .fetch()
  .map((store) => store._id);
storeIds = shuffleArray(storeIds);

if (!Admins.findOne()) {
  adminUserIds.forEach((adminUserId, index) => {
    Admins.insert({
      user_id: adminUserId,
      store_id: storeIds[index],
    });
  });
  console.log("Admin users and stores are paired and inserted successfully");
}

// 가게 상품
if (!Products.findOne()) {
  // 종로네일샵 상품
  Products.insert({
    store_id: jongroNailShop._id,
    productName: "매니큐어",
    productPrice: 35000,
  });
  Products.insert({
    store_id: jongroNailShop._id,
    productName: "젤 네일",
    productPrice: 50000,
  });
  Products.insert({
    store_id: jongroNailShop._id,
    productName: "패디큐어",
    productPrice: 70000,
  });
  Products.insert({
    store_id: jongroNailShop._id,
    productName: "기본 손 케어",
    productPrice: 25000,
  });
  Products.insert({
    store_id: jongroNailShop._id,
    productName: "속눈썹 연장",
    productPrice: 80000,
  });

  // 그라벨르헤어 상품
  Products.insert({
    store_id: gravelHair._id,
    productName: "일반 컷",
    productPrice: 25000,
  });
  Products.insert({
    store_id: gravelHair._id,
    productName: "일반 펌",
    productPrice: 102000,
  });
  Products.insert({
    store_id: gravelHair._id,
    productName: "뿌리 염색",
    productPrice: 70000,
  });
  Products.insert({
    store_id: gravelHair._id,
    productName: "샴푸",
    productPrice: 10000,
  });
  Products.insert({
    store_id: gravelHair._id,
    productName: "신데렐라 클리닉",
    productPrice: 280000,
  });

  // 오뜨다이아몬드 상품
  Products.insert({
    store_id: otteuDiamond._id,
    productName: "웨딩 밴드",
    productPrice: 5000000,
  });
  Products.insert({
    store_id: otteuDiamond._id,
    productName: "다이아 반지",
    productPrice: 8000000,
  });
  Products.insert({
    store_id: otteuDiamond._id,
    productName: "18K 귀걸이",
    productPrice: 70000,
  });
  Products.insert({
    store_id: otteuDiamond._id,
    productName: "은 팔찌",
    productPrice: 30000,
  });
  Products.insert({
    store_id: otteuDiamond._id,
    productName: "금 시계",
    productPrice: 10000000,
  });

  // 스타벅스 상품
  Products.insert({
    store_id: starbucks._id,
    productName: "카페 아메리카노",
    productPrice: 4500,
  });
  Products.insert({
    store_id: starbucks._id,
    productName: "카페 라떼",
    productPrice: 5000,
  });
  Products.insert({
    store_id: starbucks._id,
    productName: "커피 스타벅스 더블 샷",
    productPrice: 5100,
  });
  Products.insert({
    store_id: starbucks._id,
    productName: "토피 넛 라떼",
    productPrice: 6500,
  });
  Products.insert({
    store_id: starbucks._id,
    productName: "홀리데이 패션 티 뱅쇼",
    productPrice: 6700,
  });

  // 종로엔약국 상품
  Products.insert({
    store_id: jongroPharmacy._id,
    productName: "종합 감기약",
    productPrice: 3000,
  });
  Products.insert({
    store_id: jongroPharmacy._id,
    productName: "안티푸라민",
    productPrice: 8000,
  });
  Products.insert({
    store_id: jongroPharmacy._id,
    productName: "강아지 구충제",
    productPrice: 50000,
  });
  Products.insert({
    store_id: jongroPharmacy._id,
    productName: "비타500",
    productPrice: 1000,
  });
  Products.insert({
    store_id: jongroPharmacy._id,
    productName: "까스활명수",
    productPrice: 1500,
  });

  // 꽃집 상품
  Products.insert({
    store_id: flowerShop._id,
    productName: "장미 한 송이",
    productPrice: 5000,
  });
  Products.insert({
    store_id: flowerShop._id,
    productName: "프리지아 한 송이",
    productPrice: 7000,
  });
  Products.insert({
    store_id: flowerShop._id,
    productName: "수국 한 송이",
    productPrice: 8000,
  });
  Products.insert({
    store_id: flowerShop._id,
    productName: "꽃 다발",
    productPrice: 40000,
  });
  Products.insert({
    store_id: flowerShop._id,
    productName: "꽃 바구니",
    productPrice: 80000,
  });

  // 교촌치킨 상품
  Products.insert({
    store_id: kyochonChicken._id,
    productName: "허니 콤보",
    productPrice: 23000,
  });
  Products.insert({
    store_id: kyochonChicken._id,
    productName: "교촌 오리지날",
    productPrice: 19000,
  });
  Products.insert({
    store_id: kyochonChicken._id,
    productName: "시그니처 점보 윙",
    productPrice: 28000,
  });
  Products.insert({
    store_id: kyochonChicken._id,
    productName: "레드순살",
    productPrice: 23000,
  });
  Products.insert({
    store_id: kyochonChicken._id,
    productName: "고르론 치즈볼",
    productPrice: 3500,
  });

  // 해운대달맞이빵 상품
  Products.insert({
    store_id: moonBread._id,
    productName: "트로피컬 크로플",
    productPrice: 12900,
  });
  Products.insert({
    store_id: moonBread._id,
    productName: "망고 크로아상",
    productPrice: 12900,
  });
  Products.insert({
    store_id: moonBread._id,
    productName: "생과일 모찌",
    productPrice: 3500,
  });
  Products.insert({
    store_id: moonBread._id,
    productName: "자이언트 크룽지",
    productPrice: 5800,
  });
  Products.insert({
    store_id: moonBread._id,
    productName: "앙버터 호두과자",
    productPrice: 4500,
  });

  // 죠스떡볶이 상품
  Products.insert({
    store_id: sharkTteokbokki._id,
    productName: "죠스 떡볶이",
    productPrice: 5000,
  });
  Products.insert({
    store_id: sharkTteokbokki._id,
    productName: "죠스 찰 순대",
    productPrice: 5000,
  });
  Products.insert({
    store_id: sharkTteokbokki._id,
    productName: "수제 튀김",
    productPrice: 9000,
  });
  Products.insert({
    store_id: sharkTteokbokki._id,
    productName: "트윈 세트",
    productPrice: 22000,
  });
  Products.insert({
    store_id: sharkTteokbokki._id,
    productName: "스페셜 세트",
    productPrice: 25500,
  });

  // 청킹마마 상품
  Products.insert({
    store_id: chungkingMama._id,
    productName: "족발덮밥",
    productPrice: 15000,
  });
  Products.insert({
    store_id: chungkingMama._id,
    productName: "한우 1++ 훠궈",
    productPrice: 17900,
  });
  Products.insert({
    store_id: chungkingMama._id,
    productName: "청킹 공중부양면",
    productPrice: 24000,
  });
  Products.insert({
    store_id: chungkingMama._id,
    productName: "구름 꿔바로우",
    productPrice: 19000,
  });
  Products.insert({
    store_id: chungkingMama._id,
    productName: "청킹 마라탕",
    productPrice: 9900,
  });
  console.log("Products are created");
}

// 가게 공지사항
if (!StoreAnnouncements.findOne()) {
  StoreAnnouncements.insert({
    store_id: jongroNailShop._id,
    createdAt: new Date(),
    title: "시즌 이벤트 안내",
    contents: "시즌 이벤트로 매니큐어 50% 할인 이벤트를 진행하고 있습니다.",
  });
  StoreAnnouncements.insert({
    store_id: gravelHair._id,
    createdAt: new Date(),
    title: "당일 예약 안내",
    contents:
      "방문 1시간 전까지 연락주시면 당일 예약 가능 여부를 알려드립니다.",
  });
  StoreAnnouncements.insert({
    store_id: otteuDiamond._id,
    createdAt: new Date(),
    title: "사전 예약 안내",
    contents:
      "저희 매장은 100% 예약제로 운영하고 있습니다. 예약은 예약일 전날까지 연락주셔야합니다. 당일 예약은 불가합니다.",
  });
  StoreAnnouncements.insert({
    store_id: starbucks._id,
    createdAt: new Date(),
    title: "단체 예약 안내",
    contents:
      "단체 예약은 예약일 전날까지 연락주셔야합니다. 당일 단체 예약은 불가합니다.",
  });
  StoreAnnouncements.insert({
    store_id: jongroPharmacy._id,
    createdAt: new Date(),
    title: "공휴일 영업 안내",
    contents:
      "공휴일에도 영업합니다. 영업 시간은 오전 10시부터 오후 6시까지입니다.",
  });
  StoreAnnouncements.insert({
    store_id: flowerShop._id,
    createdAt: new Date(),
    title: "졸업 시즌 꽃 다발 사전 주문 안내",
    contents:
      "졸업 시즌 꽃 다발은 사전 주문을 받고 있습니다. 픽업일 기준 1주일 전까지 주문 부탁드립니다.",
  });
  StoreAnnouncements.insert({
    store_id: kyochonChicken._id,
    createdAt: new Date(),
    title: "치킨 배달 지연 안내",
    contents:
      "치킨 배달이 지연되는 경우가 있습니다. 주문 시 참고 부탁드립니다.",
  });
  StoreAnnouncements.insert({
    store_id: moonBread._id,
    createdAt: new Date(),
    title: "가장 맛있게 빵 먹는 방법을 알려드려요!",
    contents:
      "빵을 먹을 때는 먼저 빵 위에 뿌린 초콜릿을 먹어야 합니다. 그러면 빵이 더 맛있어집니다.",
  });
  StoreAnnouncements.insert({
    store_id: sharkTteokbokki._id,
    createdAt: new Date(),
    title: "신메뉴가 출시되었습니다",
    contents: "신메뉴인 스페셜세트를 추천합니다.",
  });
  StoreAnnouncements.insert({
    store_id: chungkingMama._id,
    createdAt: new Date(),
    title: "연말모임, 회식 공간 찾으시나요?",
    contents:
      "종각역 1분 거리이며, 빔 프로젝터, 스피커, 마이커 보유, 최대 70인 사용 가능합니다. 전화문의 주세요!",
  });
  console.log("StoreAnnouncements are created");
}

// AI 프롬프트
if (!AIprompts.findOne()) {
  AIprompts.insert({
    store_id: jongroNailShop._id,
    category: "nail shop",
    product: "manicure",
  });
  AIprompts.insert({
    store_id: gravelHair._id,
    category: "hair salon",
    product: "haircut",
  });
  AIprompts.insert({
    store_id: otteuDiamond._id,
    category: "jewelry shop",
    product: "wedding ring",
  });
  AIprompts.insert({
    store_id: starbucks._id,
    category: "coffee shop",
    product: "coffee",
  });
  AIprompts.insert({
    store_id: jongroPharmacy._id,
    category: "pharmacy",
    product: "vitamin",
  });
  AIprompts.insert({
    store_id: flowerShop._id,
    category: "flower shop",
    product: "rose",
  });
  AIprompts.insert({
    store_id: kyochonChicken._id,
    category: "fried chicken restaurant",
    product: "fried chicken",
  });
  AIprompts.insert({
    store_id: moonBread._id,
    category: "bakery",
    product: "bread",
  });
  AIprompts.insert({
    store_id: sharkTteokbokki._id,
    category: "street food",
    product: "tteokbokki",
  });
  AIprompts.insert({
    store_id: chungkingMama._id,
    category: "chinese restaurant",
    product: "sweet and sour pork",
  });
  console.log("AIprompts are created");
}

async function insertOrder() {
  if (!Orders.findOne()) {
    for (let i = 1; i <= 5; i++) {
      const userIdOrder = Meteor.users.findOne({ username: `user${i}` })._id;

      for (let j = 1; j <= 10; j++) {
        const adminOrder = Meteor.users.findOne({ username: `admin${j}` });
        const storeIdOrder = Admins.findOne({
          user_id: adminOrder._id,
        }).store_id;
        const productOrder = Products.findOne({ store_id: storeIdOrder });

        Stamps.insert({
          user_id: userIdOrder,
          store_id: storeIdOrder,
          createdAt: new Date(),
        });

        UserStores.insert({
          user_id: userIdOrder,
          store_id: storeIdOrder,
        });

        await Orders.insert({
          user_id: userIdOrder,
          store_id: storeIdOrder,
          orderItems: [
            {
              product_id: productOrder._id,
              quantity: 1,
              price: productOrder.productPrice,
            },
          ],
          totalPrice: productOrder.productPrice,
          orderType: "현장 주문",
        });

        const orderPay = Orders.findOne({
          user_id: userIdOrder,
          store_id: storeIdOrder,
        });

        await Payments.insert({
          user_id: userIdOrder,
          store_id: storeIdOrder,
          order_id: orderPay._id,
          payItems: orderPay.orderItems,
          totalSum: productOrder.productPrice,
          paymentDate: new Date(),
          status: "완료",
        });

        const payReview = Payments.findOne({ order_id: orderPay._id });
        Reviews.insert({
          user_id: userIdOrder,
          store_id: storeIdOrder,
          payment_id: payReview._id,
          reviewContents: "최고의 서비스에요!",
          rating: 5,
          aiReview: null,
          createdAt: new Date(),
          updatedAt: null,
        });
      }
    }
    console.log(
      "모든 user에 대한 order, payment, stamp, userStore, review 완료"
    );
  }
}

// 새로운 시연부스 10개 데이터 삽입
if (!Stores.findOne({ storeUrlName: "team01" })) {
  for (let i = 1; i <= 10; i++) {
    // 숫자를 2자리 문자열로 변환 (예: 1 -> "01")
    const paddedNumber = i.toString().padStart(2, "0");

    // 새 가게 삽입
    const storeId = Stores.insert({
      storeName: `시연부스${paddedNumber}`,
      maxStamp: 1,
      storeUrlName: `team${paddedNumber}`,
      couponInformation: "미션 완료 보상",
      storeLLM: null,
      storeInformation: null,
      storePhoneNumber: `02-${i + 100}-${i + 1000}`,
      storeAddress: "서울특별시 종로구 관철동 우정국로2길 21 11층",
      storeLatitude: 37.569689,
      storeLongitude: 126.984179,
    });

    // 새 사용자 삽입
    const userId = Accounts.createUser({
      username: `team${paddedNumber}`,
      password: "1234",
      profile: {
        nickname: `시연부스${paddedNumber}`,
        phoneNumber: "000-2024-1219",
        email: `team${paddedNumber}@email.com`,
        userGrade: "기업",
        createdAt: new Date(),
      },
    });

    // 관리자 데이터 삽입
    Admins.insert({
      user_id: userId,
      store_id: storeId,
    });

    // 공지사항 데이터 삽입
    StoreAnnouncements.insert({
      store_id: storeId,
      createdAt: new Date(),
      title: "누구나에서 교육생 프로젝트 발표행사 진행중!",
      contents: "저희 부스에 와서 체험해보고 가세요!",
    });

    // AI 프롬프트 데이터 삽입
    AIprompts.insert({
      store_id: storeId,
      category: "In front of a computer",
      product: "Coding while looking at a monitor",
    });
  }
  console.log("시연부스 데이터 삽입 완료");
}

Meteor.startup(() => {
  insertOrder();
  console.log("Server started");
});
