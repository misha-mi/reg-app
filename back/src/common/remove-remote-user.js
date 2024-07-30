import request from "request";

export default function removeRemoteUser(id) {
  global.OTHER_IPS.forEach((ip) => {
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
  });
}
