import React, { useReducer, useEffect } from "react";

// validate are a bunch of validators
import { validate } from "../../util/validators";

import "./Input.css";

// Reducer function
// This function is a reducer that handles different actions related to the input state. 
// It manages the state of the input's value, validity, and whether it has been touched.
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state, // creating a copy of the old state - preserving it
        value: action.val,
        isValid: validate(action.val, action.validators),
      };

    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }

    default:
      return state;
  }
};

// Input is a component to create input forms
// Used in NewPlace

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  // The useEffect hook is used to update the parent component (passed via the onInput prop) whenever the input value, validity, or ID changes.
  // This effect is triggered to inform the parent about the input state.
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);


  // The changeHandler function is called when the input value changes. It dispatches an action to the reducer, indicating a value change, along with the new value and validation rules.
  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  // The touchHandler function is called when the input is touched.
  // It dispatches an action to mark the input as touched.
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  // Depending on the element prop passed to the component, the appropriate input element is rendered: either an input element or a textarea element.
  // The element's value and event handlers are set based on the state and the provided props.
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
