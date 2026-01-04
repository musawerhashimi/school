import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, DollarSign, Briefcase, X, Send, Check } from 'lucide-react';

// Types
interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  location: string;
  salary: string;
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  coverLetter: string;
  resume: File | null;
}

// Mock Data
const jobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Mathematics Teacher',
    department: 'Mathematics',
    type: 'Full-time',
    location: 'Sultan Zoy High School, Main Campus',
    salary: '$45,000 - $65,000/year',
    postedDate: '2024-12-01',
    deadline: '2024-12-31',
    description: 'We are seeking a passionate and dedicated Mathematics Teacher to join our academic team. The ideal candidate will inspire students to excel in mathematics and develop critical thinking skills.',
    requirements: [
      "Bachelor's degree in Mathematics or Education",
      'Teaching certification/license',
      'Minimum 2 years of teaching experience',
      'Strong classroom management skills',
      'Excellent communication abilities'
    ],
    responsibilities: [
      'Teach mathematics courses to high school students',
      'Develop engaging lesson plans and materials',
      'Assess student progress and provide feedback',
      'Participate in faculty meetings and professional development',
      'Collaborate with colleagues on curriculum development'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Professional development opportunities',
      'Paid vacation and holidays',
      'Retirement plan'
    ]
  },
  {
    id: '2',
    title: 'School Counselor',
    department: 'Student Services',
    type: 'Full-time',
    location: 'Sultan Zoy High School, Main Campus',
    salary: '$50,000 - $70,000/year',
    postedDate: '2024-12-05',
    deadline: '2025-01-15',
    description: 'Join our team as a School Counselor to support the emotional, social, and academic development of our students. Help create a positive and inclusive school environment.',
    requirements: [
      "Master's degree in School Counseling or related field",
      'State counseling certification',
      'Experience working with adolescents',
      'Strong interpersonal and communication skills',
      'Knowledge of college admission processes'
    ],
    responsibilities: [
      'Provide individual and group counseling to students',
      'Assist with college and career planning',
      'Support students with academic challenges',
      'Collaborate with teachers, parents, and administrators',
      'Develop and implement guidance programs'
    ],
    benefits: [
      'Comprehensive benefits package',
      'Professional development funding',
      'Supportive work environment',
      'Flexible scheduling options',
      'Generous paid time off'
    ]
  },
  {
    id: '3',
    title: 'IT Support Specialist',
    department: 'Technology',
    type: 'Full-time',
    location: 'Sultan Zoy High School, Main Campus',
    salary: '$40,000 - $55,000/year',
    postedDate: '2024-12-10',
    deadline: '2025-01-20',
    description: 'We are looking for an IT Support Specialist to maintain and support our technology infrastructure, assist staff and students with technical issues, and help integrate technology into the classroom.',
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      '3+ years of IT support experience',
      'Knowledge of Windows, macOS, and network systems',
      'Strong troubleshooting skills',
      'Excellent customer service orientation'
    ],
    responsibilities: [
      'Provide technical support to staff and students',
      'Maintain computer labs and classroom technology',
      'Manage network infrastructure and security',
      'Install and configure software and hardware',
      'Train staff on educational technology tools'
    ],
    benefits: [
      'Competitive salary and benefits',
      'Technology training opportunities',
      'Collaborative team environment',
      'Work-life balance',
      'Career growth potential'
    ]
  },
  {
    id: '4',
    title: 'Physical Education Teacher',
    department: 'Physical Education',
    type: 'Part-time',
    location: 'Sultan Zoy High School, Sports Complex',
    salary: '$30,000 - $40,000/year',
    postedDate: '2024-11-28',
    deadline: '2024-12-28',
    description: 'Seeking an enthusiastic Physical Education Teacher to promote health, fitness, and sportsmanship among our students. Coach athletic teams and organize sports events.',
    requirements: [
      "Bachelor's degree in Physical Education or Kinesiology",
      'Teaching certification in PE',
      'CPR and First Aid certified',
      'Coaching experience preferred',
      'Strong motivational skills'
    ],
    responsibilities: [
      'Teach physical education classes',
      'Develop fitness and sports programs',
      'Coach one or more athletic teams',
      'Ensure student safety during activities',
      'Organize sports events and tournaments'
    ],
    benefits: [
      'Flexible schedule',
      'Access to sports facilities',
      'Professional development',
      'Coaching stipends available',
      'Health benefits'
    ]
  },
  {
    id: '5',
    title: 'Librarian',
    department: 'Library Services',
    type: 'Full-time',
    location: 'Sultan Zoy High School, Library',
    salary: '$42,000 - $58,000/year',
    postedDate: '2024-12-08',
    deadline: '2025-01-10',
    description: 'We are seeking a creative and organized Librarian to manage our school library, promote literacy, and support students and teachers in research and learning.',
    requirements: [
      "Master's degree in Library Science",
      'School librarian certification',
      'Experience with library management systems',
      'Strong organizational skills',
      'Passion for reading and education'
    ],
    responsibilities: [
      'Manage library operations and resources',
      'Assist students and teachers with research',
      'Organize literacy programs and book clubs',
      'Maintain digital and physical collections',
      'Collaborate with teachers on curriculum support'
    ],
    benefits: [
      'Comprehensive benefits',
      'Professional development opportunities',
      'Summer break',
      'Supportive administration',
      'Modern library facilities'
    ]
  }
];

