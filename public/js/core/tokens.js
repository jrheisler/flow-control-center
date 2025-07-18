const base = {
  spacing: { xs:'0.25rem', s:'0.5rem', m:'1rem', l:'1.5rem', xl:'2rem' },
  shadows: {
    modal : '0 4px 12px rgba(0,0,0,.3)',
    toast : '0 2px 8px  rgba(0,0,0,.25)',
    dropdown: '0 4px 6px rgba(0,0,0,.15)'
  },
  semantics: {
    error  : '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
    info   : '#2196f3'
  }
};

// merge into every existing theme
Object.values(window.themes).forEach(t => Object.assign(t, base));