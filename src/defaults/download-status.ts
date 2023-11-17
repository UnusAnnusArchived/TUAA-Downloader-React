import { StatusObject } from "types";

const defaultStatus: StatusObject = {
  finished: false,
  error: false,
  status: "Initializing download...",
  downloaded: {
    current: 0,
    max: 0,
    displayType: "bytes",
  },
  currentItem: {
    status: "Initializing download...",
    downloaded: {
      current: 0,
      max: 1,
      displayType: "percent",
    },
  },
};

export default defaultStatus;
