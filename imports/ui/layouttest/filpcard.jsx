import React from "react";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const flipCard = () => {
    const card = document.querySelector(".card");
    card.classList.toggle("is-flipped"); // 클릭 시 뒤집히는 클래스 토글
  };

  return (
    <>
 <div className="card-container" onClick={flipCard}>
      <div className="card">
        <div className="card-front">
        <div className="orderls-store-card">
                      <div className="orderls-store-card-header">
                        <div className="orderls-store-info">
                          <div className="orderls-store-thumbnail" />
                          <div className="orderls-store-details">
                            <div className="text_title_m">
                              {" "}
                              {
                                Stores.findOne({ _id: payment.store_id })
                                  .storeName
                              }
                            </div>
                            <div className="text_body_l">
                              {Products.findOne({
                                _id: payment.payItems[0]?.product_id,
                              }).productName || "알 수 없는 상품"}{" "}
                              {payment.payItems.length > 1
                                ? `외 ${payment.payItems.length - 1}개`
                                : ""}{" "}
                              {payment.totalSum.toLocaleString()}원
                            </div>
                            <div className="text_body_xs">
                              {" "}
                              {payment.paymentDate.toLocaleString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="orderls-store-options">
                          <div className="orderls-option-dot" />
                          <div className="orderls-option-dot" />
                          <div className="orderls-option-dot" />
                        </div>
                        
                      </div>
                      <div className="orderls-store-card-button">
                        {Reviews.findOne({ payment_id: payment._id }) ? null : (
                          <Link
                            to={`/customers/storereview/${
                              Stores.findOne({ _id: payment.store_id })
                                .storeUrlName
                            }`}
                            state={{ payment_id: payment._id }}
                          >
                            <button className="btn-secondary">리뷰 쓰기</button>
                          </Link>
                        )}
                      </div>
                    </div>
        </div>
        <div className="card-back">까꿍</div>
      </div>
    </div>
    </>
  )
};
