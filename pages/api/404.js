import { RouteNotFoundError } from "../../src/errors";

const RouteNotFound = async (req, res) => {
  return res.status(404).json({
    ...RouteNotFoundError,
    route: req.url.indexOf('others') >= 0 ?
      req.url.substr(0, req.url.indexOf('others') -1) : req.url,
    method: req.method,
  });
};

export default RouteNotFound;