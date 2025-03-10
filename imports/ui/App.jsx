// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import ScrollToTop from "./ScrollToTop.jsx";
import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";
import Loading from "./Loading.jsx";

// admins
import Admins from "./admins/Admins.jsx";
import UserDetail from "./admins/UserDetail.jsx";
import UserSearch from "./admins/UserSearch.jsx";
import StampPlus from "./admins/StampPlus.jsx";
import Reader from "./admins/Reader.jsx";
import ReaderAdmin from "./admins/ReaderAdmin.jsx";
import CouponUse from "./admins/CouponUse.jsx";
import ServiceCoupon from "./admins/ServiceCoupon.jsx";
import ServiceCouponPlus from "./admins/ServiceCouponPlus.jsx";
import MyShop from "./admins/MyShop.jsx";
import Product from "./admins/Product.jsx";
import ProductEdit from "./admins/ProductEdit.jsx";
import JoinStampIng from "./customers/JoinStampIng.jsx";
import StoreAnnouncement from "./admins/StoreAnnouncement.jsx";
import StoreInformation from "./admins/StoreInformation.jsx";
import ShopOrders from "./admins/ShopOrders.jsx";
import StoreAllReview from "./admins/StoreAllReview.jsx";
import StoreImage from "./admins/StoreImage.jsx";
import StampCoupon from "./admins/StampCoupon.jsx";
import POS from "./admins/POS.jsx";
import POSAddStamp from "./admins/POSAddStamp.jsx";

// customers
import Customers from "./customers/Customers.jsx";
import Coupons from "./customers/Coupons.jsx";
import Cart from "./customers/Cart.jsx";
import Mypage from "./customers/Mypage.jsx";
import Stores from "./customers/Stores.jsx";
import StoreDetail from "./customers/StoreDetail.jsx";
import UsingCoupon from "./customers/UsingCoupon.jsx";
import MakeCoupon from "./customers/MakeCoupon.jsx";
import Register from "./customers/Register.jsx";
import StoreReviewAdd from "./customers/StoreReviewAdd.jsx";
import Order from "./customers/Order.jsx";
import OrderStore from "./customers/OrderStore.jsx";
import Payment from "./customers/Payment.jsx";
import MyStores from "./customers/MyStores.jsx";
import MyCoupons from "./customers/MyCoupons.jsx";
import MyStamps from "./customers/MyStamps.jsx";
import MyReview from "./customers/MyReview.jsx";
import EditReview from "./customers/EditReview.jsx";
import EditProfile from "./customers/EditProfile.jsx";
import EditPassword from "./customers/EditPassword.jsx";
import LayoutTest from "./layouttest/layout.jsx";
import JoinUs from "./customers/JoinUs.jsx";
import MyOrders from "./customers/MyOrders.jsx";
import MyCouponStamp from "./customers/MyCouponStamp.jsx";
import EditProfileImage from "./customers/EditProfileImage.jsx";
import StampTour from "./customers/StampTour.jsx";
import LandingPage from "./customers/LandingPage.jsx";

export const App = () => {
  const { loggingIn, user } = useTracker(() => ({
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
  }));

  if (loggingIn) {
    return <Loading />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/customers/joinStampIng" element={<JoinStampIng />} />
            <Route
              path="/customers/order/:storeUrlName"
              element={<OrderStore />}
            />
            <Route path="/customers/order" element={<OrderStore />} />
            <Route path="/customers/register" element={<Register />} />
            <Route path="*" element={<Home />} />
            <Route path="/customers/StampTour" element={<StampTour />} />
            <Route path="/customers/LandingPage" element={<LandingPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reader" element={<Reader />} />
            <Route path="/readerAdmin" element={<ReaderAdmin />} />
            <Route path="/admins/stampplus" element={<StampPlus />} />
            <Route path="/admins/usersearch" element={<UserSearch />} />
            <Route path="/admins/userdetail" element={<UserDetail />} />
            <Route path="/admins/couponuse" element={<CouponUse />} />
            <Route path="/admins/servicecoupon" element={<ServiceCoupon />} />
            <Route
              path="/admins/serviceCouponPlus"
              element={<ServiceCouponPlus />}
            />
            <Route path="/admins/myshop" element={<MyShop />} />
            <Route path="/admins/product" element={<Product />} />
            <Route
              path="/admins/myshop/productEdit"
              element={<ProductEdit />}
            />
            <Route path="/admins/shopOrders" element={<ShopOrders />} />
            <Route
              path="/admins/announcement"
              element={<StoreAnnouncement />}
            />
            <Route
              path="/admins/storeinformation"
              element={<StoreInformation />}
            />
            <Route path="/admins/storeallreview" element={<StoreAllReview />} />
            <Route path="/admins/storeimage" element={<StoreImage />} />
            <Route path="/admins/StampCoupon" element={<StampCoupon />} />
            <Route path="/admins/POS" element={<POS />} />
            <Route path="/admins/POSAddStamp" element={<POSAddStamp />} />

            <Route path="/customers/joinStampIng" element={<JoinStampIng />} />
            <Route path="/customers/coupons" element={<Coupons />} />
            <Route path="/customers/stores" element={<Stores />} />
            <Route
              path="/customers/storereview/:storeUrlName"
              element={<StoreReviewAdd />}
            />
            <Route
              path="/customers/StoreDetail/:storeUrlName"
              element={<StoreDetail />}
            />
            <Route path="/customers/makeCoupon" element={<MakeCoupon />} />
            <Route path="/customers/mypage" element={<Mypage />} />
            <Route
              path="/customers/UsingCoupon/:couponId"
              element={<UsingCoupon />}
            />
            <Route path="/customers/register" element={<Register />} />
            <Route path="/customers/order" element={<Order />} />
            <Route
              path="/customers/order/:storeUrlName"
              element={<OrderStore />}
            />
            <Route path="/customers/cart" element={<Cart />} />
            <Route path="/customers/payment" element={<Payment />} />
            <Route path="/customers/mystores" element={<MyStores />} />
            <Route path="/customers/mycoupons" element={<MyCoupons />} />
            <Route path="/customers/mystamps" element={<MyStamps />} />
            <Route path="/customers/myreview" element={<MyReview />} />
            <Route path="/customers/editreview" element={<EditReview />} />
            <Route path="/customers/editprofile" element={<EditProfile />} />
            <Route path="/customers/editpassword" element={<EditPassword />} />
            <Route path="/customers/layouttest" element={<LayoutTest />} />
            <Route path="/customers/joinus" element={<JoinUs />} />
            <Route path="/customers/myorders" element={<MyOrders />} />
            <Route
              path="/customers/mycouponstamp"
              element={<MyCouponStamp />}
            />
            <Route
              path="/customers/EditProfileImage"
              element={<EditProfileImage />}
            />
            <Route path="/customers/StampTour" element={<StampTour />} />
            <Route path="/customers/LandingPage" element={<LandingPage />} />

            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </Router>
  );
};
