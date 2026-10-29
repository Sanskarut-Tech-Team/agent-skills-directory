import React from 'react';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Lead Developer & Sanskarut Team | Apex AI Skills',
  description:
    'Get in touch with lead developer Sanskar Bandgar regarding Apex AI Skills, custom AI prompt engineering, and team collaborations.',
};

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Clean Google-style without eyebrow badges */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Contact Sanskar Bandgar
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Have an inquiry, feedback on an AI blueprint, or want to collaborate with the Sanskarut Tech Team? Submit the form below or write directly to <span className="font-semibold text-slate-900">bandgarsanskar19@gmail.com</span>.
          </p>
        </div>

        {/* Contact Form & Info Grid */}
        <ContactForm />
      </div>
    </div>
  );
}
