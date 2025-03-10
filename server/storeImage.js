// import { Meteor } from "meteor/meteor";
// import {
//   BlobServiceClient,
//   StorageSharedKeyCredential,
// } from "@azure/storage-blob";
// import AbortController from "abort-controller";
// import { Random } from "meteor/random";

// global.AbortController = AbortController;

// const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
// const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
// const containerName = process.env.AZURE_CONTAINER_NAME;
// const containerNameStore = "strgstore";

// if (!accountName || !accountKey || !containerName) {
//   console.log("환경 변수를 확인");
// }

// const blobServiceClient = new BlobServiceClient(
//   `https://${accountName}.blob.core.windows.net`,
//   new StorageSharedKeyCredential(accountName, accountKey)
// );

// Meteor.methods({
//   // StoreImage-------
//   async "azureBlob.getStoreBlobs"(storeId) {
//     if (!storeId) {
//       throw new Meteor.Error("store-id-missing", "스토어 ID가 필요합니다.");
//     }

//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerNameStore);
//       const blobs = [];

//       for await (const blob of containerClient.listBlobsFlat({
//         includeMetadata: true,
//       })) {
//         if (blob.metadata && blob.metadata.store_id === storeId) {
//           blobs.push({
//             name: blob.name,
//             url: containerClient.getBlockBlobClient(blob.name).url,
//             metadata: blob.metadata, // 메타데이터 포함
//           });
//         }
//       }

//       return blobs;
//     } catch (error) {
//       console.error("Blob 목록 가져오기 오류:", error.message);
//       throw new Meteor.Error("blob-fetch-failed", error.message);
//     }
//   },

//   async "azureBlob.uploadStoreFile"(fileName, fileData, storeId, imgType) {
//     if (!fileName || !fileData || !storeId || !imgType) {
//       throw new Meteor.Error(
//         "missing-parameters",
//         "fileName, fileData, storeId, imgType 모두 필요합니다."
//       );
//     }

//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerNameStore);

//       const blobName = `${Random.id()}_${fileName}`;
//       const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//       const buffer = Buffer.from(fileData, "base64");
//       const mimeType = "image/png";

//       await blockBlobClient.upload(buffer, buffer.length, {
//         metadata: {
//           store_id: storeId,
//           type: imgType,
//           uploadedAt: new Date().toISOString(), // 명시적으로 ISO 형식으로 저장
//         },
//         blobHTTPHeaders: { blobContentType: mimeType },
//       });

//       return {
//         success: true,
//         url: blockBlobClient.url,
//         name: blobName,
//       };
//     } catch (error) {
//       console.error("Azure Blob upload error:", error.message);
//       throw new Meteor.Error("azure-blob-upload-failed", error.message);
//     }
//   },

//   // 타입별 이미지 불러오기
//   async "azureBlob.getFilteredBlobs"(storeId, type) {
//     if (!storeId || !type) {
//       throw new Meteor.Error(
//         "missing-parameters",
//         "storeId와 type이 필요합니다."
//       );
//     }

//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerNameStore);
//       const blobs = [];

//       // Blob 순회
//       for await (const blob of containerClient.listBlobsFlat({
//         includeMetadata: true,
//       })) {
//         if (
//           blob.metadata &&
//           blob.metadata.store_id === storeId &&
//           blob.metadata.type === type
//         ) {
//           blobs.push({
//             name: blob.name,
//             url: containerClient.getBlockBlobClient(blob.name).url,
//             metadata: blob.metadata,
//           });
//         }
//       }

//       // createdAt 기준 내림차순 정렬
//       blobs.sort((a, b) => {
//         const dateA = new Date(a.metadata.uploadedAt || 0);
//         const dateB = new Date(b.metadata.uploadedAt || 0);
//         return dateB - dateA; // 최신순 정렬
//       });

//       return blobs;
//     } catch (error) {
//       console.error("Blob 필터링 오류:", error.message);
//       throw new Meteor.Error("blob-fetch-failed", error.message);
//     }
//   },

//   // 이미지 삭제
//   async "azureBlob.deleteStoreFile"(blobName) {
//     if (!blobName) {
//       throw new Meteor.Error("missing-parameters", "blobName이 필요합니다.");
//     }

//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerNameStore);
//       const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//       // Blob 삭제
//       await blockBlobClient.delete();

//       return { success: true, message: "파일이 성공적으로 삭제되었습니다." };
//     } catch (error) {
//       console.error("Blob 삭제 오류:", error.message);
//       throw new Meteor.Error("azure-blob-delete-failed", error.message);
//     }
//   },
// });
