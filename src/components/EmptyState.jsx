export default function EmptyState({ icon: Icon, title, subtitle, description, action }) {
  // Support both 'subtitle' and 'description' props
  const desc = subtitle || description;

  // Check if Icon is a valid React component (function or forwardRef object)
  const isValidComponent = Icon && (typeof Icon === 'function' || Icon.$$typeof);

  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-400">
          {isValidComponent ? <Icon className="h-12 w-12" /> : Icon}
        </div>
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
