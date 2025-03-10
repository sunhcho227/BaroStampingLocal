import { Meteor } from "meteor/meteor";
import { Carts } from "/imports/api/collections";

Meteor.methods({
  // 선택된 항목 장바구니에 넣기
  addCarts(userId, storeId, selectedArr) {
    // 새로운 장바구니 추가
    Carts.insert({
      user_id: userId,
      store_id: storeId,
      cartItems: selectedArr,
    });

    // 다른 가게 장바구니 삭제
    const userCart = Carts.find({
      user_id: userId,
      store_id: { $ne: storeId },
    }).fetch();

    if (userCart.length > 0) {
      Carts.remove({ user_id: userId, store_id: { $ne: storeId } });
      return "이전에 담긴 상품은 삭제되고, 새로운 가게의 상품으로 장바구니가 업데이트되었습니다.";
    }
  },

  // 같은 상품에 대해 수량 합치기
  async getCarts(userId) {
    try {
      const rawCollection = Carts.rawCollection();

      const cartArr = await rawCollection
        .aggregate([
          { $match: { user_id: userId } },
          { $unwind: "$cartItems" },
          {
            $group: {
              _id: "$cartItems.product_id",
              totalQuantity: { $sum: "$cartItems.quantity" },
              price: { $first: "$cartItems.price" },
            },
          },
          {
            $project: {
              product_id: "$_id",
              totalQuantity: 1,
              price: 1,
              totalPrice: {
                $multiply: ["$totalQuantity", { $toInt: "$price" }],
              },
            },
          },
        ])
        .toArray();

      return cartArr;
    } catch (error) {
      console.error("Aggregation error:", error);
      throw new Meteor.Error(
        "AggregationError",
        "장바구니 데이터를 처리하는 중 오류 발생"
      );
    }
  },

  // 장바구니에서 해당 상품 삭제
  deleteCartItem(userId, productId) {
    if (!userId || !productId) {
      console.log("장바구니 삭제에 필요한 user 또는 product 정보 없음");
      return;
    }

    const carts = Carts.find({ user_id: userId }).fetch();

    if (!carts || carts.length === 0) {
      console.log("장바구니가 비었습니다");
      return;
    }

    carts.forEach((cart) => {
      const updatedCartItems = [];
      for (const item of cart.cartItems) {
        if (item.product_id !== productId) {
          updatedCartItems.push(item);
        }
      }

      if (updatedCartItems.length === 0) {
        const result = Carts.remove({ _id: cart._id });
        if (result === 0) {
          console.log("빈 장바구니를 삭제하는 데 실패했습니다.");
        }
      } else {
        const result = Carts.update(
          { _id: cart._id },
          { $set: { cartItems: updatedCartItems } }
        );
        if (result === 0) {
          console.log("장바구니 업데이트에 실패했습니다.");
        }
      }
    });

    return "성공";
  },
});
