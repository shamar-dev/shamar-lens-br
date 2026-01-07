// shamar-modes.js
// Sistema de Modos de Operação
// "Respeitando o ritmo e necessidade de cada usuário"

const ShamarModes = {
  
  /**
   * Modos disponíveis
   */
  MODES: {
    ACTIVE: {
      id: 'active',
      name: 'Ativo',
      description: 'Análise completa com todos os alertas visíveis',
      badgeVisibility: 'always',
      auraThreshold: 70,
      tooltipLevel: 'full',
      icon: '🐺'
    },
    
    CONTEMPLATIVE: {
      id: 'contemplative',
      name: 'Contemplativo',
      description: 'Apenas alertas críticos, badge mínimo, respiração zen',
      badgeVisibility: 'minimal',
      auraThreshold: 50, // Só ativa para scores muito baixos
      tooltipLevel: 'essential',
      icon: '🧘'
    },
    
    EDUCATIONAL: {
      id: 'educational',
      name: 'Educativo',
      description: 'Todos os tooltips e explicações, modo aprendizado',
      badgeVisibility: 'always',
      auraThreshold: 70,
      tooltipLevel: 'extended',
      icon: '📚'
    },
    
    SILENT: {
      id: 'silent',
      name: 'Silencioso',
      description: 'Análise em background, sem elementos visuais',
      badgeVisibility: 'none',
      auraThreshold: 0, // Nunca ativa
      tooltipLevel: 'none',
      icon: '🔇'
    }
  },
  
  /**
   * Modo atual (inicializa como 'active' para garantir que badge apareça)
   */
  currentMode: 'active',
  
  /**
   * Inicializa modo
   */
  init() {
    // Define modo padrão imediatamente (antes de carregar preferência)
    // Isso garante que badge apareça mesmo se storage for lento
    if (!this.currentMode || this.currentMode === 'active') {
      this.currentMode = 'active';
      console.log('🐺 Modo inicializado como ACTIVE (padrão)');
    }
    
    // Carrega preferência salva (assíncrono)
    chrome.storage.local.get(['shamar_mode'], (result) => {
      if (result.shamar_mode && this.MODES[result.shamar_mode.toUpperCase()]) {
        this.setMode(result.shamar_mode);
      } else {
        // Já está como 'active' por padrão, mas garante
        if (this.currentMode !== 'active') {
          this.setMode('active');
        }
      }
    });
  },
  
  /**
   * Define modo
   */
  setMode(modeId) {
    const mode = this.MODES[modeId.toUpperCase()];
    if (!mode) {
      console.warn('🐺 Modo inválido:', modeId);
      return;
    }
    
    this.currentMode = mode.id;
    
    // Salva preferência
    chrome.storage.local.set({ shamar_mode: mode.id });
    
    // Aplica configurações do modo
    this.applyModeSettings(mode);
    
    console.log(`🐺 Modo alterado para: ${mode.name} (${mode.icon})`);
    
    // Notifica outros módulos
    this.notifyModeChange(mode);
  },
  
  /**
   * Aplica configurações do modo
   */
  applyModeSettings(mode) {
    // Badge
    if (mode.badgeVisibility === 'none') {
      if (window.ShamarBadge) {
        window.ShamarBadge.remove();
      }
    } else if (mode.badgeVisibility === 'minimal') {
      // Badge menor e mais sutil
      this.setMinimalBadge();
    }
    
    // Aura
    if (window.ShamarAura) {
      // Aura só ativa se score < threshold
      window.ShamarAura.setThreshold(mode.auraThreshold);
    }
  },
  
  /**
   * Configura badge minimal
   */
  setMinimalBadge() {
    // Badge menor, mais transparente, respiração mais lenta
    const style = document.createElement('style');
    style.id = 'shamar-minimal-mode';
    style.textContent = `
      #shamar-smart-badge {
        width: 45px !important;
        height: 45px !important;
        opacity: 0.7 !important;
        border-width: 2px !important;
      }
    `;
    
    if (!document.getElementById('shamar-minimal-mode')) {
      document.head.appendChild(style);
    }
  },
  
  /**
   * Notifica mudança de modo
   */
  notifyModeChange(mode) {
    // Dispara evento customizado
    window.dispatchEvent(new CustomEvent('shamar:mode-changed', {
      detail: { mode }
    }));
  },
  
  /**
   * Verifica se deve mostrar badge
   */
  shouldShowBadge(score) {
    // Se modo não está definido ainda, assume 'active' (sempre mostra)
    if (!this.currentMode) {
      return true;
    }
    
    const modeKey = this.currentMode.toUpperCase();
    const mode = this.MODES[modeKey];
    
    // Se modo não encontrado, assume 'active' (sempre mostra)
    if (!mode) {
      console.warn('🐺 Modo não encontrado:', this.currentMode, '- assumindo ACTIVE');
      return true;
    }
    
    if (mode.badgeVisibility === 'none') return false;
    if (mode.badgeVisibility === 'minimal') {
      // Só mostra se score < 60 (crítico)
      return score < 60;
    }
    
    return true; // 'always'
  },
  
  /**
   * Verifica se deve ativar aura
   */
  shouldActivateAura(score) {
    const mode = this.MODES[this.currentMode.toUpperCase()];
    return score < mode.auraThreshold;
  },
  
  /**
   * Retorna nível de tooltip
   */
  getTooltipLevel() {
    const mode = this.MODES[this.currentMode.toUpperCase()];
    return mode.tooltipLevel;
  },
  
  /**
   * Retorna modo atual
   */
  getCurrentMode() {
    return this.MODES[this.currentMode.toUpperCase()];
  },
  
  /**
   * Lista todos os modos
   */
  getAllModes() {
    return Object.values(this.MODES);
  }
};

// Inicializa ao carregar
if (typeof window !== 'undefined') {
  window.ShamarModes = ShamarModes;
  
  // Inicializa quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ShamarModes.init());
  } else {
    ShamarModes.init();
  }
  
  console.log('🐺 Sistema de Modos carregado');
}
