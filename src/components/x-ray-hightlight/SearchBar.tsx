import React from 'react'
import { Search, X } from 'lucide-react'
import { Patient } from './types'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: () => void
  clearSearch: () => void
  isLoading: boolean
  selectedPatient: Patient | null
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  clearSearch,
  isLoading,
  selectedPatient
}) => {
  return (
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Enter Patient ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        disabled={isLoading}
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 disabled:opacity-50"
      >
        {isLoading ? 'Searching...' : (
          <>
            <Search className="w-4 h-4" />
            Search
          </>
        )}
      </button>
      {selectedPatient && (
        <button
          onClick={clearSearch}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  )
}
