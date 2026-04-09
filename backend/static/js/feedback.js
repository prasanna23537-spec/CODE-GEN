// feedback.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');
  const statusEl = document.getElementById('feedback-status');
  const submitBtn = document.getElementById('submit-btn');
  const myFeedbackSection = document.getElementById('my-feedback');
  const myFeedbackList = document.getElementById('my-feedback-list');

  function setStatus(text, ok = true) {
    statusEl.textContent = text;
    statusEl.style.color = ok ? 'green' : 'crimson';
  }

  function clearStatus() {
    statusEl.textContent = '';
  }

  function validate(payload) {
    const errs = [];
    if (!payload.name) errs.push('Name is required.');
    if (!payload.email) errs.push('Email is required.');
    const r = Number(payload.rating);
    if (!payload.rating || isNaN(r) || r < 1 || r > 5) errs.push('Rating must be between 1 and 5.');
    if (!payload.message || payload.message.trim() === '') errs.push('Message is required.');
    return errs;
  }

  async function submitFeedback(payload) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const res = await fetch('/submit_feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (!res.ok) {
        if (json && json.errors) {
          setStatus(Object.values(json.errors).join(' '), false);
        } else {
          setStatus(json.message || 'Submission failed', false);
        }
        return false;
      }
      setStatus(json.message || 'Feedback submitted successfully', true);
      return true;
    } catch (err) {
      setStatus('Network error. Try again.', false);
      return false;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      rating: form.rating.value,
      message: form.message.value.trim()
    };

    const errors = validate(payload);
    if (errors.length) {
      setStatus(errors.join(' '), false);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const ok = await submitFeedback(payload);
    if (ok) {
      form.message.value = '';
      form.rating.value = '';
      loadMyFeedback();
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  });

  async function loadMyFeedback() {
    try {
      const res = await fetch('/my-feedback', { credentials: 'same-origin' });
      if (!res.ok) {
        myFeedbackSection.style.display = 'none';
        return;
      }
      const json = await res.json();
      if (!json.success || !Array.isArray(json.feedback) || json.feedback.length === 0) {
        myFeedbackSection.style.display = 'none';
        return;
      }
      myFeedbackSection.style.display = 'block';
      myFeedbackList.innerHTML = json.feedback.map(item => `
        <div class="entry">
          <div class="meta">${escapeHtml(item.created_at)} • Rating: ${escapeHtml(String(item.rating))}</div>
          <div class="msg">${escapeHtml(item.message)}</div>
        </div>
      `).join('');
    } catch (err) {
      myFeedbackSection.style.display = 'none';
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  loadMyFeedback();
});
