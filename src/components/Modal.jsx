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
    full: 'max-w-[95vw] lg:max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full ${sizeClasses[size] || sizeClasses.md} max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-white shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end border-t shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
