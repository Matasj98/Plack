const initialState = {
  user: null,
  isLoading: true
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        isLoading: false
      };
    default:
      return state;
  }
};
