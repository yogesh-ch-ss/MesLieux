import { useCallback, useReducer } from "react";

// formReducer is a reducer used with useReducer hook to manage the state of the form inputs.
// It handles the "INPUT_CHANGE" action type to update the state when an input value changes.
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          // if the property input is undefined, skip to the next property in for loop
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.fornIsValid,
      };

    default:
      return state;
  }
};

// useForm uses the useReducer hook to manage the form state.
// "formState" is the state managed by the "formReducer" containing inputs' values and validity status.
// "dispatch" is a function returned by "useReducer" that is used to dispatch actions to update the state.

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  // inputHandler is a memoized callback function using useCallback. It dispatches an "INPUT_CHANGE" action to update the form state with the provided input's id, value, and validity status.
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  // setFormData sets the initial value of the form.
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
