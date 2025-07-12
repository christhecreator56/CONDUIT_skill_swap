import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { updateProfile } from '../../store/slices/authSlice'
import { fetchUserSkills, addSkill, removeSkill } from '../../store/slices/skillsSlice'
import { Skill } from '../../store/slices/skillsSlice'
import ClickSpark from '../../components/ClickSpark'

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isLoading } = useSelector((state: RootState) => state.auth)
  const { userSkills } = useSelector((state: RootState) => state.skills)
  
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profilePhoto: user?.profilePhoto || '',
    isPublic: user?.isPublic ?? true,
    availability: {
      weekends: true,
      evenings: true,
      weekdays: false,
      custom: ''
    }
  })
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    category: '',
    proficiencyLevel: 'intermediate' as const,
    type: 'offered' as 'offered' | 'wanted'
  })

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserSkills(user.id))
    }
  }, [dispatch, user?.id])

  const handleProfileUpdate = async () => {
    try {
      await dispatch(updateProfile(profileData))
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleAddSkill = async () => {
    if (!newSkill.name.trim() || !user?.id) return
    
    try {
      await dispatch(addSkill({
        name: newSkill.name,
        description: newSkill.description,
        category: newSkill.category,
        proficiencyLevel: newSkill.proficiencyLevel,
        userId: user.id,
        type: newSkill.type
      }))
      setNewSkill({
        name: '',
        description: '',
        category: '',
        proficiencyLevel: 'intermediate',
        type: 'offered'
      })
    } catch (error) {
      console.error('Failed to add skill:', error)
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await dispatch(removeSkill(skillId))
    } catch (error) {
      console.error('Failed to remove skill:', error)
    }
  }

  const skillsOffered = userSkills.filter((skill: Skill) => skill.type === 'offered')
  const skillsWanted = userSkills.filter((skill: Skill) => skill.type === 'wanted')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
        <ClickSpark
          sparkColor="#3b82f6"
          sparkSize={8}
          sparkRadius={20}
          sparkCount={6}
          duration={400}
        >
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </ClickSpark>
      </div>

      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={profileData.profilePhoto || 'https://via.placeholder.com/100x100?text=No+Photo'}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              {isEditing && (
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={profileData.profilePhoto}
                  onChange={(e) => setProfileData({...profileData, profilePhoto: e.target.value})}
                  className="input-field"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                disabled={!isEditing}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
            disabled={!isEditing}
            placeholder="e.g., New York, NY"
            className="input-field"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            disabled={!isEditing}
            rows={3}
            placeholder="Tell others about yourself..."
            className="input-field"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={profileData.isPublic}
              onChange={(e) => setProfileData({...profileData, isPublic: e.target.checked})}
              disabled={!isEditing}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Make my profile public</span>
          </label>
        </div>

        {isEditing && (
          <div className="mt-6">
            <button
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={profileData.availability.weekends}
              onChange={(e) => setProfileData({
                ...profileData,
                availability: {...profileData.availability, weekends: e.target.checked}
              })}
              disabled={!isEditing}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Weekends</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={profileData.availability.evenings}
              onChange={(e) => setProfileData({
                ...profileData,
                availability: {...profileData.availability, evenings: e.target.checked}
              })}
              disabled={!isEditing}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Evenings</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={profileData.availability.weekdays}
              onChange={(e) => setProfileData({
                ...profileData,
                availability: {...profileData.availability, weekdays: e.target.checked}
              })}
              disabled={!isEditing}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Weekdays</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Availability
          </label>
          <input
            type="text"
            value={profileData.availability.custom}
            onChange={(e) => setProfileData({
              ...profileData,
              availability: {...profileData.availability, custom: e.target.value}
            })}
            disabled={!isEditing}
            placeholder="e.g., Monday and Wednesday afternoons"
            className="input-field"
          />
        </div>
      </div>

      {/* Skills Offered */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Can Offer</h3>
        
        <div className="space-y-4">
          {skillsOffered.map((skill: Skill) => (
            <div key={skill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                <p className="text-sm text-gray-600">{skill.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="skill-tag">{skill.category}</span>
                  <span className="text-xs text-gray-500 capitalize">{skill.proficiencyLevel}</span>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Add New Skill to Offer</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  className="input-field"
                />
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Technology">Technology</option>
                  <option value="Language">Language</option>
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                rows={2}
                className="input-field mt-2"
              />
              <div className="flex items-center space-x-4 mt-2">
                <select
                  value={newSkill.proficiencyLevel}
                  onChange={(e) => setNewSkill({...newSkill, proficiencyLevel: e.target.value as any})}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.name.trim()}
                  className="btn-primary"
                >
                  Add Skill
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
        
        <div className="space-y-4">
          {skillsWanted.map((skill: Skill) => (
            <div key={skill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                <p className="text-sm text-gray-600">{skill.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="skill-tag">{skill.category}</span>
                  <span className="text-xs text-gray-500 capitalize">{skill.proficiencyLevel}</span>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Add Skill I Want to Learn</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  className="input-field"
                />
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Technology">Technology</option>
                  <option value="Language">Language</option>
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                rows={2}
                className="input-field mt-2"
              />
              <div className="flex items-center space-x-4 mt-2">
                <select
                  value={newSkill.proficiencyLevel}
                  onChange={(e) => setNewSkill({...newSkill, proficiencyLevel: e.target.value as any})}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  onClick={() => {
                    setNewSkill({...newSkill, type: 'wanted'})
                    handleAddSkill()
                  }}
                  disabled={!newSkill.name.trim()}
                  className="btn-primary"
                >
                  Add Skill
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 