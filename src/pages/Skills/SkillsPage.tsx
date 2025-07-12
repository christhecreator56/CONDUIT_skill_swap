import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import type { Skill } from '../../store/slices/skillsSlice'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Plus, Trash2, Edit, Check, X } from 'lucide-react'
import Stepper from "../../components/Stepper";
import { Step } from "../../components/Stepper";
import { addSkill, fetchUserSkills } from '../../store/slices/skillsSlice'
import { skillService } from '../../services/database'

type SkillFormData = {
  name: string
  description: string
  category: string
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  isPublic: boolean
}

const SkillsPage = () => {
  const dispatch = useDispatch()
  const { userSkills, isLoading } = useSelector((state: RootState) => state.skills)
  const { user } = useSelector((state: RootState) => state.auth)
  const offeredSkills: Skill[] = userSkills.filter((s: Skill) => s.type === 'offered')
  const [updating, setUpdating] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<SkillFormData>({
    name: '',
    description: '',
    category: '',
    proficiencyLevel: 'beginner',
    isPublic: true,
  })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<SkillFormData>({
    name: '',
    description: '',
    category: '',
    proficiencyLevel: 'beginner',
    isPublic: true,
  })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Tutorial state for first-time users
  const [tutorialSkill, setTutorialSkill] = useState<SkillFormData>({
    name: '',
    description: '',
    category: '',
    proficiencyLevel: 'beginner',
    isPublic: true,
  })
  const [showTutorial, setShowTutorial] = useState(false)

  // Load user skills on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserSkills(user.id) as any)
    }
  }, [dispatch, user?.id])

  // Show tutorial if no skills
  useEffect(() => {
    if (offeredSkills.length === 0) setShowTutorial(true)
    else setShowTutorial(false)
  }, [offeredSkills.length])

  const handleTutorialComplete = async () => {
    if (!user?.id) return
    
    try {
      await dispatch(addSkill({
        name: tutorialSkill.name,
        description: tutorialSkill.description,
        category: tutorialSkill.category,
        proficiencyLevel: tutorialSkill.proficiencyLevel,
        userId: user.id,
        type: 'offered',
        isPublic: tutorialSkill.isPublic,
      }) as any)
      
      setShowTutorial(false)
      setTutorialSkill({ name: '', description: '', category: '', proficiencyLevel: 'beginner', isPublic: true })
    } catch (error) {
      console.error('Failed to add tutorial skill:', error)
    }
  }

  // Update skill visibility using database service
  const handleToggleVisibility = async (skill: Skill) => {
    setUpdating(skill.id)
    try {
      await skillService.update(skill.id, { isPublic: !skill.isPublic })
      // Refresh user skills after update
      if (user?.id) {
        dispatch(fetchUserSkills(user.id) as any)
      }
    } catch (error) {
      console.error('Failed to toggle skill visibility:', error)
    } finally {
      setTimeout(() => setUpdating(null), 500)
    }
  }

  const handleAddSkill = async () => {
    if (!addForm.name.trim() || !user?.id) return
    
    try {
      await dispatch(addSkill({
        name: addForm.name,
        description: addForm.description,
        category: addForm.category,
        proficiencyLevel: addForm.proficiencyLevel,
        userId: user.id,
        type: 'offered',
        isPublic: addForm.isPublic,
      }) as any)
      
      setAddForm({ name: '', description: '', category: '', proficiencyLevel: 'beginner', isPublic: true })
      setShowAdd(false)
    } catch (error) {
      console.error('Failed to add skill:', error)
    }
  }

  const handleEditSkill = (skill: Skill) => {
    setEditId(skill.id)
    setEditForm({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      proficiencyLevel: skill.proficiencyLevel,
      isPublic: skill.isPublic,
    })
  }

  const handleSaveEdit = async (skill: Skill) => {
    try {
      await skillService.update(skill.id, editForm)
      // Refresh user skills after update
      if (user?.id) {
        dispatch(fetchUserSkills(user.id) as any)
      }
      setEditId(null)
    } catch (error) {
      console.error('Failed to update skill:', error)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await skillService.delete(skillId)
      // Refresh user skills after delete
      if (user?.id) {
        dispatch(fetchUserSkills(user.id) as any)
      }
      setDeleteId(null)
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  return (
    <div className="space-y-6">
      {showTutorial ? (
        <Stepper onFinalStepCompleted={handleTutorialComplete}>
          <Step>
            <h2 className="text-xl font-bold mb-2 text-white">Welcome to My Skills!</h2>
            <p className="text-gray-300 mb-4">Let's add your first skill. This quick tutorial will guide you step by step.</p>
          </Step>
          <Step>
            <h3 className="text-lg font-semibold text-white mb-2">Skill Name</h3>
            <input
              type="text"
              placeholder="e.g., React Development"
              value={tutorialSkill.name}
              onChange={e => setTutorialSkill(f => ({ ...f, name: e.target.value }))}
              className="input-field"
              autoFocus
            />
          </Step>
          <Step>
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <textarea
              placeholder="Describe your skill..."
              value={tutorialSkill.description}
              onChange={e => setTutorialSkill(f => ({ ...f, description: e.target.value }))}
              className="input-field"
              rows={2}
            />
          </Step>
          <Step>
            <h3 className="text-lg font-semibold text-white mb-2">Category</h3>
            <select
              value={tutorialSkill.category}
              onChange={e => setTutorialSkill(f => ({ ...f, category: e.target.value }))}
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
          </Step>
          <Step>
            <h3 className="text-lg font-semibold text-white mb-2">Proficiency Level</h3>
            <select
              value={tutorialSkill.proficiencyLevel}
              onChange={e => setTutorialSkill(f => ({ ...f, proficiencyLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' }))}
              className="input-field"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </Step>
          <Step>
            <h3 className="text-lg font-semibold text-white mb-2">Visibility</h3>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={tutorialSkill.isPublic}
                onChange={e => setTutorialSkill(f => ({ ...f, isPublic: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Make this skill public
            </label>
            <p className="text-xs text-gray-400 mt-2">Public skills are visible to others. You can change this later.</p>
          </Step>
          <Step>
            <h3 className="text-lg font-semibold text-white mb-2">Review</h3>
            <div className="bg-[#232428] rounded-lg p-4 mb-4">
              <div className="mb-2"><span className="font-bold text-white">Name:</span> <span className="text-gray-200">{tutorialSkill.name}</span></div>
              <div className="mb-2"><span className="font-bold text-white">Description:</span> <span className="text-gray-200">{tutorialSkill.description}</span></div>
              <div className="mb-2"><span className="font-bold text-white">Category:</span> <span className="text-gray-200">{tutorialSkill.category}</span></div>
              <div className="mb-2"><span className="font-bold text-white">Proficiency:</span> <span className="text-gray-200">{tutorialSkill.proficiencyLevel}</span></div>
              <div><span className="font-bold text-white">Visibility:</span> <span className="text-gray-200">{tutorialSkill.isPublic ? 'Public' : 'Private'}</span></div>
            </div>
            <p className="text-gray-300">Click <span className="font-bold text-primary-400">Complete</span> to add your skill!</p>
          </Step>
        </Stepper>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">My Skills</h1>
              <p className="text-gray-400">Manage the skills you offer for exchange and control their visibility</p>
            </div>
            <button
              className="flex items-center px-3 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              onClick={() => setShowAdd((v) => !v)}
            >
              <Plus className="h-5 w-5 mr-1" /> Add Skill
            </button>
          </div>
          {showAdd && (
            <div className="card mb-4 bg-[#232428] p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Add New Skill</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                />
                <select
                  value={addForm.category}
                  onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
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
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="input-field mt-2"
              />
              <div className="flex items-center space-x-4 mt-2">
                <select
                  value={addForm.proficiencyLevel}
                  onChange={e => setAddForm(f => ({ ...f, proficiencyLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' }))}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={addForm.isPublic}
                    onChange={e => setAddForm(f => ({ ...f, isPublic: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  Public
                </label>
                <button
                  onClick={handleAddSkill}
                  disabled={!addForm.name.trim() || !user?.id}
                  className="btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="btn-secondary"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Skill Management</h3>
            {isLoading ? (
              <p className="text-gray-400">Loading skills...</p>
            ) : offeredSkills.length === 0 ? (
              <p className="text-gray-400">You have not added any skills yet.</p>
            ) : (
              <div className="space-y-4">
                {offeredSkills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-4 bg-[#232428] rounded-lg">
                    {editId === skill.id ? (
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="input-field"
                          />
                          <select
                            value={editForm.category}
                            onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
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
                          value={editForm.description}
                          onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                          rows={2}
                          className="input-field mb-2"
                        />
                        <div className="flex items-center space-x-4 mb-2">
                          <select
                            value={editForm.proficiencyLevel}
                            onChange={e => setEditForm(f => ({ ...f, proficiencyLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' }))}
                            className="input-field"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                          <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                              type="checkbox"
                              checked={editForm.isPublic}
                              onChange={e => setEditForm(f => ({ ...f, isPublic: e.target.checked }))}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            Public
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(skill)}
                            className="btn-primary flex items-center"
                          >
                            <Check className="h-4 w-4 mr-1" /> Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="btn-secondary flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <h4 className="font-medium text-white flex items-center gap-2">
                            {skill.name}
                            {skill.isPublic ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-700 text-white ml-2">
                                <Eye className="h-4 w-4 mr-1" /> Public
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300 ml-2">
                                <EyeOff className="h-4 w-4 mr-1" /> Private
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-400">{skill.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="skill-tag">{skill.category}</span>
                            <span className="text-xs text-gray-500 capitalize">{skill.proficiencyLevel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            className={`flex items-center px-3 py-1 rounded transition-colors text-sm font-medium focus:outline-none ${skill.isPublic ? 'bg-green-800 text-white hover:bg-green-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} ${updating === skill.id ? 'opacity-50 cursor-wait' : ''}`}
                            onClick={() => handleToggleVisibility(skill)}
                            disabled={updating === skill.id}
                            aria-label={skill.isPublic ? 'Make Private' : 'Make Public'}
                          >
                            {skill.isPublic ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                            {skill.isPublic ? 'Make Private' : 'Make Public'}
                          </button>
                          <button
                            className="flex items-center px-3 py-1 rounded bg-blue-800 text-white hover:bg-blue-900 text-sm font-medium"
                            onClick={() => handleEditSkill(skill)}
                            aria-label="Edit Skill"
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            className="flex items-center px-3 py-1 rounded bg-red-800 text-white hover:bg-red-900 text-sm font-medium"
                            onClick={() => setDeleteId(skill.id)}
                            aria-label="Delete Skill"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                    {deleteId === skill.id && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-[#232428] p-6 rounded-lg shadow-lg">
                          <h4 className="text-white font-semibold mb-2">Delete Skill?</h4>
                          <p className="text-gray-300 mb-4">Are you sure you want to delete <span className="font-bold">{skill.name}</span>?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="btn-danger flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="btn-secondary flex items-center"
                            >
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SkillsPage 