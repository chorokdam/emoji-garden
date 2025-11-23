import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-8 py-3.5 rounded-full font-semibold text-[15px] transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Match the black 'App Open' button
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 border border-transparent",
    // Match secondary actions
    secondary: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-transparent",
    outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
