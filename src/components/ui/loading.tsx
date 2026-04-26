"use client"

export default function LoadingPageComponent() {
  return (
    <div className="flex flex-col w-full h-fit bg-[#F9FAFB] p-4 gap-4 animate-pulse">

      {/* Navbar */}
      <div className="w-full h-12 bg-gray-200 rounded-xl" />

      {/* Summary Cards */}
      <div className="flex gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md w-full"
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="w-24 h-3 bg-gray-200 rounded" />
              <div className="w-32 h-6 bg-gray-300 rounded" />
              <div className="w-20 h-3 bg-gray-200 rounded" />
            </div>

            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <div className="w-48 h-4 bg-gray-300 rounded mb-2" />
        <div className="w-64 h-3 bg-gray-200 rounded mb-4" />

        <div className="w-full h-75 bg-gray-200 rounded-xl" />
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <div className="w-48 h-4 bg-gray-300 rounded mb-2" />
        <div className="w-64 h-3 bg-gray-200 rounded mb-4" />

        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center py-3 border-b last:border-none"
          >
            <div className="w-1/2 h-3 bg-gray-200 rounded" />
            <div className="w-24 h-3 bg-gray-200 rounded" />
            <div className="w-20 h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}