const fs = require("fs");
async function getListWallpaper(page, pageSize) {
  return new Promise((resolve, reject) => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://manage.wallpaperanime4k.com/api/wallpapers?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=resource,live_resource,wallpaper_tags`,
      headers: {
        host: "manage.wallpaperanime4k.com",
        accept: "application/json",
        os: "ios",
        "accept-encoding": "gzip, deflate, br",
        "app-version": "5.0.0.45",
        "user-agent": "Wallify/45 CFNetwork/1485 Darwin/23.1.0",
        "accept-language": "vi-VN,vi;q=0.9",
        authorization:
          "Bearer 4a6d38e820db2d8af79324a406ccf13730ef819ef6275d65504cc8249eb82d5dd7d28e0039e00c4dfe209bf127afbc9f8918c8718541f1ee831231a212f74acf997892e7e6a13f8fa4308c154528113c28bd470b36467343409f14098194daafb3b0eab689a78b76ee7d6b8d7948827a8e6f64574c703c22dd2994196ddd5738",
      },
    };

    axios
      .request(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function run() {
  const list = [];
  const wallpapersConfig = await getListWallpaper(1, 100);
  let pageCurrent = 1;
  const pageCount = wallpapersConfig.meta.pagination.pageCount;
  while (pageCurrent < pageCount) {
    console.log(`---- Start crawl ${pageCurrent}/${pageCount} ----`);
    try {
      const resWallpapers = await getListWallpaper(pageCurrent, 100);
      const data = resWallpapers.data;
      list.push(...data);
    } catch (error) {
        console.log(error)
    } finally {
      pageCurrent += 1;
    }
  }

  fs.writeFileSync("./wallpaper.json", JSON.stringify(list));
}

run();
