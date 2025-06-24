import React, { useState } from 'react';
import { Plus, Edit, Trash2, Code, Calendar, MapPin, ExternalLink, Github } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import { DetailedProject } from '../../types';

const ProjectEditor: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const emptyProject: Omit<DetailedProject, 'id'> = {
    name: '',
    type: 'personal',
    startDate: '',
    endDate: '',
    isOngoing: false,
    motivation: '',
    description: '',
    objectives: [''],
    challenges: [''],
    approach: [''],
    technologies: [''],
    architecture: '',
    outcomes: [''],
    metrics: [''],
    impact: '',
    learnings: [''],
    improvements: [''],
    githubUrl: '',
    liveUrl: '',
    demoUrl: '',
    documentation: '',
    teamSize: 1,
    role: '',
    collaborators: [''],
  };

  const [formData, setFormData] = useState<Omit<DetailedProject, 'id'>>(emptyProject);

  const handleSave = () => {
    if (editingId) {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: { id: editingId, data: formData },
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_PROJECT',
        payload: formData,
      });
      setShowAddForm(false);
    }
    setFormData(emptyProject);
  };

  const handleEdit = (project: DetailedProject) => {
    setFormData(project);
    setEditingId(project.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'DELETE_PROJECT', payload: id });
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
          <Code className="h-6 w-6 mr-3 text-blue-600" />
          Projects
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-4 mb-8">
        {state.portfolio.projects.map((project) => (
          <div key={project.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 mb-2">{project.description}</p>
                <div className="flex items-center space-x-4 mb-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.startDate} - {project.isOngoing ? 'Ongoing' : project.endDate}
                  </span>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${project.type === 'work' ? 'bg-blue-100 text-blue-700' :
                      project.type === 'personal' ? 'bg-green-100 text-green-700' :
                      project.type === 'academic' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {project.type === 'work' ? 'Work Project' :
                     project.type === 'personal' ? 'Personal Project' :
                     project.type === 'academic' ? 'Academic Project' :
                     project.type === 'hackathon' ? 'Hackathon' : 'Open Source'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 5).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{project.technologies.length - 5} more
                    </span>
                  )}
                </div>
                {project.outcomes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Key Outcomes:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {project.outcomes.slice(0, 2).map((outcome, index) => (
                        <li key={index}>• {outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center space-x-4 mt-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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
            {editingId ? 'Edit Project' : 'Add Project'}
          </h3>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E-commerce Platform"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="personal">Personal Project</option>
                  <option value="work">Work Project</option>
                  <option value="academic">Academic Project</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="open-source">Open Source</option>
                </select>
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
                  disabled={formData.isOngoing}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOngoing"
                  checked={formData.isOngoing}
                  onChange={(e) => setFormData({ ...formData, isOngoing: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isOngoing" className="ml-2 text-sm text-gray-700">
                  Project is ongoing
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">My Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full-stack Developer"
                />
              </div>
            </div>

            {/* Project Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Motivation</label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Why did you start this project? What problem does it solve?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the project's features and functionality..."
                />
              </div>
            </div>

            {/* Array Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderArrayField('objectives', 'Project Objectives', 'Improve user experience')}
                {renderArrayField('challenges', 'Challenges Faced', 'High traffic handling')}
                {renderArrayField('approach', 'Solutions Implemented', 'Used microservices architecture')}
              </div>
              
              <div className="space-y-4">
                {renderArrayField('outcomes', 'Project Outcomes', '50% user growth')}
                {renderArrayField('metrics', 'Quantifiable Results', 'Response time <200ms')}
                {renderArrayField('learnings', 'Key Learnings', 'Learned distributed system design')}
              </div>
            </div>

            {/* Technologies */}
            <div>
              {renderArrayField('technologies', 'Technologies Used', 'React, Node.js, MongoDB')}
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/username/project"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://project-demo.com"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData(emptyProject);
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

export default ProjectEditor;