import { RouteNotFoundError } from "../../src/errors";

const RouteNotFound = async (req, res) => {
  const error = new RouteNotFoundError(req)
  return res.status(error.status).json(error)
};

export default RouteNotFound;