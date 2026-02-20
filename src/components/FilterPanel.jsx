import React, { useState } from 'react';
import { Shield, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const bodyTypes = ['Any', 'Slim', 'Average', 'Athletic', 'Muscular', 'Stocky', 'Large'];
const tribeOptions = ['Any', 'Bear', 'Jock', 'Twink', 'Otter', 'Daddy', 'Geek', 'Rugged', 'Discreet', 'Leather', 'Clean-cut'];
const positionOptions = ['Any', 'Top', 'Bottom', 'Versatile', 'Side'];
const lookingForOptions = ['Chat', 'Dates', 'Friends', 'Relationship', 'Networking', 'Right Now'];

export default function FilterPanel({ filters, setFilters, onClose }) {
  const [expanded, setExpanded] = useState({
    distance: true,
    age: true,
    body: false,
    tribe: false,
    position: false,
    looking: false,
  });

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const sectionStyle = {
    borderBottom: '1px solid var(--border-subtle)',
    padding: '14px 0',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeInBackdrop 0.2s ease',
    }} onClick={onClose}>
      <div
        style={{
          width: '340px',
          maxWidth: '90vw',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-default)',
          overflowY: 'auto',
          padding: '24px 20px',
          animation: 'slideInRight 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Filters</h2>
          <button
            onClick={() => setFilters({ maxDistance: 100, ageMin: 18, ageMax: 99, bodyType: 'Any', tribe: 'Any', position: 'Any', lookingFor: [], onlineOnly: false, verifiedOnly: false })}
            style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 600 }}
          >Reset All</button>
        </div>

        {/* Online Only */}
        <div style={sectionStyle}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div
              role="switch"
              aria-checked={filters.onlineOnly}
              aria-label="Online Only"
              tabIndex={0}
              onClick={() => setFilters(p => ({ ...p, onlineOnly: !p.onlineOnly }))}
              onKeyDown={e => e.key === 'Enter' && setFilters(p => ({ ...p, onlineOnly: !p.onlineOnly }))}
              style={{
              width: '44px', height: '24px', borderRadius: '12px',
              background: filters.onlineOnly ? 'var(--accent)' : 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', padding: '2px',
              transition: 'background 0.2s', cursor: 'pointer',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                transform: filters.onlineOnly ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.2s', boxShadow: 'var(--shadow-sm)',
              }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Online Only</span>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--online)', marginLeft: '-4px' }} />
          </label>
        </div>

        {/* Verified Only */}
        <div style={sectionStyle}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div
              role="switch"
              aria-checked={filters.verifiedOnly}
              aria-label="Verified Only"
              tabIndex={0}
              onClick={() => setFilters(p => ({ ...p, verifiedOnly: !p.verifiedOnly }))}
              onKeyDown={e => e.key === 'Enter' && setFilters(p => ({ ...p, verifiedOnly: !p.verifiedOnly }))}
              style={{
              width: '44px', height: '24px', borderRadius: '12px',
              background: filters.verifiedOnly ? 'var(--accent)' : 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', padding: '2px',
              transition: 'background 0.2s', cursor: 'pointer',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                transform: filters.verifiedOnly ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.2s', boxShadow: 'var(--shadow-sm)',
              }} />
            </div>
            <Shield size={16} color="var(--accent)" />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Verified Only</span>
          </label>
        </div>

        {/* Distance */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggle('distance')}>
            <span><MapPin size={14} style={{ marginRight: '8px', verticalAlign: '-2px' }} />Distance: {filters.maxDistance}km</span>
            {expanded.distance ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded.distance && (
            <div style={{ marginTop: '12px' }}>
              <input
                type="range" min="1" max="100" value={filters.maxDistance}
                onChange={e => setFilters(p => ({ ...p, maxDistance: +e.target.value }))}
                style={{
                  width: '100%', accentColor: 'var(--accent)',
                  background: 'transparent', border: 'none', padding: 0,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>1km</span><span>100km</span>
              </div>
            </div>
          )}
        </div>

        {/* Age */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggle('age')}>
            <span>Age: {filters.ageMin} - {filters.ageMax}</span>
            {expanded.age ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded.age && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="number" min="18" max="99" value={filters.ageMin}
                  onChange={e => setFilters(p => ({ ...p, ageMin: Math.max(18, +e.target.value) }))}
                  style={{ width: '70px', textAlign: 'center' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>to</span>
                <input
                  type="number" min="18" max="99" value={filters.ageMax}
                  onChange={e => setFilters(p => ({ ...p, ageMax: Math.min(99, +e.target.value) }))}
                  style={{ width: '70px', textAlign: 'center' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body Type */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggle('body')}>
            <span>Body Type: {filters.bodyType}</span>
            {expanded.body ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded.body && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {bodyTypes.map(bt => (
                <button key={bt}
                  onClick={() => setFilters(p => ({ ...p, bodyType: bt }))}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    fontSize: '12px', fontWeight: 500,
                    background: filters.bodyType === bt ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: filters.bodyType === bt ? '#000' : 'var(--text-secondary)',
                    border: `1px solid ${filters.bodyType === bt ? 'var(--accent)' : 'var(--border-default)'}`,
                    transition: 'all 0.2s',
                  }}
                >{bt}</button>
              ))}
            </div>
          )}
        </div>

        {/* Tribe */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggle('tribe')}>
            <span>Tribe: {filters.tribe}</span>
            {expanded.tribe ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded.tribe && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tribeOptions.map(t => (
                <button key={t}
                  onClick={() => setFilters(p => ({ ...p, tribe: t }))}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    fontSize: '12px', fontWeight: 500,
                    background: filters.tribe === t ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: filters.tribe === t ? '#000' : 'var(--text-secondary)',
                    border: `1px solid ${filters.tribe === t ? 'var(--accent)' : 'var(--border-default)'}`,
                    transition: 'all 0.2s',
                  }}
                >{t}</button>
              ))}
            </div>
          )}
        </div>

        {/* Position */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggle('position')}>
            <span>Position: {filters.position}</span>
            {expanded.position ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded.position && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {positionOptions.map(p => (
                <button key={p}
                  onClick={() => setFilters(prev => ({ ...prev, position: p }))}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    fontSize: '12px', fontWeight: 500,
                    background: filters.position === p ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: filters.position === p ? '#000' : 'var(--text-secondary)',
                    border: `1px solid ${filters.position === p ? 'var(--accent)' : 'var(--border-default)'}`,
                    transition: 'all 0.2s',
                  }}
                >{p}</button>
              ))}
            </div>
          )}
        </div>

        {/* Looking For */}
        <div style={sectionStyle}>
          <div style={headerStyle} onClick={() => toggle('looking')}>
            <span>Looking For</span>
            {expanded.looking ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded.looking && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {lookingForOptions.map(l => {
                const isActive = filters.lookingFor?.includes(l);
                return (
                  <button key={l}
                    onClick={() => setFilters(p => ({
                      ...p,
                      lookingFor: isActive ? p.lookingFor.filter(x => x !== l) : [...(p.lookingFor || []), l]
                    }))}
                    style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-full)',
                      fontSize: '12px', fontWeight: 500,
                      background: isActive ? 'var(--accent)' : 'var(--bg-elevated)',
                      color: isActive ? '#000' : 'var(--text-secondary)',
                      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-default)'}`,
                      transition: 'all 0.2s',
                    }}
                  >{l}</button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent)',
            color: '#000',
            fontWeight: 700,
            fontSize: '15px',
            transition: 'opacity 0.2s',
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
