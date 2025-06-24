import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const PersonalInfoEditor: React.FC = () => {
  const { state, dispatch } = useZcv();
  const { personalInfo, professionalSummary } = state.portfolio;

  const updatePersonalInfo = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_PORTFOLIO',
      payload: {
        personalInfo: {
          ...personalInfo,
          [field]: value,
        },
      },
    });
  };

  const updateProfessionalSummary = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_PORTFOLIO',
      payload: {
        professionalSummary: {
          ...professionalSummary,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="h-6 w-6 mr-3 text-blue-600" />
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="San Francisco, CA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Linkedin className="h-4 w-4 inline mr-2" />
              LinkedIn
            </label>
            <input
              type="url"
              value={personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Github className="h-4 w-4 inline mr-2" />
              GitHub
            </label>
            <input
              type="url"
              value={personalInfo.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/johndoe"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="h-4 w-4 inline mr-2" />
              Personal Website
            </label>
            <input
              type="url"
              value={personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://johndoe.dev"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Professional Summary</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Headline (One-line description)
            </label>
            <input
              type="text"
              value={professionalSummary.headline}
              onChange={(e) => updateProfessionalSummary('headline', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full-Stack Engineer | 5 years experience | React & Node.js specialist"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elevator Pitch (30-second introduction)
            </label>
            <textarea
              value={professionalSummary.elevator_pitch}
              onChange={(e) => updateProfessionalSummary('elevator_pitch', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="I'm a full-stack engineer with 5 years of experience building scalable web applications using React and Node.js. I've led technical teams at multiple startups and successfully delivered products serving millions of users..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Career Objective
            </label>
            <textarea
              value={professionalSummary.career_objective}
              onChange={(e) => updateProfessionalSummary('career_objective', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Looking to grow into a technical architect role over the next 3-5 years, leading large-scale distributed systems design while mentoring and growing technical teams..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value Proposition (What you bring to companies)
            </label>
            <textarea
              value={professionalSummary.value_proposition}
              onChange={(e) => updateProfessionalSummary('value_proposition', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="I bring full-stack expertise with a proven ability to build products from 0 to 1, translate business requirements into technical solutions, and lead cross-functional teams to deliver results..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoEditor;