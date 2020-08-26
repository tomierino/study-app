import { FETCH_UNIT } from "../actions/types";

const initialState = null;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_UNIT:
      return payload;
    default:
      return state;
  }
};
