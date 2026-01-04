import React, { useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  Database,
  FileCheck,
  Globe,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

// Types
interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface SecurityFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Accordion Component
const Accordion: React.FC<{ items: AccordionItem[] }> = ({ items }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div
            key={item.id}
            className="border border-border rounded-lg overflow-hidden bg-card"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-start hover:bg-surface-hover transition-colors"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                {item.title}
              </h3>
              {isOpen ? (
                <ChevronUp className="text-primary w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDown className="text-primary w-5 h-5 flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-6 py-4 border-t border-border bg-surface">
                <div className="text-text-secondary leading-relaxed space-y-3">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Security Feature Card
const SecurityFeatureCard: React.FC<SecurityFeature> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// Main Component
const SecurityPrivacyPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const securityFeatures: SecurityFeature[] = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description:
        "All data transmitted between your device and our servers is protected with industry-standard SSL/TLS encryption.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Secure Data Storage",
      description:
        "Student and staff data is stored in secure, encrypted databases with regular backups and disaster recovery protocols.",
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Access Control",
      description:
        "Role-based access ensures that users only see information relevant to their role (student, parent, teacher, admin).",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Privacy Protection",
      description:
        "We comply with international data protection regulations including GDPR and ensure student privacy is maintained.",
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Regular Audits",
      description:
        "Our systems undergo regular security audits and penetration testing to identify and fix vulnerabilities.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "24/7 Monitoring",
      description:
        "Continuous monitoring of our systems ensures rapid detection and response to any security incidents.",
    },
  ];

  const accordionItems: AccordionItem[] = [
    {
      id: "data-collection",
      title: "What Information Do We Collect?",
      content: (
        <>
          <p className="mb-3">
            We collect various types of information to provide and improve our
            services:
          </p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              <strong>Student Information:</strong> Name, date of birth, grade
              level, contact details, academic records, attendance data, and
              emergency contact information.
            </li>
            <li>
              <strong>Parent/Guardian Information:</strong> Name, contact
              details, relationship to student, and communication preferences.
            </li>
            <li>
              <strong>Staff Information:</strong> Professional credentials,
              employment records, and contact information.
            </li>
            <li>
              <strong>Usage Data:</strong> Login times, pages visited, features
              used, and technical data like IP addresses and browser types.
            </li>
            <li>
              <strong>Communication Data:</strong> Messages sent through the
              platform, feedback forms, and support requests.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "data-usage",
      title: "How Do We Use Your Information?",
      content: (
        <>
          <p className="mb-3">
            Your information is used solely for educational and administrative
            purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              Managing student enrollment, attendance, and academic progress
            </li>
            <li>
              Facilitating communication between teachers, students, and parents
            </li>
            <li>Providing personalized educational resources and support</li>
            <li>Ensuring school safety and security</li>
            <li>Improving our services and user experience</li>
            <li>Complying with legal and regulatory requirements</li>
            <li>
              Sending important notifications about school events, schedules,
              and announcements
            </li>
          </ul>
          <p className="mt-3">
            We never sell or rent personal information to third parties.
          </p>
        </>
      ),
    },
    {
      id: "data-sharing",
      title: "Third-Party Services and Data Sharing",
      content: (
        <>
          <p className="mb-3">
            We work with trusted third-party service providers to deliver our
            services:
          </p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              <strong>Cloud Hosting:</strong> Our platform is hosted on secure
              cloud infrastructure (AWS/Azure) with data centers in compliant
              regions.
            </li>
            <li>
              <strong>Email Services:</strong> We use secure email providers for
              communication services.
            </li>
            <li>
              <strong>Analytics:</strong> We use privacy-focused analytics tools
              to understand usage patterns and improve the platform.
            </li>
            <li>
              <strong>Payment Processing:</strong> For fee payments, we use
              PCI-DSS compliant payment processors.
            </li>
            <li>
              <strong>Educational Tools:</strong> Integration with approved
              educational platforms for enhanced learning experiences.
            </li>
          </ul>
          <p className="mt-3">
            All third-party providers are carefully vetted and required to
            maintain strict data protection standards. We share only the minimum
            necessary information and ensure they comply with applicable privacy
            laws.
          </p>
        </>
      ),
    },
    {
      id: "student-protection",
      title: "Student Data Protection",
      content: (
        <>
          <p className="mb-3">
            Protecting student data is our highest priority:
          </p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              <strong>Age-Appropriate Protections:</strong> Special safeguards
              for data of minors, including parental consent requirements.
            </li>
            <li>
              <strong>COPPA Compliance:</strong> We comply with the Children's
              Online Privacy Protection Act (COPPA) for students under 13.
            </li>
            <li>
              <strong>Education Records:</strong> We follow FERPA (Family
              Educational Rights and Privacy Act) guidelines for student
              education records.
            </li>
            <li>
              <strong>Limited Access:</strong> Student information is accessible
              only to authorized school personnel and parents/guardians.
            </li>
            <li>
              <strong>No Targeted Advertising:</strong> We do not use student
              data for advertising or marketing purposes.
            </li>
            <li>
              <strong>Data Minimization:</strong> We collect only the data
              necessary for educational purposes.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      content: (
        <>
          <p className="mb-3">
            We use cookies and similar technologies to enhance your experience:
          </p>
          <div className="space-y-3">
            <div>
              <strong className="block mb-1">Essential Cookies:</strong>
              <p>
                Required for the platform to function properly, including
                authentication and security features. These cannot be disabled.
              </p>
            </div>
            <div>
              <strong className="block mb-1">Functional Cookies:</strong>
              <p>
                Remember your preferences like language selection, theme choice,
                and dashboard layout.
              </p>
            </div>
            <div>
              <strong className="block mb-1">Analytics Cookies:</strong>
              <p>
                Help us understand how users interact with the platform to
                improve functionality. These are optional and can be disabled in
                settings.
              </p>
            </div>
          </div>
          <p className="mt-3">
            You can manage cookie preferences in your account settings or
            browser settings. Note that disabling certain cookies may limit
            platform functionality.
          </p>
        </>
      ),
    },
    {
      id: "user-rights",
      title: "Your Rights and Choices",
      content: (
        <>
          <p className="mb-3">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              <strong>Right to Access:</strong> Request a copy of the personal
              information we hold about you.
            </li>
            <li>
              <strong>Right to Correction:</strong> Request correction of
              inaccurate or incomplete information.
            </li>
            <li>
              <strong>Right to Deletion:</strong> Request deletion of your
              personal information (subject to legal retention requirements).
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Receive your data in a
              structured, machine-readable format.
            </li>
            <li>
              <strong>Right to Object:</strong> Object to certain types of data
              processing.
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Withdraw consent for
              data processing at any time.
            </li>
            <li>
              <strong>Right to Complain:</strong> Lodge a complaint with the
              relevant data protection authority.
            </li>
          </ul>
          <p className="mt-3">
            To exercise these rights, please contact our Data Protection Officer
            using the contact form below or at privacy@sultanzoy.edu
          </p>
        </>
      ),
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: (
        <>
          <p className="mb-3">
            We retain personal information only as long as necessary:
          </p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              <strong>Active Students:</strong> Data is retained throughout
              enrollment and for 7 years after graduation as required by
              educational regulations.
            </li>
            <li>
              <strong>Alumni Records:</strong> Basic records may be retained
              indefinitely for alumni services and historical purposes.
            </li>
            <li>
              <strong>Staff Records:</strong> Retained according to employment
              law requirements.
            </li>
            <li>
              <strong>Usage Logs:</strong> Typically retained for 12-24 months
              for security and troubleshooting purposes.
            </li>
            <li>
              <strong>Communication Records:</strong> Retained for 3 years or as
              required by law.
            </li>
          </ul>
          <p className="mt-3">
            When data is no longer needed, it is securely deleted or anonymized.
          </p>
        </>
      ),
    },
    {
      id: "security-measures",
      title: "Security Measures",
      content: (
        <>
          <p className="mb-3">We implement comprehensive security measures:</p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              <strong>Technical Safeguards:</strong> Firewalls, intrusion
              detection systems, encryption, and secure authentication
              protocols.
            </li>
            <li>
              <strong>Administrative Safeguards:</strong> Staff training,
              background checks, access control policies, and incident response
              plans.
            </li>
            <li>
              <strong>Physical Safeguards:</strong> Secure data centers with
              restricted access, surveillance, and environmental controls.
            </li>
            <li>
              <strong>Regular Updates:</strong> Software and security patches
              are applied promptly to address vulnerabilities.
            </li>
            <li>
              <strong>Multi-Factor Authentication:</strong> Available for all
              users to enhance account security.
            </li>
            <li>
              <strong>Data Backup:</strong> Regular automated backups with
              secure offsite storage.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "breach-notification",
      title: "Data Breach Notification",
      content: (
        <>
          <p className="mb-3">In the unlikely event of a data breach:</p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              We will notify affected individuals within 72 hours of discovering
              the breach
            </li>
            <li>
              Notification will include the nature of the breach, potential
              impact, and steps we're taking
            </li>
            <li>
              We will provide guidance on protective measures you can take
            </li>
            <li>Relevant authorities will be notified as required by law</li>
            <li>
              We maintain a comprehensive incident response plan to minimize
              impact
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "policy-updates",
      title: "Updates to This Policy",
      content: (
        <>
          <p className="mb-3">
            We may update this privacy policy periodically to reflect changes in
            our practices or legal requirements:
          </p>
          <ul className="list-disc list-inside space-y-2 ms-4">
            <li>
              Material changes will be communicated via email and platform
              notifications
            </li>
            <li>
              The "Last Updated" date at the top of the policy will be changed
            </li>
            <li>
              Continued use of the platform after changes constitutes acceptance
            </li>
            <li>For significant changes, we may request explicit consent</li>
            <li>Previous versions of the policy are available upon request</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background to-primary-dark text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Security & Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Your trust is our foundation. Learn how Sultan Zoy High School
            protects your data and ensures privacy for all members of our
            community.
          </p>
          <p className="mt-4 text-sm text-white/80">
            Last Updated: December 20, 2025
          </p>
        </div>
      </div>

      {/* Commitment Statement */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 text-success">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">
                Our Commitment to You
              </h2>
              <p className="text-text-secondary leading-relaxed mb-3">
                At Sultan Zoy High School, we understand that protecting the
                privacy and security of our students, parents, and staff is
                paramount. This policy outlines our commitment to safeguarding
                your personal information and maintaining transparency about our
                data practices.
              </p>
              <p className="text-text-secondary leading-relaxed">
                We comply with all applicable data protection laws and
                regulations, including GDPR, COPPA, and FERPA, and we
                continuously update our practices to meet the highest standards
                of data protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-text-primary mb-3">
            How We Protect Your Data
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We employ multiple layers of security to ensure your information
            remains safe and confidential.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <SecurityFeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-text-primary mb-3">
            Detailed Privacy Information
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Click on each section to learn more about our privacy practices and
            your rights.
          </p>
        </div>
        <Accordion items={accordionItems} />
      </div>

      {/* Compliance Badges */}
      <div className="bg-surface py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            Compliance & Certifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "GDPR Compliant", icon: <Globe className="w-8 h-8" /> },
              { name: "COPPA Certified", icon: <Shield className="w-8 h-8" /> },
              {
                name: "FERPA Compliant",
                icon: <FileCheck className="w-8 h-8" />,
              },
              { name: "SSL/TLS Secured", icon: <Lock className="w-8 h-8" /> },
            ].map((badge, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-3 text-primary">
                  {badge.icon}
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Privacy Inquiries
            </h2>
            <p className="text-text-secondary">
              Have questions about our privacy practices? Contact our Data
              Protection Officer.
            </p>
          </div>

          {submitSuccess && (
            <div className="mb-6 bg-success-soft border border-success rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-success text-sm">
                Thank you for your inquiry. We'll respond within 48 hours.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-focus"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-focus"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-focus"
              >
                <option value="">Select a subject</option>
                <option value="data-access">Request Data Access</option>
                <option value="data-correction">Request Data Correction</option>
                <option value="data-deletion">Request Data Deletion</option>
                <option value="consent-withdrawal">Withdraw Consent</option>
                <option value="breach-report">Report Security Concern</option>
                <option value="general">General Privacy Inquiry</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-focus resize-none"
                placeholder="Please provide details about your inquiry..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.name ||
                !formData.email ||
                !formData.subject ||
                !formData.message
              }
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Other Contact Methods
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-text-secondary">
                <Mail className="w-5 h-5 text-primary" />
                <span>privacy@sultanzoy.edu</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Phone className="w-5 h-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Clock className="w-5 h-5 text-primary" />
                <span>Response time: Within 48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-warning-soft border border-warning rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Important Notice
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                This privacy policy applies to the Sultan Zoy High School
                website and related digital platforms. By using our services,
                you acknowledge that you have read and understood this policy.
                If you do not agree with our practices, please do not use our
                services. For students under 13, parental consent is required
                for platform usage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacyPage;
