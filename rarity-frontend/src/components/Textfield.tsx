import React from "react";
import { ErrorMessage, Field } from "formik";

interface textfieldprops {
  label: string;
  name: string;
  as?: string;
  type?: string;
  description?: string;
}

const Textfield: React.FC<textfieldprops> = ({
  label,
  name,
  type = "text",
  description,
  as,
  ...rest
}) => {
  return (
    <div className="form_group">
      <label htmlFor={name}>{label}</label>
      {description && <p>{description}</p>}
      <Field name={name} type={type} {...rest} />
      <ErrorMessage name={name} component="div" className="error_input" />
    </div>
  );
};

export default Textfield;
