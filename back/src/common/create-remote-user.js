import request from "request";

export default function createRemoteUser(user, ignoreIP) {
  global.OTHER_IPS.map((ip) => {
    if (ip !== ignoreIP) {
      request.post(
        {
          url: `http://${ip}:${process.env.SERVER_PORT}/sync/register`,
          json: user,
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("sync register success");
          }
        }
      );
    }
  });
}
