// import { Meteor } from "meteor/meteor";
// import fetch from "node-fetch";
// import { Reviews, AIprompts } from "/imports/api/collections";

// const endpoint = process.env.AZURE_OPENAI_LLM_ENDPOINT;
// const apiKey = process.env.AZURE_OPENAI_LLM_API_KEY;
// const apiVersion = "2024-08-01-preview";
// // const apiVersion = "2024-02-15-preview";
// const deployment = process.env.AZURE_OPENAI_LLM_DEPLOYMENT;

// Meteor.methods({
//   // ai가 만든 리뷰 댓글 reviewLLM 생성
//   async generateReviewLLM(storeId) {
//     const shopInfo = AIprompts.findOne({ store_id: storeId });
//     const reviews = Reviews.find({ store_id: storeId, aiReview: null }).fetch();

//     if (!reviews.length) {
//       return "현재 모든 리뷰에 대해서 AI 답변이 생성된 상태입니다.";
//     }

//     try {
//       let count = 0;
//       for (const review of reviews) {
//         const payload = {
//           messages: [
//             {
//               role: "system",
//               content: `나 가게 사장이야. 업종은 ${shopInfo?.category}. 대표 메뉴는 ${shopInfo?.product}. 손님이 우리 가게를 이용하고 남겨 준 리뷰에 대해서 너가 읽고 나 대신에 답글을 달아줘. 그런데 리뷰가 너무 부정적이면 얼마나 부정적인지 혹은 공격적인 수위를 체크해서 너무 부정적이거나 공격적이면 '다음에 방문해 주시면 더 나은 서비스를 경험하실 수 있도록 시정하겠습니다.'의 취지로 답변해줘. 만약 손님 리뷰가 긍정적이면, 손님의 리뷰 내용에 대해서 주요 키워드를 이용해서 '상품이 마음에 드셨다니 기쁩니다. 이용해주셔서 감사합니다'의 취지로 답변해줘. 혹시 부정적이지도 긍정적이지도 않은데, 니가 답변할 수 없는 상황이라면 '저희 가게를 이용해주셔서 감사합니다 다음에도 또 이용해주세요'의 취지로 답변해줘.`,
//             },
//             {
//               role: "user",
//               content: review.reviewContents,
//             },
//           ],
//           temperature: 0.7,
//           top_p: 0.95,
//           max_tokens: 800,
//           stream: false,
//         };

//         const response = await fetch(
//           `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "api-key": `${apiKey}`,
//             },
//             body: JSON.stringify(payload),
//           }
//         );

//         if (!response.ok) {
//           console.error(
//             `Failed to process review ${review._id}: HTTP status ${response.status}`
//           );
//           continue;
//         }

//         const result = await response.json();
//         const reply =
//           result.choices?.[0]?.message?.content || "저희 매장을 이용해 주셔서 감사합니다. 앞으로 더 좋은 서비스를 제공하도록 최선을 다하겠습니다.";

//         Reviews.update({ _id: review._id }, { $set: { aiReview: reply } });
//         count++;
//       }
//       return `AI가 ${count}개의 리뷰에 대해서 답변을 생성하였습니다.`;
//     } catch (error) {
//       console.error("Error generating or updating reviews:", error.messages);
//     }
//   },

//   // ai가 만든 가게 홍보 문구 storeLLM 생성
//   async generateStoreLLM(storeId) {
//     const reviews = Reviews.find({ store_id: storeId },{ sort: { createdAt: -1 }, limit: 20 }).fetch();
//     const contents = reviews
//       .map((review) => review.reviewContents || "")
//       .filter((content) => content.trim() !== "")
//       .join(", ");
//     const shopInfo = AIprompts.findOne({ store_id: storeId });

//     try {
//       const payload = {
//         messages: [
//           {
//             role: "system",
//             content: `나 가게 사장이야. 업종은 ${shopInfo.category}. 대표 메뉴는 ${shopInfo.product}. 내가 지금부터 너한테 넣어주는 내용은 우리 가게에 손님들이 남겨준 리뷰 내용이야. 손님들이 남긴 리뷰 내용 중에 주요 키워드를 고르고, 이것을 기반으로 우리 가게를 대표할 수 있는 아주 간단한 문구를 한글로 60자 이내로 작성해줘. 이 모든 조건을 정리해서 예를 들면, 치킨가게인 경우, 친구랑 시켜먹으면 더 맛있는 치킨가게! 이런 식으로.`,
//           },
//           {
//             role: "user",
//             content: contents,
//           },
//         ],
//         temperature: 0.7,
//         top_p: 0.95,
//         max_tokens: 800,
//         stream: false,
//       };

//       const response = await fetch(
//         `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "api-key": `${apiKey}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!response.ok) {
//         const errorDetails = await response.json();
//         console.error(
//           `Failed to process: HTTP status ${response.status}, Details:`,
//           errorDetails
//         );
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       const reply =
//         result.choices?.[0]?.message?.content || "최고의 서비스!";

//       return reply;
//     } catch (error) {
//       console.error("Error generating store LLM:", error);
//     }
//   },
// });
