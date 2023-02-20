export function Navbar({ onNewSong }: { onNewSong: () => void }) {
  return (
    <nav className="py-4 bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">TuneSmith</span>
          </div>
          <div className="hidden md:block">
            <div
              onClick={onNewSong}
              className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md cursor-pointer hover:bg-gray-700 hover:text-white"
            >
              New Song
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
