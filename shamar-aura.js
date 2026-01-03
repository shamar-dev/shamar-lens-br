// shamar-aura.js - Aura Dourada de Proteção
// "O Guardião está ativo. Respire tranquilo."

const ShamarAura = {
  
  auraElement: null,
  
  /**
   * Ativa aura dourada quando detecta manipulação
   * @param {string} breathSpeed - Velocidade da respiração (ex: '2s')
   */
  activate(breathSpeed = '3s') {
    if (this.auraElement) return; // Já ativa
    
    console.log(`🐺✨ Ativando Aura de Proteção (${breathSpeed})...`);
    
    // Cria elemento da aura
    const aura = document.createElement('div');
    aura.id = 'shamar-divine-aura';
    aura.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 999997;
      border: 3px solid rgba(255, 223, 128, 0.5);
      box-shadow: inset 0 0 60px rgba(255, 223, 128, 0.25),
                  0 0 40px rgba(255, 223, 128, 0.15);
      animation: shamarAuraBreathe ${breathSpeed} ease-in-out infinite;
      border-radius: 8px;
      margin: 4px;
    `;
    
    // Adiciona CSS da animação se não existir
    if (!document.getElementById('shamar-aura-styles')) {
      const style = document.createElement('style');
      style.id = 'shamar-aura-styles';
      style.textContent = `
        @keyframes shamarAuraBreathe {
          0%, 100% {
            border-color: rgba(255, 223, 128, 0.35);
            box-shadow: inset 0 0 60px rgba(255, 223, 128, 0.25),
                        0 0 40px rgba(255, 223, 128, 0.15);
          }
          50% {
            border-color: rgba(255, 223, 128, 0.6);
            box-shadow: inset 0 0 80px rgba(255, 223, 128, 0.4),
                        0 0 60px rgba(255, 223, 128, 0.3);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(aura);
    this.auraElement = aura;
    
    console.log('✨ Aura Divina ativada - Sincronizada com badge');
  },
  
  /**
   * Desativa aura
   */
  deactivate() {
    if (!this.auraElement) return;
    
    console.log('🐺 Desativando Aura de Proteção...');
    
    // Fade out suave
    this.auraElement.style.transition = 'opacity 1s ease-out';
    this.auraElement.style.opacity = '0';
    
    setTimeout(() => {
      if (this.auraElement && this.auraElement.parentElement) {
        this.auraElement.remove();
        this.auraElement = null;
      }
    }, 1000);
  },
  
  /**
   * Verifica se aura está ativa
   */
  isActive() {
    return this.auraElement !== null;
  }
};

// Exporta
if (typeof window !== 'undefined') {
  window.ShamarAura = ShamarAura;
  console.log('🐺✨ Sistema de Aura Divina carregado');
}
