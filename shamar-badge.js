// shamar-badge.js - Badge Inteligente com Respiração Adaptativa
// "O coração do guardião pulsa conforme o perigo"

const ShamarBadge = {
  
  badgeElement: null,
  isExpanded: false,
  currentAnalysis: null,
  
  /**
   * Cria e mostra badge sempre (confiável ou não)
   */
  show(analysis, metadata) {
    // Guarda análise
    this.currentAnalysis = analysis;
    
    // Remove badge anterior se existir
    this.remove();
    
    const { score, level, color } = analysis;
    
    // Determina velocidade de respiração baseada no score
    const breathSpeed = this.getBreathSpeed(score);
    const breathIntensity = this.getBreathIntensity(score);
    
    console.log(`🐺 Badge criado - Score: ${score}, Respiração: ${breathSpeed}`);
    
    // Cria badge
    const badge = document.createElement('div');
    badge.id = 'shamar-smart-badge';
    badge.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 3px solid ${color};
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15),
                  0 0 30px ${color}40;
      font-family: system-ui, -apple-system, sans-serif;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      animation: shamarBadgeBreathe-${breathSpeed.replace('s', '')} ${breathSpeed} ease-in-out infinite;
    `;
    
    badge.innerHTML = `
      <style>
        /* Respiração ZEN - Verde (4s) */
        @keyframes shamarBadgeBreathe-4 {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15),
                        0 0 30px ${color}40;
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 25px rgba(0,0,0,0.2),
                        0 0 40px ${color}60;
          }
        }
        
        /* Respiração ATIVA - Amarelo (3s) */
        @keyframes shamarBadgeBreathe-3 {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15),
                        0 0 30px ${color}40;
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 6px 25px rgba(0,0,0,0.2),
                        0 0 45px ${color}70;
          }
        }
        
        /* Respiração ALERTA - Laranja (2s) */
        @keyframes shamarBadgeBreathe-2 {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15),
                        0 0 30px ${color}40;
          }
          50% {
            transform: scale(1.12);
            box-shadow: 0 8px 30px rgba(0,0,0,0.25),
                        0 0 50px ${color}80;
          }
        }
        
        /* Respiração URGENTE - Vermelho (1.5s) */
        @keyframes shamarBadgeBreathe-1 {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15),
                        0 0 30px ${color}40;
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 10px 35px rgba(0,0,0,0.3),
                        0 0 60px ${color}90;
          }
        }
        
        #shamar-smart-badge:hover {
          transform: scale(1.1);
        }
      </style>
      
      <div style="font-size: 20px; line-height: 1;">🐺</div>
      <div style="font-size: 13px; font-weight: 700; color: ${color}; line-height: 1; margin-top: 2px;">
        ${score}
      </div>
    `;
    
    // Click handler - Expande para card
    badge.addEventListener('click', () => this.expand());
    
    document.body.appendChild(badge);
    this.badgeElement = badge;
    
    // Sincroniza aura com badge (se score < 70)
    if (score < 70) {
      ShamarAura.activate(breathSpeed);
    }
  },
  
  /**
   * Expande badge para card completo IN-PLACE
   */
  expand() {
    if (this.isExpanded || !this.badgeElement) return;
    
    console.log('🐺 Expandindo badge para card completo...');
    
    this.isExpanded = true;
    
    // Remove badge
    this.badgeElement.remove();
    
    // Mostra card completo na mesma posição
    if (typeof window.showShamarCard === 'function') {
      window.showShamarCard(this.currentAnalysis, {});
    } else {
      console.error('🐺 Erro: showShamarCard não encontrada!');
    }
  },
  
  /**
   * Remove badge
   */
  remove() {
    if (this.badgeElement && this.badgeElement.parentElement) {
      this.badgeElement.remove();
      this.badgeElement = null;
    }
    this.isExpanded = false;
  },
  
  /**
   * Determina velocidade de respiração baseada no score
   */
  getBreathSpeed(score) {
    if (score >= 80) return '4s';   // Verde - ZEN
    if (score >= 60) return '3s';   // Amarelo - ATIVO
    if (score >= 40) return '2s';   // Laranja - ALERTA
    return '1.5s';                  // Vermelho - URGENTE
  },
  
  /**
   * Determina intensidade da respiração
   */
  getBreathIntensity(score) {
    if (score >= 80) return 'zen';
    if (score >= 60) return 'active';
    if (score >= 40) return 'alert';
    return 'urgent';
  }
};

// Exporta
if (typeof window !== 'undefined') {
  window.ShamarBadge = ShamarBadge;
  console.log('🐺 Badge Inteligente carregado');
}
