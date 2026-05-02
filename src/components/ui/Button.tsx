import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
}

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
  
  const variants = {
    primary: "bg-[#00D4AA] text-black hover:bg-[#00b38f] focus:ring-[#00D4AA]",
    danger: "bg-[#FF2D55] text-white hover:bg-[#e6284c] focus:ring-[#FF2D55]",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
