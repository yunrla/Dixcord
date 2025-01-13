const initialState = {
    states: false
  };
  
const statesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'INCREASE':
        return { ...state, states: true };
      case 'DECREASE':
        return { ...state, states: false };
      default:
        return state;
    }
};
  
export default statesReducer;
  