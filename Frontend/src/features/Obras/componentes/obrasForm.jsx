

export default function ObrasForm({isOpen, onClose, title, children})
{
    if(!isOpen) return null

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-blue-50">
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
                        aria-label="Cerrar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}