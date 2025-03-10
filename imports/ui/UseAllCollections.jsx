import { useTracker } from "meteor/react-meteor-data";
import { Stamps, StampCancellations, Coupons, Stores, StoreAnnouncements, Admins, Reviews, Messages, Products } from "/imports/api/collections";

export const useAllCollections = () => {
  const user = useTracker(() => Meteor.user(), []);
  const stamps = useTracker(() => Stamps.find().fetch(), []);
  const stampCancellations = useTracker(() => StampCancellations.find().fetch(), []);
  const coupons = useTracker(() => Coupons.find().fetch(), []);
  const stores = useTracker(() => Stores.find().fetch(), []);
  const storeAnnouncements = useTracker(() => StoreAnnouncements.find().fetch(), []);
  const admins = useTracker(() => Admins.find().fetch(), []);
  const reviews = useTracker(() => Reviews.find().fetch(), []);
  const messages = useTracker(() => Messages.find().fetch(), []);
  const products = useTracker(() => Products.find().fetch(), []);
  useTracker(()=>{
    Stores.find().fetch()
    Coupons.find().fetch()
  })

  return { user, stamps, stampCancellations, coupons, stores, storeAnnouncements, admins, reviews, messages, products };
};


// 사용시 선언처리

// import { useAllCollections } from "../UseAllCollections.jsx";

// const {
//   stamps,
//   stampCancellations,
//   coupons,
//   stores,
//   storeAnnouncements,
//   admins,
//   reviews,
//   messages,
//   products,
// } = useAllCollections();

// const {stamps, stampCancellations, coupons, stores, storeAnnouncements, admins, reviews, messages, products,} = useAllCollections();