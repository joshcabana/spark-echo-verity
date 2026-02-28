import { Link } from "react-router-dom";

interface VerityLogoProps {
  variant?: "full" | "icon";
  className?: string;
  linkTo?: string;
}

/**
 * Verity brand logo — inline SVG for perfect scaling.
 *
 * Brand colours:
 *   Deep navy  #1B2A4A  (light-mode V)
 *   Silver     #E8EBF0  (dark-mode V)
 *   Coral      #E85D35  (spark accent)
 *
 * The app is dark-themed, so the default V colour is silver/white.
 * If a light-mode toggle is ever added, swap fills via `dark:` classes.
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
      aria-label="Verity - Australian Speed-Dating"
      role="img"
    >
      {/* V shape */}
      <path
        d="M8 8L24 40L40 8"
        stroke="#E8EBF0"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="dark:stroke-[#E8EBF0] stroke-[#1B2A4A]"
      />
      {/* Coral-orange spark / dot accent */}
      <circle
        cx="38"
        cy="10"
        r="5"
        fill="#E85D35"
      />
    </svg>
  );

  if (variant === "icon") {
    return linkTo ? <Link to={linkTo} className="inline-flex">{icon}</Link> : icon;
  }

  /* ---------- full lockup (icon + VERITY text) ---------- */
  const full = (
    <svg
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "h-8 w-auto"}
      aria-label="Verity - Australian Speed-Dating"
      role="img"
    >
      {/* V shape */}
      <path
        d="M8 8L24 40L40 8"
        stroke="#E8EBF0"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="dark:stroke-[#E8EBF0] stroke-[#1B2A4A]"
      />
      {/* Coral-orange spark */}
      <circle
        cx="38"
        cy="10"
        r="5"
        fill="#E85D35"
      />
      {/* VERITY wordmark */}
      <text
        x="56"
        y="33"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="600"
        fontSize="22"
        letterSpacing="6"
        className="dark:fill-[#E8EBF0] fill-[#1B2A4A]"
        fill="#E8EBF0"
      >
        VERITY
      </text>
    </svg>
  );

  return linkTo ? <Link to={linkTo} className="inline-flex">{full}</Link> : full;
};

export default VerityLogo;