const Careers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobPostings.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
      const matchesType = selectedType === 'all' || job.type === selectedType;
      
      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [searchTerm, selectedDepartment, selectedType]);

  const departments = ['all', ...Array.from(new Set(jobPostings.map(job => job.department)))];
  const types = ['all', 'Full-time', 'Part-time', 'Contract'];

  const handleApply = (job: JobPosting) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Shape the Future of Education at Sultan Zoy High School
            </p>
            <p className="text-lg text-blue-200 max-w-3xl">
              We're always looking for passionate educators and professionals who share our commitment to excellence in education.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-surface border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-text-secondary text-sm">
            Showing {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No positions found
            </h3>
            <p className="text-text-secondary">
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onViewDetails={setSelectedJob} onApply={handleApply} />
            ))}
          </div>
        )}
      </div>

      {/* Why Work With Us Section */}
      <div className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Why Work With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon="🎓"
              title="Professional Growth"
              description="Continuous learning opportunities and career development programs"
            />
            <BenefitCard
              icon="🤝"
              title="Supportive Community"
              description="Collaborative environment with passionate educators"
            />
            <BenefitCard
              icon="⚖️"
              title="Work-Life Balance"
              description="Flexible schedules and generous time-off policies"
            />
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && !showApplicationForm && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={handleApply} />
      )}

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <ApplicationFormModal
          job={selectedJob}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
          onSubmit={() => {
            setApplicationSubmitted(true);
            setTimeout(() => {
              setShowApplicationForm(false);
              setSelectedJob(null);
              setApplicationSubmitted(false);
            }, 3000);
          }}
          submitted={applicationSubmitted}
        />
      )}
    </div>
  );
};

// Job Card Component
const JobCard: React.FC<{
  job: JobPosting;
  onViewDetails: (job: JobPosting) => void;
  onApply: (job: JobPosting) => void;
}> = ({ job, onViewDetails, onApply }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-1">
                {job.title}
              </h3>
              <p className="text-text-secondary">{job.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Clock className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <MapPin className="w-4 h-4" />
              <span>On-site</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
          </div>

          <p className="text-text-secondary line-clamp-2 mb-4">
            {job.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted">
            <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex md:flex-col gap-2">
          <button
            onClick={() => onViewDetails(job)}
            className="flex-1 md:flex-none px-6 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => onApply(job)}
            className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Job Detail Modal
const JobDetailModal: React.FC<{
  job: JobPosting;
  onClose: () => void;
  onApply: (job: JobPosting) => void;
}> = ({ job, onClose, onApply }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{job.title}</h2>
            <p className="text-text-secondary">{job.department}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Job Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem icon={<Clock />} label="Type" value={job.type} />
            <InfoItem icon={<MapPin />} label="Location" value="On-site" />
            <InfoItem icon={<DollarSign />} label="Salary" value={job.salary} />
            <InfoItem icon={<Briefcase />} label="Department" value={job.department} />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Job Description</h3>
            <p className="text-text-secondary leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Requirements</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-text-secondary">
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Responsibilities</h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2 text-text-secondary">
                  <Check className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Benefits</h3>
            <ul className="space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-text-secondary">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Apply Button */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => onApply(job)}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg"
            >
              Apply for this Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Application Form Modal
const ApplicationFormModal: React.FC<{
  job: JobPosting;
  onClose: () => void;
  onSubmit: () => void;
  submitted: boolean;
}> = ({ job, onClose, onSubmit, submitted }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    coverLetter: '',
    resume: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    if (!formData.resume) newErrors.resume = 'Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">Application Submitted!</h3>
          <p className="text-text-secondary">
            Thank you for your interest in the {job.title} position. We'll review your application and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Apply for Position</h2>
            <p className="text-text-secondary">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-2.5 bg-background border ${errors.fullName ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
                placeholder="John Doe"
              />
              {errors.fullName && <p className="text-error text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2.5 bg-background border ${errors.email ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-2.5 bg-background border ${errors.phone ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Years of Experience *
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className={`w-full px-4 py-2.5 bg-background border ${errors.experience ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              {errors.experience && <p className="text-error text-sm mt-1">{errors.experience}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Highest Education Level *
            </label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className={`w-full px-4 py-2.5 bg-background border ${errors.education ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
            >
              <option value="">Select education</option>
              <option value="high-school">High School</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">Ph.D.</option>
            </select>
            {errors.education && <p className="text-error text-sm mt-1">{errors.education}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Cover Letter *
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              rows={6}
              className={`w-full px-4 py-2.5 bg-background border ${errors.coverLetter ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary resize-none`}
              placeholder="Tell us why you're a great fit for this position..."
            />
            {errors.coverLetter && <p className="text-error text-sm mt-1">{errors.coverLetter}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Resume/CV *
            </label>
            <div className={`border-2 border-dashed ${errors.resume ? 'border-error' : 'border-border'} rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer`}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Send className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-text-primary font-medium">
                  {formData.resume ? formData.resume.name : 'Click to upload resume'}
                </p>
                <p className="text-text-secondary text-sm mt-1">PDF, DOC, DOCX (Max 5MB)</p>
              </label>
            </div>
            {errors.resume && <p className="text-error text-sm mt-1">{errors.resume}</p>}
          </div>

          <div className="pt-4 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-surface-hover transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Benefit Card Component
const BenefitCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

// Info Item Component
const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 text-muted mb-1">
        <div className="w-6 h-6">{icon}</div>
        <span className="text-xs align-middle font-medium uppercase">{label}</span>
      </div>
      <p className="text-text-primary pt-3 font-medium">{value}</p>
    </div>
  );
};

export default Careers;