// shamar-highlight.js - Sistema de Grifo Inteligente
// Marca textos manipuladores diretamente no conteúdo

const ShamarHighlight = {
  
  // Cores por severidade
  colors: {
    critical: { bg: '#dc262620', border: '#dc2626', text: 'CRÍTICO' },
    high: { bg: '#ea580c20', border: '#ea580c', text: 'ALTO' },
    medium: { bg: '#ca8a0420', border: '#ca8a04', text: 'MÉDIO' },
    low: { bg: '#eab30820', border: '#eab308', text: 'BAIXO' }
  },
  
  /**
   * Grifa textos suspeitos na página
   */
  highlight(analysis) {
    if (!analysis || !analysis.flags || analysis.flags.length === 0) {
      console.log('🐺 Nenhum texto para grifar');
      return;
    }
    
    console.log(`🐺 Grifando ${analysis.flags.length} padrões detectados...`);
    
    // Remove grifos antigos
    this.removeHighlights();
    
    let totalHighlighted = 0;
    
    // Para cada flag detectada
    analysis.flags.forEach((flag, index) => {
      if (!flag.examples || flag.examples.length === 0) return;
      
      // Pega só primeiros 3 exemplos (performance)
      const examples = flag.examples.slice(0, 3);
      
      examples.forEach(example => {
        const count = this.highlightText(example, flag, index);
        totalHighlighted += count;
      });
    });
    
    console.log(`🐺 ${totalHighlighted} trechos grifados`);
    
    // Adiciona CSS se não existir
    this.injectStyles();
    
    // Ativa tooltips
    this.activateTooltips();
  },
  
  /**
   * Grifa um texto específico
   */
  highlightText(text, flag, flagIndex) {
    let count = 0;
    
    // Escapa regex
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedText})\\b`, 'gi');
    
    // Busca em elementos de texto
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, span, div');
    
    elements.forEach(element => {
      // Ignora elementos já processados ou scripts
      if (element.classList.contains('shamar-processed') || 
          element.querySelector('script, style, .shamar-highlight')) {
        return;
      }
      
      const html = element.innerHTML;
      const newHtml = html.replace(regex, (match) => {
        count++;
        const color = this.colors[flag.severity];
        return `<mark class="shamar-highlight" 
                      data-category="${flag.category}"
                      data-severity="${flag.severity}"
                      data-description="${this.escapeHtml(flag.description)}"
                      style="background: ${color.bg}; 
                             border-bottom: 2px solid ${color.border}; 
                             cursor: help; 
                             padding: 1px 2px;
                             border-radius: 2px;
                             transition: all 0.2s;">${match}</mark>`;
      });
      
      if (newHtml !== html) {
        element.innerHTML = newHtml;
        element.classList.add('shamar-processed');
      }
    });
    
    return count;
  },
  
  /**
   * Remove grifos existentes
   */
  removeHighlights() {
    document.querySelectorAll('.shamar-highlight').forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    
    document.querySelectorAll('.shamar-processed').forEach(el => {
      el.classList.remove('shamar-processed');
    });
  },
  
  /**
   * Ativa tooltips nos grifos
   */
  activateTooltips() {
    document.querySelectorAll('.shamar-highlight').forEach(mark => {
      mark.addEventListener('mouseenter', (e) => this.showTooltip(e));
      mark.addEventListener('mouseleave', () => this.hideTooltip());
    });
  },
  
  /**
   * Mostra tooltip
   */
  showTooltip(event) {
    const mark = event.target;
    const { category, severity, description } = mark.dataset;
    const color = this.colors[severity];
    
    // Remove tooltip existente
    this.hideTooltip();
    
    // Cria tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'shamar-tooltip';
    tooltip.innerHTML = `
      <div style="padding: 8px 12px; background: white; border: 2px solid ${color.border}; 
                  border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
                  max-width: 300px; font-size: 13px; z-index: 999999;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; 
                    color: ${color.border}; font-weight: 600;">
          <span>🐺</span>
          <span>${category}</span>
          <span style="font-size: 10px; background: ${color.bg}; padding: 2px 6px; 
                       border-radius: 3px; border: 1px solid ${color.border};">
            ${color.text}
          </span>
        </div>
        <div style="color: #374151; line-height: 1.4;">
          ${description}
        </div>
        <div style="margin-top: 6px; font-size: 11px; color: #6b7280; 
                    border-top: 1px solid #e5e7eb; padding-top: 4px;">
          Shamar Lens BR - Guardião Digital
        </div>
      </div>
    `;
    
    // Posiciona
    document.body.appendChild(tooltip);
    const rect = mark.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
    
    // Ajustes de borda
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > window.innerHeight + window.scrollY - 10) {
      top = rect.top + window.scrollY - tooltipRect.height - 8;
    }
    
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.opacity = '1';
    tooltip.style.transition = 'opacity 0.2s';
  },
  
  /**
   * Esconde tooltip
   */
  hideTooltip() {
    const tooltip = document.getElementById('shamar-tooltip');
    if (tooltip) tooltip.remove();
  },
  
  /**
   * Injeta CSS básico
   */
  injectStyles() {
    if (document.getElementById('shamar-highlight-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'shamar-highlight-styles';
    style.textContent = `
      .shamar-highlight:hover {
        filter: brightness(0.95);
        transform: translateY(-1px);
      }
    `;
    document.head.appendChild(style);
  },
  
  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Exporta
if (typeof window !== 'undefined') {
  window.ShamarHighlight = ShamarHighlight;
}
