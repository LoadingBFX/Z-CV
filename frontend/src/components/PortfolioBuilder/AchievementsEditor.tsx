import React, { useState } from 'react';
import { Plus, Edit, Trash2, Award, Calendar, ExternalLink, Star } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import { Achievement } from '../../types';

const AchievementsEditor: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const emptyAchievement: Omit<Achievement, 'id'> = {
    title: '',
    type: 'award',
    organization: '',
    date: '',
    description: '',
    significance: '',
    skills: [''],
    url: '',
    credentialId: '',
  };

  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>(emptyAchievement);

  const achievementTypes = [
    { id: 'award', label: 'Award', color: 'yellow', icon: Award },
    { id: 'certification', label: 'Certification', color: 'blue', icon: Star },
    { id: 'publication', label: 'Publication', color: 'green', icon: ExternalLink },
    { id: 'patent', label: 'Patent', color: 'purple', icon: Award },
    { id: 'competition', label: 'Competition', color: 'red', icon: Award },
    { id: 'recognition', label: 'Recognition', color: 'indigo', icon: Award },
  ];

  const handleSave = () => {
    if (editingId) {
      dispatch({
        type: 'UPDATE_ACHIEVEMENT',
        payload: { id: editingId, data: formData },
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_ACHIEVEMENT',
        payload: formData,
      });
      setShowAddForm(false);
    }
    setFormData(emptyAchievement);
  };

  const handleEdit = (achievement: Achievement) => {
    setFormData(achievement);
    setEditingId(achievement.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      dispatch({ type: 'DELETE_ACHIEVEMENT', payload: id });
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

  const filteredAchievements = state.portfolio.achievements.filter(achievement => 
    filterType === 'all' || achievement.type === filterType
  );

  const getTypeInfo = (type: string) => {
    return achievementTypes.find(t => t.id === type) || achievementTypes[0];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Award className="h-6 w-6 mr-3 text-blue-600" />
          Achievements
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </button>
      </div>

      {/* Type Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
              filterType === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({state.portfolio.achievements.length})
          </button>
          {achievementTypes.map((type) => {
            const count = state.portfolio.achievements.filter(a => a.type === type.id).length;
            return (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                  filterType === type.id
                    ? `bg-${type.color}-100 text-${type.color}-700`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredAchievements.map((achievement) => {
          const typeInfo = getTypeInfo(achievement.type);
          const IconComponent = typeInfo.icon;
          
          return (
            <div key={achievement.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-${typeInfo.color}-100`}>
                    <IconComponent className={`h-5 w-5 text-${typeInfo.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm">{achievement.organization}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full bg-${typeInfo.color}-100 text-${typeInfo.color}-700 mb-3`}>
                {typeInfo.label}
              </span>
              
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">{achievement.description}</p>
              
              {achievement.significance && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Significance:</p>
                  <p className="text-xs text-gray-600">{achievement.significance}</p>
                </div>
              )}
              
              {achievement.skills.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Related Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {achievement.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {achievement.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{achievement.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                {achievement.url && (
                  <a
                    href={achievement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Details
                  </a>
                )}
                {achievement.credentialId && (
                  <span className="text-xs text-gray-500">
                    ID: {achievement.credentialId}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {editingId ? 'Edit Achievement' : 'Add Achievement'}
          </h3>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Outstanding Graduate"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {achievementTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="University of Technology"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Received *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://certificate-url.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID</label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CERT-123456"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Detailed description of the achievement and its context..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Significance</label>
                <textarea
                  value={formData.significance}
                  onChange={(e) => setFormData({ ...formData, significance: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Why is this achievement important? What abilities does it demonstrate?"
                />
              </div>
            </div>

            {/* Related Skills */}
            <div>
              {renderArrayField('skills', 'Related Skills', 'JavaScript')}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData(emptyAchievement);
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

export default AchievementsEditor;