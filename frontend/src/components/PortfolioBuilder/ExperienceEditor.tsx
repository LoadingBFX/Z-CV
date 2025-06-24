import React, { useState } from 'react';
import { Plus, Edit, Trash2, Briefcase, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import { DetailedExperience } from '../../types';

const ExperienceEditor: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const emptyExperience: Omit<DetailedExperience, 'id'> = {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentRole: false,
    context: '',
    responsibilities: [''],
    challenges: [''],
    solutions: [''],
    achievements: [''],
    metrics: [''],
    technologies: [''],
    takeaways: [''],
    improvements: [''],
    githubRepos: [],
    articles: [],
    presentations: [],
    awards: [],
  };

  const [formData, setFormData] = useState<Omit<DetailedExperience, 'id'>>(emptyExperience);

  const handleSave = () => {
    if (editingId) {
      dispatch({
        type: 'UPDATE_EXPERIENCE',
        payload: { id: editingId, data: formData },
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_EXPERIENCE',
        payload: formData,
      });
      setShowAddForm(false);
    }
    setFormData(emptyExperience);
  };

  const handleEdit = (experience: DetailedExperience) => {
    setFormData(experience);
    setEditingId(experience.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this work experience?')) {
      dispatch({ type: 'DELETE_EXPERIENCE', payload: id });
    }
  };

  const updateArrayField = (field: keyof typeof formData, index: number, value: string) => {
    const array = formData[field] as string[];
    const newArray = [...array];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof typeof formData) => {
    const array = formData[field] as string[];
    setFormData({ ...formData, [field]: [...array, ''] });
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const array = formData[field] as string[];
    const newArray = array.filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const renderArrayField = (
    field: keyof typeof formData,
    label: string,
    placeholder: string
  ) => {
    const array = formData[field] as string[];
    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <button
            type="button"
            onClick={() => addArrayItem(field)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {array.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayField(field, index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={placeholder}
              />
              {array.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(field, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Briefcase className="h-6 w-6 mr-3 text-blue-600" />
          Work Experience
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4 mb-8">
        {state.portfolio.experiences.map((experience) => (
          <div key={experience.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
                <p className="text-gray-600">{experience.company}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {experience.startDate} - {experience.isCurrentRole ? 'Present' : experience.endDate}
                  </span>
                  {experience.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {experience.location}
                    </span>
                  )}
                </div>
                {experience.achievements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Key Achievements:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {experience.achievements.slice(0, 2).map((achievement, index) => (
                        <li key={index}>• {achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(experience)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
          </h3>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Senior Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Google"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.isCurrentRole}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isCurrentRole"
                  checked={formData.isCurrentRole}
                  onChange={(e) => setFormData({ ...formData, isCurrentRole: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isCurrentRole" className="ml-2 text-sm text-gray-700">
                  I currently work here
                </label>
              </div>
            </div>

            {/* Work Context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Context</label>
              <textarea
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the context of this role - company size, team structure, business focus, etc..."
              />
            </div>

            {/* Array Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderArrayField('responsibilities', 'Key Responsibilities', 'Led architecture design and development')}
                {renderArrayField('challenges', 'Challenges Faced', 'High system load requiring performance optimization')}
                {renderArrayField('solutions', 'Solutions Implemented', 'Implemented Redis caching and database optimization')}
              </div>
              
              <div className="space-y-4">
                {renderArrayField('achievements', 'Key Achievements', 'Reduced API response time from 2s to 200ms')}
                {renderArrayField('metrics', 'Quantifiable Results', '50% user growth, 99.9% system uptime')}
                {renderArrayField('technologies', 'Technologies Used', 'React, Node.js, MongoDB')}
              </div>
            </div>

            {/* Reflection and Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderArrayField('takeaways', 'Key Learnings', 'Learned large-scale system architecture design')}
              {renderArrayField('improvements', 'What You\'d Do Differently', 'Would implement monitoring earlier in the process')}
            </div>

            {/* Related Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderArrayField('githubRepos', 'GitHub Projects', 'https://github.com/username/project')}
              {renderArrayField('articles', 'Related Articles', 'https://blog.example.com/my-article')}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData(emptyExperience);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceEditor;