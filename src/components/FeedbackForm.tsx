import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type Props = { onSuccess?: () => void };

const TAG_OPTIONS = ['Performance', 'UI/UX', 'Documentation', 'Bug Fix', 'Features'];

export default function FeedbackForm({ onSuccess }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [rating, setRating] = useState('5');
  const [tag, setTag] = useState(TAG_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Name is required');
    if (!email.trim()) errs.push('Email is required');
    const r = Number(rating);
    if (!rating || isNaN(r) || r < 1 || r > 5) errs.push('Rating must be 1-5');
    if (!tag) errs.push('Tag required');
    if (!message.trim()) errs.push('Message required');
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const errs = validate();
    if (errs.length) {
      setStatus({ ok: false, text: errs.join('. ') });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/submit_feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, tag, message }),
        credentials: 'same-origin',
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, text: json?.message || Object.values(json?.errors || {}).join(' ') || 'Submission failed' });
      } else {
        setStatus({ ok: true, text: json.message || 'Feedback submitted successfully' });
        setMessage('');
        setRating('5');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setStatus({ ok: false, text: 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-border/50 bg-card p-4">
      <h3 className="font-semibold mb-3">Send Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-muted-foreground">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 bg-input" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-md border px-3 py-2 bg-input" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Rating</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 bg-input">
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Very good</option>
              <option value="3">3 — Good</option>
              <option value="2">2 — Fair</option>
              <option value="1">1 — Poor</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Category</label>
            <select value={tag} onChange={(e) => setTag(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 bg-input">
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="mt-1 w-full rounded-md border px-3 py-2 bg-input" />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Sending…' : 'Submit Feedback'}</button>
          {status && (
            <span style={{ color: status.ok ? 'green' : 'crimson' }}>{status.text}</span>
          )}
        </div>
      </form>
    </div>
  );
}
