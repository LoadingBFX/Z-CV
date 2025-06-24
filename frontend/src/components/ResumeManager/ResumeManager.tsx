import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Filter,
  Search,
  Calendar,
  Target,
  Plus
} from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const ResumeManager: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'role-based' | 'jd-tailored'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'downloads'>('date');

  const filteredResumes = state.resumes
    .filter(resume => {
      const matchesSearch = resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resume.targetRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resume.targetCompany?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || resume.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        default:
          return 0;
      }
    });

  const handleDownload = (resume: any) => {
    const blob = new Blob([resume.latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.name}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Update download count
    dispatch({
      type: 'UPDATE_RESUME',
      payload: {
        id: resume.id,
        data: { downloadCount: resume.downloadCount + 1 }
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_RESUME', payload: id });
    }
  };

  const handleDuplicate = (resume: any) => {
    const newResume = {
      ...resume,
      id: Date.now().toString(),
      name: `${resume.name}_copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadCount: 0,
      version: 1,
      parentResumeId: resume.id,
    };
    dispatch({ type: 'ADD_RESUME', payload: newResume });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Management</h1>
            <p className="text-lg text-gray-600">
              Manage all your generated resume versions with download, edit, and copy capabilities
            </p>
          </div>
          
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'resume-generator' })}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Generate New Resume
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resume name, position, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="role-based">Role-based</option>
              <option value="jd-tailored">JD-tailored</option>
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="downloads">Sort by Downloads</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resume List */}
      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {resume.name}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    {resume.targetRole && (
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        {resume.targetRole}
                      </div>
                    )}
                    {resume.targetCompany && (
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {resume.targetCompany}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${resume.type === 'role-based' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                    }
                  `}>
                    {resume.type === 'role-based' ? 'Role-based' : 'JD-tailored'}
                  </span>
                </div>
              </div>

              {/* Resume Preview Info */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Content includes:</div>
                <div className="flex flex-wrap gap-1">
                  {resume.selectedExperiences.length > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {resume.selectedExperiences.length} work experiences
                    </span>
                  )}
                  {resume.selectedProjects.length > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {resume.selectedProjects.length} projects
                    </span>
                  )}
                  {resume.selectedSkills.length > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {resume.selectedSkills.length} skills
                    </span>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Downloaded {resume.downloadCount} times</span>
                <span>Version {resume.version}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(resume)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  
                  <button
                    onClick={() => dispatch({ type: 'SELECT_RESUME', payload: resume.id })}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDuplicate(resume)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No matching resumes found' : 'No resumes generated yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'Start generating your first professional resume'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'resume-generator' })}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Generate Resume
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeManager;