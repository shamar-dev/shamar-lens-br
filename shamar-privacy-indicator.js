// shamar-privacy-indicator.js
// Indicador Visual de Privacidade
// "Santuário de Privacidade - Nenhum dado sai do seu dispositivo"

const ShamarPrivacyIndicator = {
  
  indicatorElement: null,
  
  /**
   * Mostra indicador de privacidade
   */
  show() {
    // Só mostra uma vez por sessão
    if (this.indicatorElement) return;
    
    // Verifica se usuário já viu (primeira vez)
    chrome.storage.local.get(['shamar_privacy_seen'], (result) => {
      if (result.shamar_privacy_seen) {
        // Já viu, mostra indicador mínimo
        this.showMinimal();
      } else {
        // Primeira vez, mostra completo
        this.showFull();
        chrome.storage.local.set({ shamar_privacy_seen: true });
      }
    });
  },
  
  /**
   * Mostra indicador completo (primeira vez)
   */
  showFull() {
    const indicator = document.createElement('div');
    indicator.id = 'shamar-privacy-indicator-full';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95));
      color: white;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 320px;
      animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    `;
    
    indicator.innerHTML = `
      <style>
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      </style>
      
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 24px;">🔒</div>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">
            Processado Localmente
          </div>
          <div style="font-size: 12px; opacity: 0.9; line-height: 1.4;">
            Nenhum dado enviado. Análise 100% no seu dispositivo.
          </div>
        </div>
        <button id="shamar-privacy-close"
                style="background: rgba(255,255,255,0.2); border: none; 
                       color: white; font-size: 20px; cursor: pointer; 
                       width: 24px; height: 24px; border-radius: 50%;
                       display: flex; align-items: center; justify-content: center;
                       transition: all 0.2s;"
                onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
      </div>
    `;
    
    document.body.appendChild(indicator);
    this.indicatorElement = indicator;
    
    // Event listeners
    const closeBtn = indicator.querySelector('#shamar-privacy-close');
    closeBtn?.addEventListener('click', () => this.hide());
    
    indicator.addEventListener('click', (e) => {
      if (e.target === indicator || e.target.closest('#shamar-privacy-close')) return;
      // Clicar no indicador mostra mais detalhes
      this.showDetails();
    });
    
    // Auto-fecha após 8 segundos
    setTimeout(() => {
      if (document.getElementById('shamar-privacy-indicator-full')) {
        this.hide();
      }
    }, 8000);
  },
  
  /**
   * Mostra indicador mínimo (já visto antes)
   */
  showMinimal() {
    const indicator = document.createElement('div');
    indicator.id = 'shamar-privacy-indicator-minimal';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(16, 185, 129, 0.9);
      color: white;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 600;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      animation: fadeIn 0.3s ease-out;
    `;
    
    indicator.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <span>🔒</span>
      <span>100% Local</span>
    `;
    
    document.body.appendChild(indicator);
    this.indicatorElement = indicator;
    
    // Hover mostra tooltip
    indicator.addEventListener('mouseenter', () => {
      this.showTooltip(indicator);
    });
    
    // Remove após 5 segundos
    setTimeout(() => {
      if (document.getElementById('shamar-privacy-indicator-minimal')) {
        indicator.style.animation = 'fadeIn 0.3s reverse';
        setTimeout(() => indicator.remove(), 300);
      }
    }, 5000);
  },
  
  /**
   * Mostra tooltip com mais informações
   */
  showTooltip(parentElement) {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      right: 0;
      margin-bottom: 8px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 12px;
      border-radius: 8px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    tooltip.textContent = 'Análise processada localmente. Nenhum dado enviado.';
    parentElement.appendChild(tooltip);
    
    // Remove ao sair do hover
    parentElement.addEventListener('mouseleave', () => {
      tooltip.remove();
    }, { once: true });
  },
  
  /**
   * Mostra detalhes completos de privacidade
   */
  showDetails() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999999;
      padding: 20px;
    `;
    
    modal.innerHTML = `
      <div style="background: white; border-radius: 16px; max-width: 500px; 
                  padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🔒</span>
            <h2 style="margin: 0; font-size: 24px; color: #111;">Santuário de Privacidade</h2>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()"
                  style="background: none; border: none; font-size: 32px; 
                         cursor: pointer; color: #9ca3af;">×</button>
        </div>
        
        <div style="line-height: 1.7; color: #374151;">
          <p style="margin-bottom: 16px;">
            <strong>Shamar Lens processa 100% localmente no seu dispositivo.</strong>
          </p>
          
          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #16a34a;">
            <strong style="color: #16a34a;">✅ O que fazemos:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;">
              <li>Análise acontece no seu navegador</li>
              <li>Nenhum dado é enviado para servidores</li>
              <li>Nenhuma informação é coletada</li>
              <li>Nenhum rastreamento é feito</li>
            </ul>
          </div>
          
          <div style="background: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <strong style="color: #dc2626;">❌ O que NÃO fazemos:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;">
              <li>Não enviamos dados para servidores</li>
              <li>Não criamos perfis de usuário</li>
              <li>Não rastreamos sua navegação</li>
              <li>Não vendemos ou compartilhamos dados</li>
            </ul>
          </div>
          
          <p style="margin-top: 16px; font-size: 13px; color: #6b7280;">
            Sua privacidade é sagrada. Por isso, toda análise acontece localmente, 
            sem nenhuma comunicação externa.
          </p>
        </div>
        
        <button onclick="this.parentElement.parentElement.parentElement.remove()"
                style="width: 100%; margin-top: 24px; padding: 12px; 
                       background: rgba(16, 185, 129, 0.1);
                       border: 2px solid rgba(16, 185, 129, 0.3); 
                       border-radius: 8px; font-weight: 600; cursor: pointer;">
          Entendi - Fechar
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },
  
  /**
   * Esconde indicador
   */
  hide() {
    if (this.indicatorElement && this.indicatorElement.parentElement) {
      this.indicatorElement.style.animation = 'slideInRight 0.5s reverse';
      setTimeout(() => {
        if (this.indicatorElement?.parentElement) {
          this.indicatorElement.remove();
        }
        this.indicatorElement = null;
      }, 500);
    }
  }
};

// Mostra indicador quando extensão carrega
if (typeof window !== 'undefined') {
  window.ShamarPrivacyIndicator = ShamarPrivacyIndicator;
  
  // Mostra após pequeno delay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => ShamarPrivacyIndicator.show(), 1000);
    });
  } else {
    setTimeout(() => ShamarPrivacyIndicator.show(), 1000);
  }
  
  console.log('🔒 Indicador de Privacidade carregado');
}
