import React from 'react';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import { Education, Experience, Project } from '../../types';

const ProfileEditor: React.FC = () => {
  const { state, dispatch } = useZcv();
  const { profile, missing } = state;

  const updateProfile = (updates: any) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  const addEducation = () => {
    const newEducation: Education = {
      degree: '',
      school: '',
      period: ''
    };
    updateProfile({
      education: [...(profile.education || []), newEducation]
    });
  };

  const updateEducation = (index: number, education: Education) => {
    const updatedEducation = [...(profile.education || [])];
    updatedEducation[index] = education;
    updateProfile({ education: updatedEducation });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...(profile.education || [])];
    updatedEducation.splice(index, 1);
    updateProfile({ education: updatedEducation });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      title: '',
      company: '',
      period: '',
      impact: ''
    };
    updateProfile({
      experiences: [...(profile.experiences || []), newExperience]
    });
  };

  const updateExperience = (index: number, experience: Experience) => {
    const updatedExperiences = [...(profile.experiences || [])];
    updatedExperiences[index] = experience;
    updateProfile({ experiences: updatedExperiences });
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = [...(profile.experiences || [])];
    updatedExperiences.splice(index, 1);
    updateProfile({ experiences: updatedExperiences });
  };

  const addProject = () => {
    const newProject: Project = {
      name: '',
      description: '',
      technologies: []
    };
    updateProfile({
      projects: [...(profile.projects || []), newProject]
    });
  };

  const updateProject = (index: number, project: Project) => {
    const updatedProjects = [...(profile.projects || [])];
    updatedProjects[index] = project;
    updateProfile({ projects: updatedProjects });
  };

  const removeProject = (index: number) => {
    const updatedProjects = [...(profile.projects || [])];
    updatedProjects.splice(index, 1);
    updateProfile({ projects: updatedProjects });
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_STAGE', payload: 'generate' });
  };

  const isFieldMissing = (field: string) => missing.includes(field);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Edit Your Profile</h2>
        <p className="text-lg text-gray-600">
          Review and enhance your information. Required fields are highlighted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              Personal Information
              {isFieldMissing('name') && <AlertCircle className="h-5 w-5 text-red-500 ml-2" />}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name {isFieldMissing('name') && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isFieldMissing('name') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                Education
                {isFieldMissing('education') && <AlertCircle className="h-5 w-5 text-red-500 ml-2" />}
              </h3>
              <button
                onClick={addEducation}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </button>
            </div>
            
            <div className="space-y-4">
              {(profile.education || []).map((edu, index) => (
                <div key={index} className={`p-4 border rounded-lg ${isFieldMissing('education') ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, { ...edu, degree: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Bachelor of Science in Computer Science"
                    />
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, { ...edu, school: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="University Name"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => updateEducation(index, { ...edu, period: e.target.value })}
                      className="w-full mr-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2019-2023"
                    />
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                Work Experience
                {isFieldMissing('experiences') && <AlertCircle className="h-5 w-5 text-red-500 ml-2" />}
              </h3>
              <button
                onClick={addExperience}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </button>
            </div>
            
            <div className="space-y-4">
              {(profile.experiences || []).map((exp, index) => (
                <div key={index} className={`p-4 border rounded-lg ${isFieldMissing('experiences') ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, { ...exp, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Software Engineer"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, { ...exp, company: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company Name"
                    />
                  </div>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => updateExperience(index, { ...exp, period: e.target.value })}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jan 2022 - Present"
                  />
                  <div className="flex justify-between items-start">
                    <textarea
                      value={exp.impact}
                      onChange={(e) => updateExperience(index, { ...exp, impact: e.target.value })}
                      className="w-full mr-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your key achievements and impact..."
                      rows={3}
                    />
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
              <button
                onClick={addProject}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </button>
            </div>
            
            <div className="space-y-4">
              {(profile.projects || []).map((project, index) => (
                <div key={index} className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(index, { ...project, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Project Name"
                    />
                    <input
                      type="text"
                      value={project.technologies.join(', ')}
                      onChange={(e) => updateProject(index, { ...project, technologies: e.target.value.split(', ').filter(t => t.trim()) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, { ...project, description: e.target.value })}
                      className="w-full mr-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your project and its impact..."
                      rows={3}
                    />
                    <button
                      onClick={() => removeProject(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills</h3>
            <textarea
              value={(profile.skills || []).join(', ')}
              onChange={(e) => updateProfile({ skills: e.target.value.split(', ').filter(s => s.trim()) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="JavaScript, React, Python, SQL, AWS..."
              rows={3}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Missing Fields Alert */}
          {missing.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h4 className="text-lg font-semibold text-red-700">Missing Information</h4>
              </div>
              <p className="text-sm text-red-600 mb-4">
                Please complete these required fields:
              </p>
              <ul className="space-y-2">
                {missing.map((field) => (
                  <li key={field} className="text-sm text-red-600 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Actions</h4>
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                disabled={missing.length > 0}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="h-5 w-5 mr-2" />
                Continue to Generate
              </button>
              
              <button
                onClick={() => dispatch({ type: 'SET_STAGE', payload: 'chat' })}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Chat
              </button>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Completeness</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Education</span>
                <span className={`font-medium ${(profile.education || []).length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(profile.education || []).length} entries
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Experience</span>
                <span className={`font-medium ${(profile.experiences || []).length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(profile.experiences || []).length} entries
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Projects</span>
                <span className={`font-medium ${(profile.projects || []).length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {(profile.projects || []).length} entries
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Skills</span>
                <span className={`font-medium ${(profile.skills || []).length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {(profile.skills || []).length} skills
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;