
import api from "./api";

export const createReport = (payload) => { return api.post("/reports", payload) }
export const getMyReports = () => { return api.get("/reports/my-reports") };
export const getOwner = () => { return api.get("/reports/owners") }
