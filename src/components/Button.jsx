export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary:
      'bg-linear-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] text-white hover:shadow-lg hover:shadow-[hsl(var(--color-primary)/0.3)] border border-transparent',
    secondary:
      'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-xs',
    outline:
      'bg-transparent border border-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary)/0.05)]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-red-200',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
