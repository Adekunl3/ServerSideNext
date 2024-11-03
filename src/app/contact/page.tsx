// src/app/contact/page.tsx
"use client"

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendContactForm({ email, fullName, message });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-xl text-red-400 font-bold mb-4">Curious?</h1>
      {success ? (
        <div className="text-green-500 font-bold">
            <h2 className="text-4xl font-bold mb-4">Email Sent Successfully!</h2>
          <p>Thank you for contacting Fidu Stores. We will get back to you shortly.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-primary mt-4"
          >
            Go to Homepage
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 text-xl">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block  font-medium text-gray-700 text-xl">Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label htmlFor="message" className="block  font-medium text-gray-700 text-xl">Request/Complaint</label>
            <textarea
              id="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

async function sendContactForm(data: { email: string, fullName: string, message: string }) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send your message. Please try again.');
  }

  return response.json();
}
