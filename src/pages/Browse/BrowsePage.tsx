import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchSkillListings, setSearchFilters, clearSearchFilters, fetchUserSkills } from '../../store/slices/skillsSlice'
import { sendSwapRequest } from '../../store/slices/swapsSlice'
import { SkillListing } from '../../store/slices/skillsSlice'
import ClickSpark from '../../components/ClickSpark'
import { authAPI } from '../../api/auth'

const BrowsePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { skillListings, categories, isLoading, searchFilters } = useSelector((state: RootState) => state.skills) as import('../../store/slices/skillsSlice').SkillsState;
  const { user } = useSelector((state: RootState) => state.auth)
  const { userSkills } = useSelector((state: RootState) => state.skills)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<SkillListing | null>(null)
  const [swapMessage, setSwapMessage] = useState('')
  const [selectedOfferedSkillId, setSelectedOfferedSkillId] = useState<string>('')

  useEffect(() => {
    dispatch(fetchSkillListings())
    const interval = setInterval(() => {
      dispatch(fetchSkillListings())
    }, 900000) // 15 minutes
    // Fetch user skills if logged in
    if (user && user.id) {
      dispatch(fetchUserSkills(user.id))
    }
    return () => clearInterval(interval)
  }, [dispatch, user])

  // Auto-apply filters when they change
  useEffect(() => {
    const filters = {
      category: searchFilters.category,
      proficiencyLevel: searchFilters.proficiencyLevel,
      location: searchFilters.location,
      search: searchTerm
    };
    dispatch(fetchSkillListings(filters))
  }, [searchFilters, searchTerm, dispatch])

  const handleSearch = () => {
    const filters = {
      category: searchFilters.category,
      proficiencyLevel: searchFilters.proficiencyLevel,
      location: searchFilters.location,
      search: searchTerm
    };
    dispatch(fetchSkillListings(filters))
  }

  const handleClearFilters = () => {
    dispatch(clearSearchFilters())
    setSearchTerm('')
    dispatch(fetchSkillListings())
  }

  const handleRequestSwap = async () => {
    if (!user || !selectedSkill || !selectedOfferedSkillId) return
    try {
      await dispatch(sendSwapRequest({
        skillOfferedId: selectedOfferedSkillId,
        skillRequestedId: selectedSkill.skill.id,
        message: swapMessage
      }))
      setSelectedSkill(null)
      setSwapMessage('')
      setSelectedOfferedSkillId('')
    } catch (error) {
      console.error('Failed to send swap request:', error)
    }
  }

  // Apply filters locally for immediate feedback
  const filteredListings = skillListings.filter((listing: SkillListing) => {
    // Search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        listing.skill.name.toLowerCase().includes(searchLower) ||
        listing.skill.description.toLowerCase().includes(searchLower) ||
        listing.skill.category.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (searchFilters.category && listing.skill.category !== searchFilters.category) {
      return false;
    }
    
    // Proficiency level filter
    if (searchFilters.proficiencyLevel && listing.skill.proficiencyLevel !== searchFilters.proficiencyLevel) {
      return false;
    }
    
    // Location filter
    if (searchFilters.location && listing.user.location) {
      const locationLower = searchFilters.location.toLowerCase();
      const userLocationLower = listing.user.location.toLowerCase();
      if (!userLocationLower.includes(locationLower)) {
        return false;
      }
    }
    
    return true;
  })

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Browse Skills</h1>
        <p className="text-gray-400 text-sm sm:text-base">Discover skills available for exchange</p>
      </div>

      {/* Search and Filters */}
      <div className="card p-3 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search skills (e.g., Photoshop, Excel, Guitar)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full text-base sm:text-sm"
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
              className="btn-secondary w-full sm:w-auto py-3 sm:py-2 text-base sm:text-sm"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </ClickSpark>
        </div>

        {showFilters && (
          <div className="mt-4 p-3 sm:p-4 bg-[#232428] rounded-lg">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
                <select
                  value={searchFilters.category}
                  onChange={(e) => dispatch(setSearchFilters({ category: e.target.value }))}
                  className="input-field w-full bg-[#232428] text-white border-gray-600 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Proficiency Level</label>
                <select
                  value={searchFilters.proficiencyLevel}
                  onChange={(e) => dispatch(setSearchFilters({ proficiencyLevel: e.target.value }))}
                  className="input-field w-full bg-[#232428] text-white border-gray-600 focus:border-primary-500"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={searchFilters.location}
                  onChange={(e) => dispatch(setSearchFilters({ location: e.target.value }))}
                  className="input-field w-full bg-[#232428] text-white border-gray-600 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={handleSearch}
                className="btn-primary w-full sm:w-auto py-3 sm:py-2 text-base sm:text-sm"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="btn-secondary w-full sm:w-auto py-3 sm:py-2 text-base sm:text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-white">
            {filteredListings.length} skill{filteredListings.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading skills...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No skills found matching your criteria.</p>
            <button
              onClick={handleClearFilters}
              className="btn-primary w-full mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredListings.map((listing: SkillListing) => (
              <ClickSpark
                key={listing.id}
                sparkColor="#fff"
                sparkSize={8}
                sparkRadius={20}
                sparkCount={6}
                duration={500}
                extraScale={1.2}
              >
                <div className="card hover:shadow-md transition-shadow p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:space-x-4 gap-2 sm:gap-0">
                    <img
                      src={listing.user.profilePhoto || authAPI.generateAvatarUrl(listing.user.firstName, listing.user.lastName)}
                      alt={listing.user.firstName}
                      className="w-12 h-12 rounded-full object-cover mx-auto sm:mx-0"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
                        <h3 className="font-medium text-white text-base sm:text-lg">
                          {listing.user.firstName} {listing.user.lastName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-400">{listing.user.rating}</span>
                        </div>
                      </div>
                      {listing.user.location && (
                        <p className="text-xs sm:text-sm text-gray-500">{listing.user.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <h4 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">{listing.skill.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">{listing.skill.description}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
                      <span className="skill-tag text-xs sm:text-sm">{listing.skill.category}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {listing.skill.proficiencyLevel}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                      <span className={`text-xs sm:text-sm ${listing.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {listing.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={() => setSelectedSkill(listing)}
                        disabled={!listing.isAvailable}
                        className="btn-primary w-full sm:w-auto text-base sm:text-sm py-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-xs w-full sm:max-w-md">
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
                Which of your skills will you offer?
              </label>
              <select
                value={selectedOfferedSkillId}
                onChange={e => setSelectedOfferedSkillId(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Select a skill to offer</option>
                {userSkills.filter(s => s.type === 'offered').map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.category})
                  </option>
                ))}
              </select>
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
                className="input-field w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setSelectedSkill(null)
                  setSwapMessage('')
                  setSelectedOfferedSkillId('')
                }}
                className="btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSwap}
                className="btn-primary w-full sm:w-auto"
                disabled={!selectedOfferedSkillId}
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