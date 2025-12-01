import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ open, isOpen, onClose, title, children, actions, size = 'md' }) {
  // Support both 'open' and 'isOpen' props
  const isModalOpen = open || isOpen;

  if (!isModalOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size] || sizeClasses.md} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {actions && (
          <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end border-t">{actions}</div>
        )}
      </div>
    </div>
  );
}
