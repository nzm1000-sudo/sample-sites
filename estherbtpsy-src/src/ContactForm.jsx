import { useState } from 'react';
import { WA_NUMBER } from './content.jsx';

const RULES = {
  name: (v) => v.trim().length > 1,
  phone: (v) => /^[0-9+\-\s]{9,15}$/.test(v.trim()),
  consent: (v) => v === true
};
const MESSAGES = {
  name: 'נא למלא שם.',
  phone: 'נא למלא מספר טלפון תקין.',
  consent: 'יש לאשר כדי להמשיך.'
};

export default function ContactForm({ className = '' }) {
  const [values, setValues] = useState({ name: '', phone: '', message: '', consent: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: !RULES[key](value) }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const next = Object.fromEntries(Object.keys(RULES).map((k) => [k, !RULES[k](values[k])]));
    setErrors(next);
    const firstInvalid = Object.keys(next).find((k) => next[k]);
    if (firstInvalid) {
      setStatus('יש להשלים את השדות המסומנים.');
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }
    const lines = ['שלום אסתר, פנייה מהאתר:', `שם: ${values.name.trim()}`, `טלפון: ${values.phone.trim()}`];
    if (values.message.trim()) lines.push(`הודעה: ${values.message.trim()}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    setStatus('נפתח חלון וואטסאפ עם ההודעה – נותר רק ללחוץ "שליחה".');
  };

  const fieldProps = (key) => ({
    id: `f-${key}`,
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `f-${key}-error` : undefined
  });

  return (
    <form className={`contact-form ${className}`} noValidate onSubmit={onSubmit} aria-describedby="form-note">
      <h3 className="form-title">השאירו פרטים</h3>
      <div className="field">
        <label htmlFor="f-name">שם מלא <span aria-hidden="true">*</span></label>
        <input {...fieldProps('name')} type="text" autoComplete="name" required aria-required="true" value={values.name} onChange={set('name')} />
        {errors.name && <p className="field-error" id="f-name-error">{MESSAGES.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="f-phone">טלפון נייד <span aria-hidden="true">*</span></label>
        <input {...fieldProps('phone')} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required aria-required="true" value={values.phone} onChange={set('phone')} />
        {errors.phone && <p className="field-error" id="f-phone-error">{MESSAGES.phone}</p>}
      </div>
      <div className="field">
        <label htmlFor="f-message">במה אוכל לעזור? <span className="optional">(לא חובה)</span></label>
        <textarea id="f-message" rows={4} value={values.message} onChange={set('message')} />
      </div>
      <div className="field field-check">
        <input {...fieldProps('consent')} type="checkbox" required aria-required="true" checked={values.consent} onChange={set('consent')} />
        <label htmlFor="f-consent">קראתי את <a href="./privacy.html">מדיניות הפרטיות</a> ואני מסכים/ה שאצור קשר בנושא פנייתי.</label>
        {errors.consent && <p className="field-error" id="f-consent-error">{MESSAGES.consent}</p>}
      </div>
      <button className="btn btn-primary btn-block" type="submit">שליחה בוואטסאפ</button>
      <p className="form-note" id="form-note">הפרטים לא נשמרים באתר – הם נשלחים ישירות אליי בהודעת וואטסאפ.</p>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
