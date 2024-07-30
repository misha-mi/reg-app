import request from "request";

export default function createRemoteUser(user) {
  global.OTHER_IPS.map((ip) => {
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
  });
}
