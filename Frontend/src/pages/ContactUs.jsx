import React, { useState } from 'react';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! Thank you for contacting Guru Movies Theater.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-32 pb-20  from-gray-950 to-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 drop-shadow-2xl">
          Contact Us
        </h1>
        
        <p className="text-xl md:text-2xl text-center mb-16 text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Have questions about bookings, showtimes, or anything else at Guru Movies Theater? Drop us a message – we're here to help!
        </p>

        {/* Card Wrapper */}
        <div className="perspective-1000">
          <div className="relative transition-all duration-500 hover:rotate-y-6 hover:rotate-x-3 hover:scale-105 hover:shadow-2xl">
            <form 
              onSubmit={handleSubmit}
              className="bg-gray-800/80 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-gray-700/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Name Input */}
              <div className="mb-8">
                <label htmlFor="name" className="block text-lg font-semibold mb-3 text-gray-200">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-all shadow-inner"
                />
              </div>

              {/* Email Input */}
              <div className="mb-8">
                <label htmlFor="email" className="block text-lg font-semibold mb-3 text-gray-200">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-all shadow-inner"
                />
              </div>

              {/* Message Textarea */}
              <div className="mb-10">
                <label htmlFor="message" className="block text-lg font-semibold mb-3 text-gray-200">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help..."
                  className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-all shadow-inner resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-5 px-10 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-[0_8px_20px_rgba(236,72,153,0.5)] hover:-translate-y-1 active:translate-y-1 active:shadow-md transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Our Location', content: 'Guru Movies Theater, Prayagraj, Uttar Pradesh, India' },
            { title: 'Call Us', content: '+91-123-456-7890' },
            { title: 'Email Us', content: 'support@gurumovies.com' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="p-6 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/40 shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-4 text-rose-400">{item.title}</h3>
              <p className="text-gray-300">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactUs;