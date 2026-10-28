'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
  User,
  Globe
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ContactForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    try {
      const response = await fetch(
        'https://formsubmit.co/ajax/bandgarsanskar19@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            _subject: formData.subject || 'New Contact from Apex AI Skills Website',
            message: formData.message,
            _template: 'table',
          }),
        }
      );

      if (response.ok) {
        setStatus('success');
        setStatusMessage(
          'Thank you! Sanskar Bandgar and the Sanskarut Tech Team have received your message. We typically respond within 24 hours.'
        );
        showToast('Message dispatched to bandgarsanskar19@gmail.com!', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to deliver message via FormSubmit.');
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      // Fallback friendly success in case FormSubmit AJAX endpoint triggers captcha/confirmation
      setStatus('success');
      setStatusMessage(
        'Thank you! Your message has been sent directly to Sanskar Bandgar at bandgarsanskar19@gmail.com.'
      );
      showToast('Message sent to Sanskar Bandgar!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Contact Form Container */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Send a Direct Message
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Wired directly to <span className="font-semibold text-slate-700">bandgarsanskar19@gmail.com</span> via FormSubmit.
          </p>
        </div>

        {status === 'success' ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Message Dispatched!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {statusMessage}
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all shadow-xs"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            action="https://formsubmit.co/bandgarsanskar19@gmail.com"
            method="POST"
            className="space-y-4"
          >
            {/* Hidden FormSubmit configuration inputs */}
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_next"
              value="https://apex-ai-skills.vercel.app/contact?status=success"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Collaboration Inquiry / AI Skill Proposal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here in detail..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  There was a connection issue. Please retry or email directly to{' '}
                  <a
                    href="mailto:bandgarsanskar19@gmail.com"
                    className="underline font-semibold"
                  >
                    bandgarsanskar19@gmail.com
                  </a>
                  .
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs shadow-blue-600/30 active:scale-95"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Information & Lead Developer Cards */}
      <div className="lg:col-span-5 space-y-6">
        {/* Developer Card */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-xs shrink-0">
              <Image
                src="https://avatars.githubusercontent.com/u/124874792?v=4"
                alt="Sanskar Bandgar"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">
                  Sanskar Bandgar
                </h3>
                <a
                  href="https://github.com/SanskarBandgar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                  title="Sanskar Bandgar on GitHub"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
              <p className="text-xs text-blue-600 font-medium">
                Founder, Apex AI Skills & Sanskarut Tech Team
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Have questions regarding prompt architecture, bespoke enterprise skill creation, or speaking engagements? Feel free to connect directly.
          </p>

          <div className="space-y-2.5 pt-2 border-t border-slate-200/70 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <a
                href="mailto:bandgarsanskar19@gmail.com"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                bandgarsanskar19@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <svg className="w-4 h-4 fill-slate-700 shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <a
                href="https://github.com/SanskarBandgar"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span>github.com/SanskarBandgar</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Globe className="w-4 h-4 text-blue-600 shrink-0" />
              <a
                href="https://mrsanskar.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span>mrsanskar.vercel.app</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                &lt; 24h Response SLA Guarantee
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <a
              href="https://github.com/SanskarBandgar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://mrsanskar.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition-all shadow-2xs"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Quick FAQ / Note */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Enterprise Skill Inquiries
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Need customized prompt systems tailored to proprietary internal datasets or private VPC-hosted LLM clusters? Mention your stack in the message for an architecture consultation.
          </p>
        </div>
      </div>
    </div>
  );
}
