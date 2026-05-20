import { Link } from "react-router-dom";
import "./Button.css";

function Button({
  children,
  variant = "primary",
  full = false,
  to,
  onClick,
  type = "button",
  iconLeft,
  iconRight,
}) {
  const className = `
    btn 
    ${variant === "primary" ? "btnPrimary" : ""}
    ${variant === "secondary" ? "btnSecondary" : ""}
    ${variant === "danger" ? "btnDanger" : ""}
    ${variant === "text" ? "btnText" : ""}
    ${full ? "btnFull" : ""}
  `;

  const content = (
    <>
      {iconLeft && <img src={iconLeft} alt="" className="btnIcon" />}
      <span>{children}</span>
      {iconRight && <img src={iconRight} alt="" className="btnIcon" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {content}
    </button>
  );
}

export default Button;