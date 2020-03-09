const initialState = {
  channel: null,
  isPrivate: false
};

export const channel = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHANNEL":
      return {
        ...state,
        channel: action.channel,
        isPrivate: action.isPrivate
      };
    default:
      return state;
  }
};
