const tags = require("./tags.json");
const wallpapers = require("./wallpaper.json");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const _ = require("lodash");
// Hàm download file
async function downloadFile(url, folder) {
  const fileName = path.basename(url); // Lấy tên file từ URL
  const filePath = path.join(folder, fileName); // Tạo đường dẫn đầy đủ để lưu file

  // Đảm bảo thư mục tồn tại
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // Kiểm tra xem file đã tồn tại chưa
  if (fs.existsSync(filePath)) {
    console.log(`File "${fileName}" đã tồn tại. Không cần tải xuống nữa.`);
    return; // Thoát nếu file đã tồn tại
  }

  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream", // Để axios trả về luồng dữ liệu
    });

    // Tạo luồng ghi dữ liệu vào file
    const writer = fs.createWriteStream(filePath);

    // Ghi dữ liệu từ luồng tải xuống vào file
    response.data.pipe(writer);

    // Trả về promise hoàn thành khi việc ghi file hoàn tất
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Lỗi khi tải file:", error);
  }
}

// async function checkAndCreateFolder(folderPath) {
//   try {
//     // Kiểm tra nếu thư mục đã tồn tại
//     await fs.promises.access(folderPath, fs.constants.F_OK);
//     // Thư mục đã tồn tại
//   } catch (err) {
//     if (err.code === "ENOENT") {
//       // Thư mục không tồn tại, tiến hành tạo
//       await fs.promises.mkdir(folderPath, { recursive: true });
//     }
//   }
// }

// async function run() {
//   const listTags = [];
//   for (const tag of tags) {
//     try {
//       const { id, attributes } = tag;
//       const title = tag.attributes.title;
//       const imageObj = attributes?.image.data?.attributes;

//       if (!imageObj) {
//         listTags.push({
//           resourceId: id,
//           title: attributes.title,
//           type: attributes.type,
//         });
//         continue;
//       }

//       const thumbnailObj = imageObj.formats ? imageObj.formats.thumbnail : null;

//       const folderPath = path.join(__dirname, "uploads", "tags", title);

//       await checkAndCreateFolder(folderPath);
//       if (thumbnailObj) {
//         await downloadFile(thumbnailObj.url, folderPath);
//       }
//       await downloadFile(imageObj.url, folderPath);

//       const dataTag = {
//         resourceId: id,
//         title: attributes.title,
//         type: attributes.type,
//         image: {
//           filePath: `/uploads/tags/${title}/${imageObj.hash}${imageObj.ext}`,
//           width: imageObj.width,
//           height: imageObj.height,
//           hash: imageObj.hash,
//           ext: imageObj.ext,
//           mime: imageObj.mime,
//           size: imageObj.size,
//         },
//         thumbnail: thumbnailObj
//           ? {
//               filePath: `/uploads/tags/${title}/${thumbnailObj.hash}${thumbnailObj.ext}`,
//               width: thumbnailObj.width,
//               height: thumbnailObj.height,
//               hash: thumbnailObj.hash,
//               ext: thumbnailObj.ext,
//               mime: thumbnailObj.mime,
//               size: thumbnailObj.size,
//             }
//           : null,
//       };

//       listTags.push(dataTag);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   fs.writeFileSync("./tags_result.json", JSON.stringify(listTags));
// }

// const listWallpapers = _.filter(wallpapers, (wp) =>
//     _.some(
//       wp.attributes.wallpaper_tags.data,
//       (item) => item.attributes.title === title
//     )
//   );

//   for (const wallpaper of listWallpapers) {
//     const attributes = wallpaper.attributes.resource.data.attributes;
//     const isLive = wallpaper.attributes.live_resource.data ? true : false;
//     const attributesImage = attributes.formats.thumbnail;
//     const wallpaperData = {
//       path: `/uploads/${title}/${attributes.hash}${attributes.ext}`,
//       width: attributes.width,
//       height: attributes.height,
//       name: attributes.hash,
//       mime: attributes.mime,
//       size: attributes.size,
//       isLive,
//       thumbnail: {
//         width: attributesImage.width,
//         height: attributesImage.height,
//         name: attributesImage.hash,
//         mime: attributesImage.mime,
//         path: `/uploads/${title}/${attributesImage.hash}${attributesImage.ext}`,
//         ext: attributesImage.ext,
//         size: attributesImage.size,
//       },
//       tags: _.map(
//         wallpaper.attributes.wallpaper_tags.data,
//         (item) => item.attributes.title
//       ),
//     };
//     await downloadFile(attributes.url, folderPath);
//     await downloadFile(attributesImage.url, folderPath);
//     const lives = [];
//     if (isLive) {
//       const livesResource = wallpaper.attributes.live_resource.data;
//       for (const live of livesResource) {
//         const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i;
//         const domain = live.attributes.url.match(regex)[1];
//         const urlVideo = `${domain}/${live.attributes.provider_metadata.guid}/playlist.m3u8`;
//         const previewUrl = `${domain}/${live.attributes.provider_metadata.guid}/thumbnail.jpg`;
//         const animationPreview = `${domain}/${live.attributes.provider_metadata.guid}/thumbnail.jpg`;
//         lives.push({
//           urlVideo,
//           previewUrl,
//           animationPreview,
//         });
//       }
//     }

//     if (lives.length > 0) {
//       wallpaperData.lives = lives;
//     }

//     dataCategory.wallpapers.push(wallpaperData);
//   }

async function run() {
  for (const wallpaper of wallpapers) {
    const resource = wallpaper.attributes.resource.data;
    const liveResource = wallpaper.attributes.live_resource.data;
    const wallpaperTags = wallpaper.attributes.wallpaper_tags.data;
    

    // const attributes = wallpaper.attributes.resource.data.attributes;
    // const isLive = wallpaper.attributes.live_resource.data ? true : false;
    // const attributesImage = attributes.formats.thumbnail;
    // const wallpaperData = {
    //   path: `/uploads/${title}/${attributes.hash}${attributes.ext}`,
    //   width: attributes.width,
    //   height: attributes.height,
    //   name: attributes.hash,
    //   mime: attributes.mime,
    //   size: attributes.size,
    //   isLive,
    //   thumbnail: {
    //     width: attributesImage.width,
    //     height: attributesImage.height,
    //     name: attributesImage.hash,
    //     mime: attributesImage.mime,
    //     path: `/uploads/${title}/${attributesImage.hash}${attributesImage.ext}`,
    //     ext: attributesImage.ext,
    //     size: attributesImage.size,
    //   },
    //   tags: _.map(
    //     wallpaper.attributes.wallpaper_tags.data,
    //     (item) => item.attributes.title
    //   ),
    // };
    // await downloadFile(attributes.url, folderPath);
    // await downloadFile(attributesImage.url, folderPath);
    // const lives = [];
    // if (isLive) {
    //   const livesResource = wallpaper.attributes.live_resource.data;
    //   for (const live of livesResource) {
    //     const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i;
    //     const domain = live.attributes.url.match(regex)[1];
    //     const urlVideo = `${domain}/${live.attributes.provider_metadata.guid}/playlist.m3u8`;
    //     const previewUrl = `${domain}/${live.attributes.provider_metadata.guid}/thumbnail.jpg`;
    //     const animationPreview = `${domain}/${live.attributes.provider_metadata.guid}/thumbnail.jpg`;
    //     lives.push({
    //       urlVideo,
    //       previewUrl,
    //       animationPreview,
    //     });
    //   }
    // }

    // if (lives.length > 0) {
    //   wallpaperData.lives = lives;
    // }

    // dataCategory.wallpapers.push(wallpaperData);
  }
}

run();
