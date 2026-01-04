import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building,
  CheckCircle,
  ChevronDown,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Send,
  UserCircle,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PageHeader from "../../components/layout/PageHeader";

// Zod Schema for Contact Form Validation
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.enum(
    ["admission", "general", "complaint", "suggestion", "partnership", "other"],
    {
      errorMap: () => ({ message: "Please select a subject" }),
    }
  ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// API call function using fetch
const submitContactForm = async (data: ContactFormData): Promise<void> => {
  const response = await fetch("/api/contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }

  return response.json();
};

// Department Contact Card Component
const DepartmentCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  email: string;
  phone: string;
  description: string;
}> = ({ icon, title, email, phone, description }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-sm text-text-secondary mb-3">{description}</p>
          <div className="space-y-2">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail size={16} />
              {email}
            </a>
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Phone size={16} />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-surface transition-colors duration-200 text-left"
      >
        <span className="font-medium text-text-primary">{question}</span>
        <ChevronDown
          size={20}
          className={`text-text-secondary transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-surface border-t border-border">
          <p className="text-text-secondary">{answer}</p>
        </div>
      )}
    </div>
  );
};

// Main Contact Us Component
const ContactUs: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: undefined,
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const departments = [
    {
      icon: <GraduationCap size={24} />,
      title: "Admissions Office",
      email: "admissions@sultanzoy.edu",
      phone: "+93 (0) 700 123 456",
      description: "For enrollment inquiries and admission procedures",
    },
    {
      icon: <Building size={24} />,
      title: "Administration",
      email: "admin@sultanzoy.edu",
      phone: "+93 (0) 700 123 457",
      description: "For general school matters and administrative issues",
    },
    {
      icon: <Users size={24} />,
      title: "Academic Affairs",
      email: "academic@sultanzoy.edu",
      phone: "+93 (0) 700 123 458",
      description: "For curriculum and academic program information",
    },
    {
      icon: <UserCircle size={24} />,
      title: "Student Services",
      email: "students@sultanzoy.edu",
      phone: "+93 (0) 700 123 459",
      description: "For student support and counseling services",
    },
  ];

  const faqs = [
    {
      question: "What are the admission requirements?",
      answer:
        "Admission requirements include completed application form, previous academic records, birth certificate, and passport-sized photos. Age requirements vary by grade level. Please contact our admissions office for specific grade requirements.",
    },
    {
      question: "What is your school schedule?",
      answer:
        "Classes run from 8:00 AM to 3:00 PM, Saturday through Wednesday. Thursday and Friday are weekends. Our administrative offices are open from 8:00 AM to 4:00 PM on school days.",
    },
    {
      question: "Do you offer transportation services?",
      answer:
        "Yes, we provide school bus services covering major areas of the city. Routes and schedules are available from the administration office. Additional fees apply for transportation services.",
    },
    {
      question: "What extracurricular activities are available?",
      answer:
        "We offer a wide range of activities including sports teams, arts and crafts, science clubs, debate society, music programs, and cultural activities. Students can participate in multiple activities throughout the year.",
    },
    {
      question: "How can I schedule a school tour?",
      answer:
        "You can schedule a school tour by calling our admissions office or filling out the contact form above. Tours are available on weekdays between 9:00 AM and 2:00 PM.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader
        title="Contact Us"
        subtitle="We're here to help and answer any questions you might have"
        breadcrumb={["Home", "Contact Us"]}
        image="images/bg-3.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex p-4 bg-primary/10 rounded-full text-primary mb-4">
              <MapPin size={32} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Visit Us
            </h3>
            <p className="text-text-secondary">
              Karte-4, District 3<br />
              Kabul, Afghanistan
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex p-4 bg-secondary/10 rounded-full text-secondary mb-4">
              <Phone size={32} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Call Us
            </h3>
            <p className="text-text-secondary">
              Main: +93 (0) 700 123 456
              <br />
              Fax: +93 (0) 700 123 460
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex p-4 bg-accent/10 rounded-full text-accent mb-4">
              <Mail size={32} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Email Us
            </h3>
            <p className="text-text-secondary">
              info@sultanzoy.edu
              <br />
              support@sultanzoy.edu
            </p>
          </div>
        </div>

        {/* Office Hours */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg p-8 mb-16">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-lg text-primary">
              <Clock size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Office Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-secondary">
                <div>
                  <p className="font-semibold text-text-primary mb-2">
                    School Days (Sat - Wed)
                  </p>
                  <p>Classes: 8:00 AM - 3:00 PM</p>
                  <p>Office: 8:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary mb-2">
                    Weekends (Thu - Fri)
                  </p>
                  <p>Closed</p>
                  <p className="text-sm mt-2">
                    Emergency contact available via email
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Send us a Message
            </h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-secondary/10 border border-secondary rounded-lg flex items-center gap-3 text-secondary">
                <CheckCircle size={20} />
                <span>
                  Your message has been sent successfully! We'll get back to you
                  soon.
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <span>Failed to send message. Please try again later.</span>
              </div>
            )}

            <div className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Full Name *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Email Address *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Phone Number (Optional)
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary"
                  placeholder="+93 700 123 456"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Subject *
                </label>
                <select
                  {...register("subject")}
                  id="subject"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary"
                >
                  <option value="">Select a subject</option>
                  <option value="admission">Admission Inquiry</option>
                  <option value="general">General Question</option>
                  <option value="complaint">Complaint</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Message *
                </label>
                <textarea
                  {...register("message")}
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary resize-none"
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="bg-card border border-border rounded-lg overflow-hidden h-[600px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.4167449894896!2d69.17151631521563!3d34.555349880467085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16eb2f3c6c5e7%3A0x7f3b3c3c3c3c3c3c!2sKabul%2C%20Afghanistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sultan Zoy High School Location"
            />
          </div>
        </div>

        {/* Department Quick Contact */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Quick Contact by Department
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <DepartmentCard key={index} {...dept} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
