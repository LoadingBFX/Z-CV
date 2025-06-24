import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, Star, TrendingUp } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import { Skill } from '../../types';

const SkillsEditor: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const emptySkill: Omit<Skill, 'name'> = {
    category: 'programming',
    proficiency: 'intermediate',
    yearsOfExperience: 1,
    lastUsed: new Date().toISOString().split('T')[0],
    acquiredFrom: [''],
    projects: [''],
    certifications: [''],
    githubRepos: [''],
    portfolioItems: [''],
  };

  const [formData, setFormData] = useState<Skill>({ name: '', ...emptySkill });

  const categories = [
    { id: 'programming', label: 'Programming Languages', color: 'blue' },
    { id: 'framework', label: 'Frameworks/Libraries', color: 'green' },
    { id: 'tool', label: 'Tools/Platforms', color: 'purple' },
    { id: 'language', label: 'Languages', color: 'orange' },
    { id: 'soft-skill', label: 'Soft Skills', color: 'pink' },
    { id: 'domain', label: 'Domain Knowledge', color: 'indigo' },
  ];

  const proficiencyLevels = [
    { id: 'beginner', label: 'Beginner', stars: 1 },
    { id: 'intermediate', label: 'Intermediate', stars: 2 },
    { id: 'advanced', label: 'Advanced', stars: 3 },
    { id: 'expert', label: 'Expert', stars: 4 },
  ];

  const handleSave = () => {
    if (editingId) {
      dispatch({
        type: 'UPDATE_SKILL',
        payload: { id: editingId, data: formData },
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_SKILL',
        payload: formData,
      });
      setShowAddForm(false);
    }
    setFormData({ name: '', ...emptySkill });
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.name);
    setShowAddForm(true);
  };

  const handleDelete = (name: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      dispatch({ type: 'DELETE_SKILL', payload: name });
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

  const filteredSkills = state.portfolio.skills.filter(skill => 
    filterCategory === 'all' || skill.category === filterCategory
  );

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'gray';
  };

  const renderStars = (proficiency: string) => {
    const level = proficiencyLevels.find(p => p.id === proficiency);
    const stars = level?.stars || 1;
    return (
      <div className="flex items-center">
        {[...Array(4)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="h-6 w-6 mr-3 text-blue-600" />
          Skills
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
              filterCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({state.portfolio.skills.length})
          </button>
          {categories.map((category) => {
            const count = state.portfolio.skills.filter(s => s.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                  filterCategory === category.id
                    ? `bg-${category.color}-100 text-${category.color}-700`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredSkills.map((skill) => {
          const categoryColor = getCategoryColor(skill.category);
          const category = categories.find(c => c.id === skill.category);
          
          return (
            <div key={skill.name} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full bg-${categoryColor}-100 text-${categoryColor}-700`}>
                    {category?.label}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Proficiency</span>
                  {renderStars(skill.proficiency)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-medium text-gray-900">
                    {skill.yearsOfExperience} years
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Used</span>
                  <span className="text-sm text-gray-900">
                    {new Date(skill.lastUsed).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {skill.projects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Related Projects:</p>
                  <div className="flex flex-wrap gap-1">
                    {skill.projects.slice(0, 2).map((project, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {project}
                      </span>
                    ))}
                    {skill.projects.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{skill.projects.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {editingId ? 'Edit Skill' : 'Add Skill'}
          </h3>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JavaScript"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                <select
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {proficiencyLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Used</label>
                <input
                  type="date"
                  value={formData.lastUsed}
                  onChange={(e) => setFormData({ ...formData, lastUsed: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderArrayField('acquiredFrom', 'Skill Source', 'University Course')}
                {renderArrayField('projects', 'Related Projects', 'E-commerce Platform')}
                {renderArrayField('certifications', 'Related Certifications', 'AWS Certification')}
              </div>
              
              <div className="space-y-4">
                {renderArrayField('githubRepos', 'GitHub Projects', 'https://github.com/username/project')}
                {renderArrayField('portfolioItems', 'Portfolio Items', 'Personal Website')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({ name: '', ...emptySkill });
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

export default SkillsEditor;