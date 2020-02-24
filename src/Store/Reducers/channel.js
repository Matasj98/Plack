const initialState = {
  channel: null
};

export const channel = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHANNEL":
      return {
        ...state,
        channel: action.channel
      };

    default:
      return state;
  }
};
