export default function Button({ children, variant = 'primary', className = '', ...rest }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 ring-offset-2 transition shadow-sm';
  const variants = {
    primary: 'bg-[#800020] text-white hover:bg-[#660019] focus:ring-[#800020]',
    secondary: 'bg-[#001F3F] text-white hover:bg-[#001530] focus:ring-[#001F3F]',
    accent: 'bg-[#D4AF37] text-gray-900 hover:bg-[#C09F27] focus:ring-[#D4AF37]',
    outline: 'border-2 border-[#800020] hover:bg-[#800020]/10 text-[#800020] focus:ring-[#800020]',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
