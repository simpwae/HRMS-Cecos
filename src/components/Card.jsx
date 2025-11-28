export default function Card({ title, subtitle, children, actions, className = '' }) {
  return (
    <div className={`glass rounded-2xl p-6 card-hover ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-3">{actions}</div>}
        </div>
      )}
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
