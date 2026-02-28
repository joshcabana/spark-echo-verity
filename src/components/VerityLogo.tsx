import { Link } from "react-router-dom";

interface VerityLogoProps {
  variant?: "full" | "icon";
  className?: string;
  linkTo?: string;
}

/**
 * Verity brand logo — inline SVG for perfect scaling.
 *
 * Brand colours (from spec sheet):
 *   Charcoal  #212121  (light-mode V + text)
 *   White     #F3F3F3  (dark-mode V + text)
 *   Gold      #D4AF37  (spark accent — always)
 */
const VerityLogo = ({
  variant = "full",
  className = "",
  linkTo = "/",
}: VerityLogoProps) => {
  /* ---------- icon only (V + spark) ---------- */
  const icon = (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={variant === "icon" ? className || "h-8 w-8" : "h-full w-auto"}
      aria-label="Verity — Australian Speed-Dating"
      role="img"
    >
      {/* V shape — uses currentColor so it follows theme */}
      <path
        d="M8 8L24 40L40 8"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gold spark / dot accent — always #D4AF37 */}
      <circle cx="38" cy="10" r="5" fill="#D4AF37" />
    </svg>
  );

  if (variant === "icon") {
    return linkTo ? (
      <Link to={linkTo} className="inline-flex text-foreground">
        {icon}
      </Link>
    ) : (
      icon
    );
  }

  /* ---------- full lockup (icon + VERITY text) ---------- */
  const full = (
    <svg
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "h-8 w-auto"}
      aria-label="Verity — Australian Speed-Dating"
      role="img"
    >
      {/* V shape */}
      <path
        d="M8 8L24 40L40 8"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gold spark */}
      <circle cx="38" cy="10" r="5" fill="#D4AF37" />
      {/* VERITY wordmark */}
      <text
        x="56"
        y="33"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="600"
        fontSize="22"
        letterSpacing="6"
        fill="currentColor"
      >
        VERITY
      </text>
    </svg>
  );

  return linkTo ? (
    <Link to={linkTo} className="inline-flex text-foreground">
      {full}
    </Link>
  ) : (
    full
  );
};

export default VerityLogo;
