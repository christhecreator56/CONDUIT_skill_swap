import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchSkillListings, setSearchFilters, clearSearchFilters, sendSwapRequest } from '../../store/slices/skillsSlice'
import { SkillListing } from '../../store/slices/skillsSlice'
import ClickSpark from '../../components/ClickSpark'

const BrowsePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { skillListings, searchResults, categories, isLoading, searchFilters } = useSelector((state: RootState) => state.skills)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<SkillListing | null>(null)
  const [swapMessage, setSwapMessage] = useState('')

  useEffect(() => {
    dispatch(fetchSkillListings())
  }, [dispatch])

  useEffect(() => {
    // Filter results based on search term
    if (searchTerm.trim()) {
      const filtered = skillListings.filter(listing => 
        listing.skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // TODO: Update search results in store
    }
  }, [searchTerm, skillListings])

  const handleSearch = () => {
    dispatch(fetchSkillListings({
      category: searchFilters.category,
      location: searchFilters.location
    }))
  }

  const handleClearFilters = () => {
    dispatch(clearSearchFilters())
    setSearchTerm('')
  }

  const handleRequestSwap = async (skillListing: SkillListing) => {
    if (!user) return
    
    try {
      // Find a skill that the current user can offer
      // For now, we'll use a mock skill
      await dispatch(sendSwapRequest({
        skillOfferedId: 'mock-offered-skill',
        skillRequestedId: skillListing.skill.id,
        message: swapMessage
      }))
      setSelectedSkill(null)
      setSwapMessage('')
    } catch (error) {
      console.error('Failed to send swap request:', error)
    }
  }

  const filteredListings = searchTerm.trim() 
    ? skillListings.filter(listing => 
        listing.skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : skillListings

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Skills</h1>
        <p className="text-gray-600">Discover skills available for exchange</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search skills (e.g., Photoshop, Excel, Guitar)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <ClickSpark
            sparkColor="#6b7280"
            sparkSize={6}
            sparkRadius={15}
            sparkCount={4}
            duration={300}
          >
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </ClickSpark>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={searchFilters.category}
                  onChange={(e) => dispatch(setSearchFilters({ category: e.target.value }))}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiency Level
                </label>
                <select
                  value={searchFilters.proficiencyLevel}
                  onChange={(e) => dispatch(setSearchFilters({ proficiencyLevel: e.target.value }))}
                  className="input-field"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={searchFilters.location}
                  onChange={(e) => dispatch(setSearchFilters({ location: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSearch}
                className="btn-primary"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="btn-secondary"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredListings.length} skill{filteredListings.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading skills...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No skills found matching your criteria.</p>
            <button
              onClick={handleClearFilters}
              className="btn-primary mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ClickSpark
                key={listing.id}
                sparkColor="#fff" // high-contrast white
                sparkSize={8}
                sparkRadius={20}
                sparkCount={6}
                duration={500}
                extraScale={1.2}
              >
                <div className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={listing.user.profilePhoto || 'https://via.placeholder.com/50x50?text=No+Photo'}
                      alt={listing.user.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {listing.user.firstName} {listing.user.lastName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">{listing.user.rating}</span>
                        </div>
                      </div>
                      {listing.user.location && (
                        <p className="text-sm text-gray-500">{listing.user.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{listing.skill.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{listing.skill.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="skill-tag">{listing.skill.category}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {listing.skill.proficiencyLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${listing.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {listing.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={() => setSelectedSkill(listing)}
                        disabled={!listing.isAvailable}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Request Swap
                      </button>
                    </div>
                  </div>
                </div>
              </ClickSpark>
            ))}
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Skill Swap
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                You're requesting to learn <strong>{selectedSkill.skill.name}</strong> from{' '}
                <strong>{selectedSkill.user.firstName} {selectedSkill.user.lastName}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                placeholder="Introduce yourself and explain what you'd like to learn..."
                rows={3}
                className="input-field"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedSkill(null)
                  setSwapMessage('')
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestSwap(selectedSkill)}
                className="btn-primary flex-1"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowsePage 