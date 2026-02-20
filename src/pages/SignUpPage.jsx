import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Camera, ChevronRight, ChevronLeft, Check, Upload, X } from 'lucide-react';
import DemonLogo from '../components/DemonLogo';
import { OnlyManWordmark } from '../components/DemonLogo';

const TRIBES = ['Bear', 'Jock', 'Twink', 'Otter', 'Daddy', 'Geek', 'Rugged', 'Discreet', 'Leather', 'Clean-cut'];
const INTERESTS = ['Gym', 'Travel', 'Music', 'Cooking', 'Photography', 'Hiking', 'Movies', 'Gaming', 'Art', 'Dancing', 'Yoga', 'Reading', 'Surfing', 'Cycling', 'Running', 'Wine', 'Coffee', 'Dogs', 'Tattoos', 'Fashion', 'Tech', 'Outdoors', 'Nightlife', 'Food'];
const LOOKING_FOR = ['Chat', 'Dates', 'Friends', 'Relationship', 'Networking', 'Right Now'];
const BODY_TYPES = ['Slim', 'Average', 'Athletic', 'Muscular', 'Stocky', 'Large'];
const POSITIONS = ['Top', 'Bottom', 'Versatile', 'Side', 'Prefer not to say'];

export default function SignUpPage({ onSignUp }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    bio: '',
    tribe: '',
    interests: [],
    lookingFor: [],
    bodyType: '',
    position: '',
    height: '',
    weight: '',
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const toggleArrayField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.email.includes('@')) errs.email = 'Enter a valid email';
      if (form.password.length < 6) errs.password = 'At least 6 characters';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
    }
    if (step === 1) {
      if (!form.name.trim()) errs.name = 'Name is required';
      const age = parseInt(form.age);
      if (!age || age < 18 || age > 99) errs.age = 'Must be 18+';
    }
    if (step === 3) {
      if (form.interests.length < 2) errs.interests = 'Pick at least 2 interests';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const handleFinish = () => {
    if (onSignUp) {
      onSignUp({
        ...form,
        age: parseInt(form.age),
        avatar: avatarPreview || `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${form.name}&backgroundColor=1a1a1a`,
        photos: [],
        albums: [],
      });
    }
    navigate('/');
  };

  const steps = [
    // Step 0: Account
    () => (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Create Account</h2>
        <p style={{ color: 'var(--accent)', fontSize: 15, marginBottom: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.6 }}>
          ⚜️ Made in Montréal.<br />Matches made for real life.
        </p>

        <div style={{
          margin: '0 0 24px', padding: '12px 16px', borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.10), rgba(255,170,0,0.05))',
          border: '1px solid rgba(255,215,0,0.25)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#ffd700' }}>
            ⭐ First 1,000 users get Premium for life — free!
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,215,0,0.7)', marginTop: 4 }}>
            Unlimited Right Now boosts &amp; exclusive perks, forever.
          </div>
        </div>

        <FieldLabel label="Email" error={errors.email}>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={e => updateField('email', e.target.value)}
            style={inputStyle}
          />
        </FieldLabel>

        <FieldLabel label="Password" error={errors.password}>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => updateField('password', e.target.value)}
              style={inputStyle}
            />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FieldLabel>

        <FieldLabel label="Confirm Password" error={errors.confirmPassword}>
          <input
            type="password"
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChange={e => updateField('confirmPassword', e.target.value)}
            style={inputStyle}
          />
        </FieldLabel>
      </div>
    ),

    // Step 1: Profile basics
    () => (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>About You</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Let others know who you are</p>

        {/* Avatar upload */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button onClick={() => fileRef.current?.click()} style={{
            width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
            border: '3px solid var(--accent)', background: 'var(--bg-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 20px rgba(0,255,102,0.2)',
          }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={32} color="var(--accent)" />
            )}
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Upload size={14} color="#000" />
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarPick} hidden />
        </div>

        <FieldLabel label="Display Name" error={errors.name}>
          <input type="text" placeholder="Your name" value={form.name} onChange={e => updateField('name', e.target.value)} style={inputStyle} />
        </FieldLabel>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldLabel label="Age" error={errors.age}>
            <input type="number" placeholder="18+" min="18" max="99" value={form.age} onChange={e => updateField('age', e.target.value)} style={inputStyle} />
          </FieldLabel>
          <FieldLabel label="Height (cm)">
            <input type="text" placeholder="e.g. 180" value={form.height} onChange={e => updateField('height', e.target.value)} style={inputStyle} />
          </FieldLabel>
        </div>

        <FieldLabel label="Bio">
          <textarea placeholder="Tell others about yourself..." value={form.bio} onChange={e => updateField('bio', e.target.value)}
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} maxLength={300} />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{form.bio.length}/300</div>
        </FieldLabel>
      </div>
    ),

    // Step 2: Identity
    () => (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Your Identity</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Help us find your match</p>

        <FieldLabel label="Tribe">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TRIBES.map(t => (
              <ChipSelect key={t} label={t} selected={form.tribe === t} onSelect={() => updateField('tribe', t)} />
            ))}
          </div>
        </FieldLabel>

        <FieldLabel label="Body Type">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BODY_TYPES.map(b => (
              <ChipSelect key={b} label={b} selected={form.bodyType === b} onSelect={() => updateField('bodyType', b)} />
            ))}
          </div>
        </FieldLabel>

        <FieldLabel label="Position">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {POSITIONS.map(p => (
              <ChipSelect key={p} label={p} selected={form.position === p} onSelect={() => updateField('position', p)} />
            ))}
          </div>
        </FieldLabel>

        <FieldLabel label="Looking For">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LOOKING_FOR.map(l => (
              <ChipSelect key={l} label={l} selected={form.lookingFor.includes(l)} onSelect={() => toggleArrayField('lookingFor', l)} />
            ))}
          </div>
        </FieldLabel>
      </div>
    ),

    // Step 3: Interests
    () => (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Interests</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Pick at least 2 things you love</p>
        {errors.interests && <p style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 8 }}>{errors.interests}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {INTERESTS.map(i => (
            <ChipSelect key={i} label={i} selected={form.interests.includes(i)} onSelect={() => toggleArrayField('interests', i)} />
          ))}
        </div>
      </div>
    ),

    // Step 4: Done
    () => (
      <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'center', paddingTop: 30 }}>
        <DemonLogo size={80} glow />
        <h2 style={{ fontSize: 26, fontWeight: 900, marginTop: 20, marginBottom: 8 }}>You're In! 🔥</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
          Welcome to the most daring community. Time to explore, connect, and be yourself.
        </p>

        {/* Premium early adopter banner */}
        {(() => {
          const count = parseInt(localStorage.getItem('om_userCount') || '0', 10);
          const nextNumber = count + 1;
          if (nextNumber <= 1000) {
            return (
              <div style={{
                marginTop: 20, padding: '16px 20px', borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,170,0,0.06))',
                border: '1px solid rgba(255,215,0,0.3)',
                animation: 'fadeIn 0.5s ease',
              }}>
                <div style={{ fontSize: 24, textAlign: 'center', marginBottom: 6 }}>⭐🎉</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#ffd700', textAlign: 'center', marginBottom: 4 }}>
                  You're Early Adopter #{nextNumber}!
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,215,0,0.8)', textAlign: 'center', lineHeight: 1.5 }}>
                  The first 1,000 members get <strong style={{ color: '#ffd700' }}>lifetime Premium</strong> — free unlimited Right Now boosts, forever.
                </p>
                <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                  {1000 - nextNumber} spots remaining
                </div>
              </div>
            );
          }
          return null;
        })()}

        <div style={{
          marginTop: 32, padding: '20px', borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', overflow: 'hidden',
              border: '2px solid var(--accent)', background: 'var(--bg-elevated)',
            }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent)', fontSize: 22, fontWeight: 800 }}>
                  {form.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{form.name}, {form.age}</div>
              <div style={{ fontSize: 12, color: 'var(--accent)' }}>{form.tribe || 'No tribe'} · {form.bodyType || 'Not set'}</div>
            </div>
          </div>
          {form.bio && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{form.bio}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
            {form.interests.slice(0, 6).map(i => (
              <span key={i} style={{ padding: '3px 8px', borderRadius: 99, background: 'rgba(0,255,102,0.1)', fontSize: 11, color: 'var(--accent)' }}>{i}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  ];

  const totalSteps = steps.length;
  const isLast = step === totalSteps - 1;

  return (
    <div style={{
      minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DemonLogo size={28} glow />
          <OnlyManWordmark height={18} />
        </div>
        {step > 0 && step < totalSteps - 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 20px', marginTop: 12, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? 'var(--accent)' : 'var(--border-default)',
              transition: 'background 0.3s',
              boxShadow: i <= step ? '0 0 8px var(--accent-glow)' : 'none',
            }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Step {step + 1} of {totalSteps}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 20px 100px', overflowY: 'auto' }}>
        {steps[step]()}
      </div>

      {/* Bottom action */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 20px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0))',
        background: 'var(--bg-primary)',
      }}>
        <button
          onClick={isLast ? handleFinish : nextStep}
          style={{
            width: '100%', padding: '16px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent)', color: '#000', fontWeight: 800, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 0 24px var(--accent-glow)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
        >
          {isLast ? (
            <><Check size={20} /> Enter ONLYMAN</>
          ) : (
            <>Continue <ChevronRight size={18} /></>
          )}
        </button>

        {step === 0 && (
          <>
            <button
              onClick={() => navigate('/')}
              style={{ width: '100%', marginTop: 8, padding: '12px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}
            >
              Already have an account? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Log in</span>
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#00ff66', marginTop: 8, lineHeight: 1.6 }}>
              <span onClick={() => navigate('/terms')} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Terms of Service</span>
              {' '}&middot;{' '}
              <span onClick={() => navigate('/privacy')} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Helpers ── */

function FieldLabel({ label, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <div style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function ChipSelect({ label, selected, onSelect }) {
  return (
    <button onClick={onSelect} style={{
      padding: '8px 16px', borderRadius: 99,
      background: selected ? 'rgba(0,255,102,0.15)' : 'var(--bg-elevated)',
      border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border-default)'}`,
      color: selected ? 'var(--accent)' : 'var(--text-secondary)',
      fontSize: 13, fontWeight: selected ? 600 : 400,
      transition: 'all 0.15s',
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      {selected && <Check size={13} />}
      {label}
    </button>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-default)',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: 16, /* Prevents auto-zoom on iOS */
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  minHeight: 44, /* Touch target */
};
