import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {actions && <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">{actions}</div>}
      </div>
    </div>
  );
}
