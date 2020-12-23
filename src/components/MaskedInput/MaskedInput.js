import React from "react";
import MaskedInput from "react-maskedinput";
import { Input } from "reactstrap";

export default function MaskedControl(props) {
    return <Input tag={MaskedInput} {...props} />;
} 