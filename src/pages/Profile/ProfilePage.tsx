import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { updateProfile } from '../../store/slices/authSlice'
import { fetchUserSkills, addSkill, removeSkill } from '../../store/slices/skillsSlice'
import { Skill } from '../../store/slices/skillsSlice'
import ClickSpark from '../../components/ClickSpark'
import { Plus, Upload, User } from 'lucide-react'
import { authAPI } from '../../api/auth'

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

  const [showAddOffered, setShowAddOffered] = useState(false)
  const [showAddWanted, setShowAddWanted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserSkills(user.id))
    }
  }, [dispatch, user?.id])

  const handleProfileUpdate = async () => {
    if (!user?.id) return;
    try {
      await dispatch(updateProfile({ userId: user.id!, profileData }))
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
        type: newSkill.type,
        isPublic: true
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      const result = await authAPI.uploadProfileImage(file)
      setProfileData({ ...profileData, profilePhoto: result.url })
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerateAvatar = () => {
    const avatarUrl = authAPI.generateAvatarUrl(profileData.firstName, profileData.lastName)
    setProfileData({ ...profileData, profilePhoto: avatarUrl })
  }

  const getProfileImageSrc = () => {
    if (profileData.profilePhoto) {
      return profileData.profilePhoto
    }
    // Generate avatar URL as fallback
    return authAPI.generateAvatarUrl(profileData.firstName, profileData.lastName)
  }

  const skillsOffered = userSkills.filter((skill: Skill) => skill.type === 'offered')
  const skillsWanted = userSkills.filter((skill: Skill) => skill.type === 'wanted')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400">Manage your profile and preferences</p>
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
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={getProfileImageSrc()}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="flex flex-col space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="btn-secondary text-sm flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateAvatar}
                    disabled={isUploading}
                    className="btn-secondary text-sm flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Generate Avatar</span>
                  </button>
                  <input
                    type="text"
                    placeholder="Or enter photo URL"
                    value={profileData.profilePhoto}
                    onChange={(e) => setProfileData({...profileData, profilePhoto: e.target.value})}
                    className="input-field text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
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
            <span className="ml-2 text-sm text-gray-300">Make my profile public</span>
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
        <h3 className="text-lg font-semibold text-white mb-4">Availability</h3>
        
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
            <span className="ml-2 text-sm text-gray-400">Weekends</span>
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
            <span className="ml-2 text-sm text-gray-400">Evenings</span>
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
            <span className="ml-2 text-sm text-gray-400">Weekdays</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
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
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">Skills I Can Offer
          <button
            className="ml-2 p-1 rounded hover:bg-[#232428] transition-colors"
            onClick={() => setShowAddOffered((v) => !v)}
            type="button"
            aria-label="Add Skill"
          >
            <Plus className="h-5 w-5 text-primary-500" />
          </button>
        </h3>
        <div className="space-y-4">
          {skillsOffered.map((skill: Skill) => (
            <div key={skill.id} className="flex items-center justify-between p-4 bg-[#232428] rounded-lg">
              <div>
                <h4 className="font-medium text-white">{skill.name}</h4>
                <p className="text-sm text-gray-400">{skill.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="skill-tag">{skill.category}</span>
                  <span className="text-xs text-gray-500 capitalize">{skill.proficiencyLevel}</span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          {showAddOffered && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-[#232428]">
              <h4 className="font-medium text-white mb-3">Add New Skill to Offer</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value, type: 'offered'})}
                  className="input-field"
                />
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value, type: 'offered'})}
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
                onChange={(e) => setNewSkill({...newSkill, description: e.target.value, type: 'offered'})}
                rows={2}
                className="input-field mt-2"
              />
              <div className="flex items-center space-x-4 mt-2">
                <select
                  value={newSkill.proficiencyLevel}
                  onChange={(e) => setNewSkill({...newSkill, proficiencyLevel: e.target.value as any, type: 'offered'})}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  onClick={async () => { await handleAddSkill(); setShowAddOffered(false); }}
                  disabled={!newSkill.name.trim()}
                  className="btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddOffered(false)}
                  className="btn-secondary"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">Skills I Want to Learn
          <button
            className="ml-2 p-1 rounded hover:bg-[#232428] transition-colors"
            onClick={() => setShowAddWanted((v) => !v)}
            type="button"
            aria-label="Add Skill"
          >
            <Plus className="h-5 w-5 text-primary-500" />
          </button>
        </h3>
        <div className="space-y-4">
          {skillsWanted.map((skill: Skill) => (
            <div key={skill.id} className="flex items-center justify-between p-4 bg-[#232428] rounded-lg">
              <div>
                <h4 className="font-medium text-white">{skill.name}</h4>
                <p className="text-sm text-gray-400">{skill.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="skill-tag">{skill.category}</span>
                  <span className="text-xs text-gray-500 capitalize">{skill.proficiencyLevel}</span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          {showAddWanted && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-[#232428]">
              <h4 className="font-medium text-white mb-3">Add Skill I Want to Learn</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value, type: 'wanted'})}
                  className="input-field"
                />
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value, type: 'wanted'})}
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
                onChange={(e) => setNewSkill({...newSkill, description: e.target.value, type: 'wanted'})}
                rows={2}
                className="input-field mt-2"
              />
              <div className="flex items-center space-x-4 mt-2">
                <select
                  value={newSkill.proficiencyLevel}
                  onChange={(e) => setNewSkill({...newSkill, proficiencyLevel: e.target.value as any, type: 'wanted'})}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  onClick={async () => { await handleAddSkill(); setShowAddWanted(false); }}
                  disabled={!newSkill.name.trim()}
                  className="btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddWanted(false)}
                  className="btn-secondary"
                  type="button"
                >
                  Cancel
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