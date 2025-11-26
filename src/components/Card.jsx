export default function Card({ title, subtitle, children, actions, className = '' }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
