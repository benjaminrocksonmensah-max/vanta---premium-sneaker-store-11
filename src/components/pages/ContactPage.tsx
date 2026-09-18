import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Enquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Incomplete details', 'Please complete all fields.', 'error');
      return;
    }
    setSent(true);
    addToast('Message Dispatched', 'Our concierge will respond within 4 hours.', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          CLIENT CONCIERGE & APPOINTMENTS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-['Syne',sans-serif]">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Whether inquiring about a bespoke drop, order tracking, or in-store appointment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <h3 className="text-base font-bold uppercase tracking-wider text-white">
            Dispatch a Direct Message
          </h3>

          {sent ? (
            <div className="p-8 text-center bg-zinc-900/60 rounded-2xl border border-emerald-800/60 text-emerald-400 space-y-2">
              <h4 className="text-sm font-bold text-white">Message Received by Concierge</h4>
              <p className="text-xs text-zinc-400">
                A confirmation copy has been routed to {email}. A specialist will attend to your request shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-white outline-none"
                >
                  <option value="Order Enquiry">Order & Shipment Status</option>
                  <option value="Sizing Help">Sizing & Fit Advice</option>
                  <option value="VIP Allocation">Limited Drop VIP Allocation</option>
                  <option value="Press & Collab">Press & Collaborations</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="How can our footwear laboratory assist you today?"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Global Flagships & Concierge Info */}
        <div className="lg:col-span-5 space-y-6 text-xs text-zinc-400">
          <div className="p-6 bg-[#111114] border border-zinc-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Flagship Laboratories
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  Accra Flagship Vault
                </h4>
                <p className="mt-0.5">14 Independence Avenue, Airport Residential, Accra, Ghana</p>
                <span className="text-[11px] text-zinc-500">Mon - Sat: 10:00 - 20:00 GMT</span>
              </div>

              <div className="pt-2 border-t border-zinc-850">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  London Studio
                </h4>
                <p className="mt-0.5">28 Redchurch Street, Shoreditch, London E2 7DD, UK</p>
                <span className="text-[11px] text-zinc-500">Tue - Sun: 11:00 - 19:00 GMT</span>
              </div>

              <div className="pt-2 border-t border-zinc-850">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  Tokyo Archive
                </h4>
                <p className="mt-0.5">5-7-22 Minamiaoyama, Minato-ku, Tokyo, Japan</p>
                <span className="text-[11px] text-zinc-500">Wed - Sun: 12:00 - 20:00 JST</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#111114] border border-zinc-800 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Direct Contact Channels
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>concierge@vanta.com</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone className="w-4 h-4 text-zinc-400" />
                <span>+1 (800) 826-8260 (Mon-Fri 09:00-18:00 EST)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
