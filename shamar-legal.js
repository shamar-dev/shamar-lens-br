// DISCLAIMER LEGAL - Shamar Lens BR
// Proteção Jurídica e Transparência

const ShamarLegalDisclaimer = {
  
  /**
   * Texto do disclaimer legal
   */
  text: {
    short: `Análise automatizada educativa. Não constitui acusação ou censura.`,
    
    full: `⚖️ AVISO LEGAL

O Shamar Lens é uma ferramenta EDUCATIVA de análise automatizada de conteúdo textual.

📊 NATUREZA DA ANÁLISE:
• Baseada em critérios linguísticos objetivos e verificáveis
• Processamento automatizado por algoritmo, não opinião editorial
• Analisa TEXTOS específicos, não instituições ou veículos
• Score gerado por metodologia pública e auditável

🎓 PROPÓSITO EDUCATIVO:
• Desenvolver senso crítico do leitor
• Ensinar padrões de manipulação informacional
• Promover literacia midiática
• NÃO substitui julgamento próprio do usuário

🔓 TRANSPARÊNCIA:
• Código-fonte aberto e auditável
• Metodologia completamente documentada
• Sem fins lucrativos
• Critérios técnicos públicos

⚠️ LIMITAÇÕES:
• Análise automatizada pode conter erros
• Contexto completo requer leitura humana
• Ferramenta complementar, não definitiva
• Usuário mantém total liberdade de interpretação

🚫 NÃO FAZEMOS:
• Bloqueio ou censura de conteúdo
• Acusações sobre veículos ou jornalistas
• Juízo de valor editorial
• Interferência no acesso à informação

✅ O QUE FAZEMOS:
• Identificar padrões linguísticos objetivos
• Calcular métricas verificáveis
• Educar sobre técnicas de manipulação
• Empoderar o leitor com informação

📜 RESPONSABILIDADE:
O usuário é o único responsável por suas próprias conclusões sobre o conteúdo analisado. Esta ferramenta não constitui assessoria jornalística, legal ou editorial.

🔮 MISSÃO:
Servir à Verdade através da educação e transparência, nunca através da censura ou acusação.

Versão 1.0 - Dezembro 2025
Shamar Lens BR - Guardião Digital Educativo`,
    
    inline: `📊 Análise automatizada | 🎓 Ferramenta educativa | ⚖️ Sem censura`,
    
    methodology: `🔬 METODOLOGIA DE ANÁLISE

CRITÉRIOS OBJETIVOS (100 pontos):

1️⃣ FONTES (35 pontos):
   • Identifica citações de fontes oficiais
   • Conta referências nominais
   • Detecta fontes anônimas
   • Critério: Verificabilidade da informação

2️⃣ TOM (25 pontos):
   • Calcula proporção palavras factuais vs emotivas
   • Analisa adjetivação excessiva
   • Identifica linguagem sensacionalista
   • Critério: Objetividade jornalística

3️⃣ ESTRUTURA (20 pontos):
   • Verifica coerência título-corpo
   • Avalia profundidade do texto
   • Analisa organização textual
   • Critério: Qualidade jornalística

4️⃣ PADRÕES (20 pontos):
   • Detecta 65 padrões linguísticos
   • Clickbait, fake news, polarização
   • Baseado em literatura acadêmica
   • Critério: Sinais de manipulação

INTERPRETAÇÃO DO SCORE:
• 80-100: Características jornalísticas sólidas
• 60-79:  Atenção - elementos opinativos
• 40-59:  Suspeito - sinais de manipulação
• 0-39:   Não confiável - múltiplos alertas

IMPORTANTE: Score não é "verdade absoluta".
É ferramenta para AUXILIAR senso crítico.`
  },
  
  /**
   * Mostra disclaimer completo
   */
  showFull() {
    const modal = document.createElement('div');
    modal.id = 'shamar-legal-disclaimer-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999999;
      padding: 20px;
      animation: fadeIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
      
      <div style="background: white; border-radius: 16px; max-width: 600px; 
                  max-height: 90vh; overflow-y: auto; padding: 32px;
                  box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">⚖️</span>
            <h2 style="margin: 0; font-size: 24px; color: #111;">Aviso Legal</h2>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()"
                  style="background: none; border: none; font-size: 32px; 
                         cursor: pointer; color: #9ca3af; line-height: 1;">×</button>
        </div>
        
        <div style="white-space: pre-line; line-height: 1.7; color: #374151; font-size: 14px;">
${this.text.full}
        </div>
        
        <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <button onclick="this.parentElement.parentElement.parentElement.remove()"
                  style="width: 100%; padding: 12px; background: rgba(255, 223, 128, 0.2);
                         border: 2px solid rgba(255, 223, 128, 0.6); border-radius: 8px;
                         font-weight: 600; cursor: pointer; font-size: 14px; color: #374151;
                         transition: all 0.2s;"
                  onmouseover="this.style.background='rgba(255, 223, 128, 0.3)'"
                  onmouseout="this.style.background='rgba(255, 223, 128, 0.2)'">
            Entendi - Fechar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fecha ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },
  
  /**
   * Mostra metodologia completa
   */
  showMethodology() {
    const modal = document.createElement('div');
    modal.id = 'shamar-methodology-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999999;
      padding: 20px;
      animation: fadeIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
      <div style="background: white; border-radius: 16px; max-width: 600px; 
                  max-height: 90vh; overflow-y: auto; padding: 32px;
                  box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🔬</span>
            <h2 style="margin: 0; font-size: 24px; color: #111;">Metodologia</h2>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()"
                  style="background: none; border: none; font-size: 32px; 
                         cursor: pointer; color: #9ca3af; line-height: 1;">×</button>
        </div>
        
        <div style="white-space: pre-line; line-height: 1.7; color: #374151; font-size: 14px;">
${this.text.methodology}
        </div>
        
        <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <button onclick="this.parentElement.parentElement.parentElement.remove()"
                  style="width: 100%; padding: 12px; background: rgba(59, 130, 246, 0.1);
                         border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 8px;
                         font-weight: 600; cursor: pointer; font-size: 14px; color: #374151;
                         transition: all 0.2s;"
                  onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'"
                  onmouseout="this.style.background='rgba(59, 130, 246, 0.1)'">
            Entendi - Fechar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }
};

// Exporta
if (typeof window !== 'undefined') {
  window.ShamarLegalDisclaimer = ShamarLegalDisclaimer;
  console.log('⚖️ Disclaimer Legal carregado');
}
