// shamar-reflection.js
// Sistema de Reflexão Pós-Análise
// "Não dar respostas, mas fazer perguntas que iluminam"

const ShamarReflection = {
  
  /**
   * Mostra diálogo de reflexão após análise
   */
  showReflectionDialog(analysis, metadata) {
    // Só mostra se modo educativo ou se usuário pedir
    const mode = window.ShamarModes?.getCurrentMode();
    if (mode?.id !== 'educational') {
      return; // Modo silencioso ou contemplativo não mostra
    }
    
    // Delay para permitir "respiração" antes da reflexão
    setTimeout(() => {
      this.createReflectionDialog(analysis, metadata);
    }, 2000); // 2 segundos após análise
  },
  
  /**
   * Cria diálogo de reflexão
   */
  createReflectionDialog(analysis, metadata) {
    // Remove diálogo anterior se existir
    this.removeDialog();
    
    const questions = window.ShamarCompassionateMessages?.getReflectionQuestions(analysis.score) || [];
    
    const dialog = document.createElement('div');
    dialog.id = 'shamar-reflection-dialog';
    dialog.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      background: white;
      border: 2px solid rgba(255, 223, 128, 0.6);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      z-index: 999998;
      max-width: 400px;
      font-family: system-ui, -apple-system, sans-serif;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    dialog.innerHTML = `
      <style>
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .shamar-reflection-question {
          margin: 12px 0;
          padding: 12px;
          background: #f9fafb;
          border-left: 3px solid rgba(255, 223, 128, 0.6);
          border-radius: 6px;
          font-size: 13px;
          color: #374151;
          line-height: 1.6;
        }
        
        .shamar-reflection-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        
        .shamar-reflection-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .shamar-reflection-btn-primary {
          background: rgba(255, 223, 128, 0.2);
          border: 2px solid rgba(255, 223, 128, 0.6);
          color: #374151;
        }
        
        .shamar-reflection-btn-primary:hover {
          background: rgba(255, 223, 128, 0.3);
        }
        
        .shamar-reflection-btn-secondary {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .shamar-reflection-btn-secondary:hover {
          background: #e5e7eb;
        }
      </style>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">💭</span>
          <div>
            <div style="font-weight: 700; font-size: 16px; color: #111;">Momento de Reflexão</div>
            <div style="font-size: 11px; color: #6b7280;">Perguntas para seu discernimento</div>
          </div>
        </div>
        <button id="shamar-reflection-close"
                style="background: none; border: none; font-size: 24px; cursor: pointer; 
                       color: #9ca3af; line-height: 1; padding: 0; width: 28px; height: 28px;
                       border-radius: 6px; transition: all 0.2s;"
                onmouseover="this.style.background='#f3f4f6'; this.style.color='#374151';"
                onmouseout="this.style.background='none'; this.style.color='#9ca3af';">×</button>
      </div>
      
      <div style="font-size: 13px; color: #6b7280; margin-bottom: 16px; line-height: 1.6;">
        Após analisar este conteúdo, que tal refletirmos juntos? Não há respostas certas ou erradas.
      </div>
      
      <div id="shamar-reflection-questions">
        ${questions.slice(0, 3).map(q => `
          <div class="shamar-reflection-question">
            ${q}
          </div>
        `).join('')}
      </div>
      
      <div class="shamar-reflection-actions">
        <button class="shamar-reflection-btn shamar-reflection-btn-primary" id="shamar-reflection-more">
          Ver mais perguntas
        </button>
        <button class="shamar-reflection-btn shamar-reflection-btn-secondary" id="shamar-reflection-close-btn">
          Fechar
        </button>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Event listeners
    const closeBtn = dialog.querySelector('#shamar-reflection-close');
    const closeBtn2 = dialog.querySelector('#shamar-reflection-close-btn');
    const moreBtn = dialog.querySelector('#shamar-reflection-more');
    
    const closeDialog = () => this.removeDialog();
    
    closeBtn?.addEventListener('click', closeDialog);
    closeBtn2?.addEventListener('click', closeDialog);
    
    moreBtn?.addEventListener('click', () => {
      const questionsContainer = dialog.querySelector('#shamar-reflection-questions');
      if (questionsContainer) {
        questionsContainer.innerHTML = questions.map(q => `
          <div class="shamar-reflection-question">
            ${q}
          </div>
        `).join('');
        moreBtn.style.display = 'none';
      }
    });
    
    // Auto-fecha após 30 segundos (opcional)
    setTimeout(() => {
      if (document.getElementById('shamar-reflection-dialog')) {
        dialog.style.animation = 'slideUp 0.4s reverse';
        setTimeout(closeDialog, 400);
      }
    }, 30000);
  },
  
  /**
   * Remove diálogo
   */
  removeDialog() {
    const dialog = document.getElementById('shamar-reflection-dialog');
    if (dialog) {
      dialog.remove();
    }
  },
  
  /**
   * Mostra momento de pausa antes da análise
   */
  showPauseMoment() {
    const pauseMsg = window.ShamarCompassionateMessages?.getPauseMessage();
    if (!pauseMsg) return;
    
    // Cria indicador sutil de "processando com cuidado"
    const indicator = document.createElement('div');
    indicator.id = 'shamar-pause-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid rgba(255, 223, 128, 0.4);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      color: #6b7280;
      z-index: 999997;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      animation: fadeInOut 0.5s ease-in-out;
    `;
    
    indicator.innerHTML = `
      <style>
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      </style>
      ${pauseMsg.text}
    `;
    
    document.body.appendChild(indicator);
    
    // Remove após delay
    setTimeout(() => {
      if (indicator.parentElement) {
        indicator.style.animation = 'fadeInOut 0.5s reverse';
        setTimeout(() => indicator.remove(), 500);
      }
    }, pauseMsg.duration);
  }
};

// Exporta
if (typeof window !== 'undefined') {
  window.ShamarReflection = ShamarReflection;
  console.log('💭 Sistema de Reflexão carregado');
}
