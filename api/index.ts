import Auth from "./auth";
import Task from "./task";
import Upload from "./upload"
import { submissionApi } from "./submission";

const api = {
  auth: Auth,
  task: Task,
  upload: Upload,
  submission: submissionApi,
};

export default api;
