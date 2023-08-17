import React from "react";

import Input from "../../shared/components/FormElements/Input";

import './NewPlace.css';

// NewPlace is used to add the new place using a form.
// Input component is used as a form 

const NewPlace = () => {
    return <form className="place-form">
        <Input element="imput" type="text" label="Title" />
    </form>;
};

export default NewPlace;