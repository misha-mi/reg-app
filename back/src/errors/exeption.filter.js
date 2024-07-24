import { HTTPError } from "./http-error.class.js";

export class ExeptionFilter {
  constructor(logger) {
    this.logger = logger;
  }
  catch(err, req, res, next) {
    if (err instanceof HTTPError) {
      this.logger.error({
        context: err.context,
        desc: `Error ${err.statusCode}: ${err.message}`,
      });
      res.status(err.statusCode).send({ error: err.message });
    } else {
      this.logger.error({
        context: "some error",
        desc: err.message,
      });
      console.log(err);
      res.status(500).send({ error: err.message });
    }
  }
}
