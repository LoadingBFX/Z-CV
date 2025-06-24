import React, { useState } from 'react';
import { Plus, Edit, Trash2, GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import { DetailedEducation } from '../../types';

const EducationEditor: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const emptyEducation: Omit<DetailedEducation, 'id'> = {
    degree: '',
    major: '',
    school: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    relevantCoursework: [''],
    thesis: {
      title: '',
      advisor: '',
      abstract: '',
      keywords: [''],
      url: '',
    },
    researchProjects: [''],
    publications: [''],
    conferences: [''],
    academicAwards: [''],
    clubs: [''],
    leadership: [''],
    volunteering: [''],
    skillsDeveloped: [''],
    keyLearnings: [''],
  };

  const [formData, setFormData] = useState<Omit<DetailedEducation, 'id'>>(emptyEducation);

  const handleSave = () => {
    if (editingId) {
      dispatch({
        type: 'UPDATE_EDUCATION',
        payload: { id: editingId, data: formData },
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_EDUCATION',
        payload: formData,
      });
      setShowAddForm(false);
    }
    setFormData(emptyEducation);
  };

  const handleEdit = (education: DetailedEducation) => {
    setFormData(education);
    setEditingId(education.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this education record?')) {
      dispatch({ type: 'DELETE_EDUCATION', payload: id });
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
          <GraduationCap className="h-6 w-6 mr-3 text-blue-600" />
          Education
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-4 mb-8">
        {state.portfolio.education.map((education) => (
          <div key={education.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{education.degree}</h3>
                <p className="text-gray-600">{education.major} • {education.school}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {education.startDate} - {education.endDate}
                  </span>
                  {education.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {education.location}
                    </span>
                  )}
                  {education.gpa && (
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      GPA: {education.gpa}
                    </span>
                  )}
                </div>
                {education.academicAwards.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Academic Honors:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {education.academicAwards.slice(0, 2).map((award, index) => (
                        <li key={index}>• {award}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(education)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(education.id)}
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
            {editingId ? 'Edit Education' : 'Add Education'}
          </h3>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bachelor of Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Major *</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Computer Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="University of Technology"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            {/* Academic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderArrayField('relevantCoursework', 'Relevant Coursework', 'Data Structures and Algorithms')}
                {renderArrayField('researchProjects', 'Research Projects', 'Machine Learning in Image Recognition')}
                {renderArrayField('publications', 'Publications', 'Paper Title - Journal Name')}
              </div>
              
              <div className="space-y-4">
                {renderArrayField('academicAwards', 'Academic Awards', 'Dean\'s List')}
                {renderArrayField('clubs', 'Clubs & Activities', 'Computer Science Club')}
                {renderArrayField('leadership', 'Leadership Experience', 'Student Government President')}
              </div>
            </div>

            {/* Thesis */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Thesis (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thesis Title</label>
                  <input
                    type="text"
                    value={formData.thesis?.title || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      thesis: { ...formData.thesis!, title: e.target.value }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deep Learning-based Image Recognition System"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advisor</label>
                  <input
                    type="text"
                    value={formData.thesis?.advisor || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      thesis: { ...formData.thesis!, advisor: e.target.value }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. Smith"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
                <textarea
                  value={formData.thesis?.abstract || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    thesis: { ...formData.thesis!, abstract: e.target.value }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Thesis abstract..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData(emptyEducation);
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

export default EducationEditor;