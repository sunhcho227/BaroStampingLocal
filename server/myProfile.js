// import { Meteor } from "meteor/meteor";
// import {
//   BlobServiceClient,
//   StorageSharedKeyCredential,
// } from "@azure/storage-blob";
// import AbortController from "abort-controller";
// import { Random } from "meteor/random";
// import fetch from "node-fetch";

// global.AbortController = AbortController;

// const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
// const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
// const containerName = process.env.AZURE_CONTAINER_NAME;
// const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
// const apiKey = process.env.AZURE_OPENAI_API_KEY;
// const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT;
// const apiVersion = "2024-04-01-preview";

// if (
//   !accountName ||
//   !accountKey ||
//   !containerName ||
//   !endpoint ||
//   !apiKey ||
//   !deploymentName
// ) {
//   console.log("환경 변수 확인");
// }

// const blobServiceClient = new BlobServiceClient(
//   `https://${accountName}.blob.core.windows.net`,
//   new StorageSharedKeyCredential(accountName, accountKey)
// );

// Meteor.methods({
//   async "azureBlob.getBlobs"(userId) {
//     if (!userId) {
//       console.log("userId는 필수");
//     }

//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerName);
//       const blobs = [];

//       for await (const blob of containerClient.listBlobsFlat({
//         includeMetadata: true,
//       })) {
//         if (blob.metadata && blob.metadata.user_id === userId) {
//           blobs.push({
//             name: blob.name,
//             url: containerClient.getBlockBlobClient(blob.name).url,
//           });
//         }
//       }
//       return blobs;
//     } catch (error) {
//       console.error("Blob 목록 가져오기 오류:", error.message);
//     }
//   },

//   async "azureBlob.uploadFile"(fileName, fileData, userId) {
//     if (!fileName || !fileData || !userId) {
//       console.log("fileName, fileData, userId 없음");
//     }

//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerName);

//       const blobName = `${Random.id()}_${fileName}`;
//       const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//       const buffer = Buffer.from(fileData, "base64");
//       await blockBlobClient.upload(buffer, buffer.length, {
//         metadata: { user_id: userId },
//         blobHTTPHeaders: { blobContentType: "application/octet-stream" },
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

//   async "dalle.generateImage"(prompt, userId) {
//     if (!prompt) {
//       throw new Meteor.Error("invalid-input", "Prompt는 필수입니다.");
//     }

//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerName);
//       let targetBlob = null;
//       let lastModified = null;

//       for await (const blob of containerClient.listBlobsFlat({
//         includeMetadata: true,
//       })) {
//         if (blob.metadata && blob.metadata.user_id === userId) {
//           targetBlob = blob.name;
//           lastModified = blob.properties.lastModified;
//           break;
//         }
//       }

//       // 마지막 수정 시간 확인
//       if (lastModified) {
//         const now = new Date();
//         const lastModifiedDate = new Date(lastModified);
//         const timeDifference = (now - lastModifiedDate) / (1000 * 60);

//         if (timeDifference <= 10) {
//           throw new Meteor.Error(
//             "10분에 한번씩만 이미지를 생성할 수 있습니다."
//           );
//         }
//       }

//       const payload = {
//         prompt: prompt,
//         n: 1,
//         size: "1024x1024",
//         user: userId,
//       };

//       const response = await fetch(
//         `${endpoint}/openai/deployments/${deploymentName}/images/generations?api-version=${apiVersion}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "api-key": apiKey,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       // 응답 확인 및 에러 처리
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();

//       const imageUrls = result.data.map((image) => image.url);
//       console.log("생성된 이미지 URL:", imageUrls);

//       return imageUrls;
//     } catch (error) {
//       console.error("이미지 생성 오류:", error.message);
//       throw new Meteor.Error(
//         "dalle-image-generation-failed",
//         error.message || "이미지 생성 중 오류 발생"
//       );
//     }
//   },

//   async saveProfileImageFromUrl(userId, imageUrl) {
//     try {
//       const containerClient =
//         blobServiceClient.getContainerClient(containerName);

//       for await (const blob of containerClient.listBlobsFlat({
//         includeMetadata: true,
//       })) {
//         if (blob.metadata && blob.metadata.user_id === userId) {
//           const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
//           await blockBlobClient.delete();
//         }
//       }

//       const response = await fetch(imageUrl);
//       const arrayBuffer = await response.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       const blobName = `${Random.id()}_${userId}`;
//       const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//       // 이미지 업로드
//       await blockBlobClient.upload(buffer, buffer.length, {
//         metadata: { user_id: userId },
//         blobHTTPHeaders: { blobContentType: "image/png" },
//       });

//       return {
//         success: true,
//         url: blockBlobClient.url,
//       };
//     } catch (error) {
//       console.error("프로필 이미지 저장 실패:", error);
//     }
//   },
// });
