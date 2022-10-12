import React, { ButtonHTMLAttributes } from "react";

import "../styles/components/button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  disabled,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={variant === "primary" ? "primary_btn" : "secondary_btn"}
    >
      {children}
    </button>
  );
};

export default Button;
