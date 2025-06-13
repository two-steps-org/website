import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  type = 'button'
}) => {
  const baseStyles = "relative rounded-xl font-medium flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const sizeStyles = {
    sm: `
      px-3 xs:px-4 sm:px-5
      py-2 xs:py-2.5
      text-sm xs:text-base
      min-h-[40px] xs:min-h-[44px] sm:min-h-[48px]
      rounded-lg xs:rounded-xl
    `,
    md: `
      px-4 xs:px-5 sm:px-6
      py-2.5 xs:py-3
      text-base xs:text-lg
      min-h-[44px] xs:min-h-[48px] sm:min-h-[52px]
      rounded-xl
    `,
    lg: `
      px-5 xs:px-6 sm:px-8
      py-3 xs:py-3.5
      text-lg xs:text-xl
      min-h-[48px] xs:min-h-[52px] sm:min-h-[56px]
      rounded-2xl
    `
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-purple-500 
      text-white 
      shadow-lg shadow-purple-500/20
      hover:shadow-xl hover:shadow-purple-500/30
      hover:bg-[length:200%_200%]
      transition-all duration-500
    `,
    secondary: `
      bg-white/10 
      text-white 
      backdrop-blur-sm 
      hover:bg-white/20
      shadow-lg shadow-black/20
      hover:shadow-xl hover:shadow-black/30
      transition-all duration-300
    `,
    outline: `
      border border-gray-700 
      text-white 
      hover:border-blue-400 hover:bg-blue-500/10
      shadow-lg shadow-black/20
      hover:shadow-xl hover:shadow-black/30
      transition-all duration-300
    `,
    gradient: `
      bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 
      text-white 
      bg-[length:200%_100%] 
      hover:bg-[100%_0] 
      shadow-lg shadow-purple-500/20
      hover:shadow-xl hover:shadow-purple-500/30
      transition-all duration-500
    `
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 400
      }}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variants[variant]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin shadow-lg" />
        </div>
      )}

      {/* Content */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {Icon && iconPosition === 'left' && (
          <motion.div
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
        <span className="relative z-10">{children}</span>
        {Icon && iconPosition === 'right' && (
          <motion.div
            initial={{ x: 5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="group-hover:translate-x-1 transition-transform duration-500"
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
      </div>

      {/* Hover Effects */}
      <div className="
        absolute inset-0 
        rounded-xl opacity-0 
        group-hover:opacity-20 
        bg-gradient-to-r from-blue-400 to-purple-400 
        blur transition-all duration-500
        group-hover:scale-105
      " />
      
      {/* Shine Effect */}
      <div 
        className="
          absolute inset-0 
          -translate-x-full 
          group-hover:translate-x-full 
          transition-transform duration-1000 
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          opacity-0 group-hover:opacity-100
        "
        style={{ 
          WebkitMaskImage: 'linear-gradient(to right, transparent, white, transparent)'
        }}
      />
    </motion.button>
  );
};

export default Button;