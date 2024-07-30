import request from "request";

export default function removeRemoteUser(id, ignoreIP) {
  global.OTHER_IPS.forEach((ip) => {
    if (ip !== ignoreIP) {
      request.delete(
        {
          url: `http://${ip}:${process.env.SERVER_PORT}/sync/delete/${id}`,
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("sync remove success");
          }
        }
      );
    }
  });
}
