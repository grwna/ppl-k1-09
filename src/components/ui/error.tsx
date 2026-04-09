

"use client"

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorComponent({
  title = "Something went wrong",
  message = "We couldn’t load the data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center w-full min-h-75 bg-[#F9FAFB] p-6">
      <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-md max-w-md w-full">

        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
          <span className="text-xl font-bold text-red-600">!</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-4">
          {message}
        </p>

        {/* Action */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md transition hover:opacity-90"
            style={{ backgroundColor: "#07B0C8" }} // your primary color
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}