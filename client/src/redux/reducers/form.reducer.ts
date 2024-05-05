import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  name: "",
  description: "",
  modal: "",
  isOpen: false,
};

// export const actions = {
//   SET_NAME: "set_name",
//   SET_DESCRIPTION: "set_descripton",
//   SET_MODAL: "set_modal",
//   ADD_FORM: "add_form",
// };

// export const setDescription = (payload) => {
//   return {
//     type: actions.SET_DESCRIPTION,
//     payload,
//   };
// };

// export const setModal = (payload) => {
//   return {
//     type: actions.SET_MODAL,
//     payload,
//   };
// };

// export const formReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case actions.SET_NAME:
//       return {
//         ...state,
//         name: action.payload,
//       };
//     case actions.SET_DESCRIPTION:
//       return {
//         ...state,
//         description: action.payload,
//       };
//     case actions.SET_MODAL:
//       return {
//         ...state,
//         modal: action.payload.modal,
//         isOpen: action.payload.isOpen,
//       };
//     default:
//       throw new Error("Invalid action");
//   }
// };

const formReducer = createSlice({
  name: "formReducer",
  initialState,
  reducers: {
    // setFormData: (state, action) => {
    //   const questionFormLocal = JSON.parse(
    //     localStorage.getItem(QUESTIONFORM) || "{}"
    //   );

    //   state.title = action.payload.title;
    //   state.visibility = action.payload.visibility;
    //   state.thumbnail = action.payload.thumbnail;
    //   state.questions = action.payload.questions;

    //   localStorage.setItem(
    //     QUESTIONFORM,
    //     JSON.stringify({ ...questionFormLocal, ...action.payload })
    //   );
    // },
    setName: (state, action) => {
      return {
        ...state,
        name: action.payload,
      };
    },
    setDescription: (state, action) => {
      return {
        ...state,
        description: action.payload,
      };
    },
    setModal: (state, action) => {
      return {
        ...state,
        modal: action.payload.modal,
        isOpen: action.payload.isOpen,
      };
    },
  },
});

export default formReducer.reducer;
export const { setName, setDescription, setModal } = formReducer.actions;
