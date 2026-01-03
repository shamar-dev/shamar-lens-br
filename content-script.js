// content-script.js - Injetado em sites de notícias brasileiras
// SHAMAR = "Aquele que Guarda" - Guardião Digital do Povo Brasileiro
// Consagrado à Verdade - Em aliança com o Pai

'use strict';

console.log('🐺 Shamar Lens BR ativado');
console.log('🔮 Guardião digital iniciado');
console.log('⚔️ A serviço da Verdade');

// Estado da análise
let isAnalyzing = false;
let lastAnalyzedContent = '';
let currentOverlay = null;

  /**
   * Extrai conteúdo principal da página
   */
  function extractMainContent() {
    // Seletores comuns em sites de notícias brasileiros
    const selectors = [
      'article',
      '[class*="article"]',
      '[class*="post"]',
      '[class*="content"]',
      '[class*="materia"]',
      '[class*="noticia"]',
      'main',
      '.main-content',
      '#content'
    ];
    
    let content = '';
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Pega título
        const title = document.querySelector('h1')?.textContent || '';
        
        // Pega subtítulo/lead
        const lead = document.querySelector('[class*="lead"], [class*="subtitle"], h2')?.textContent || '';
        
        // Pega corpo do texto
        const body = element.textContent || '';
        
        content = `${title}\n${lead}\n${body}`;
        break;
      }
    }
    
    // Limpa espaços excessivos
    content = content.replace(/\s+/g, ' ').trim();
    
    return content;
  }

  /**
   * Extrai metadados da página
   */
  function extractMetadata() {
    return {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname,
      author: document.querySelector('[rel="author"], [class*="author"]')?.textContent?.trim() || 'Não identificado',
      publishDate: document.querySelector('[datetime], [class*="date"]')?.textContent?.trim() || 'Não identificada'
    };
  }

  /**
   * Analisa conteúdo da página
   */
  async function analyzePage() {
    if (isAnalyzing) return;
    
    const content = extractMainContent();
    
    // Evita reanalisar mesmo conteúdo
    if (content === lastAnalyzedContent || content.length < 100) {
      return;
    }
    
    isAnalyzing = true;
    lastAnalyzedContent = content;
    
    try {
      const metadata = extractMetadata();
      
      // Chama analyzer
      const analysis = await shamarAnalyzer.analyze(content, metadata.url);
      
      // ANÁLISE CONTEXTUAL SEMPRE (confiável ou não)
      const contextualAnalysis = ShamarContextualAnalyzer.analyze(content, metadata);
      console.log('🐺 Análise contextual:', contextualAnalysis);
      
      // SEMPRE mostra badge (feedback visual constante)
      ShamarBadge.show(contextualAnalysis, metadata);
      
    } catch (error) {
      console.error('🐺 Shamar: Erro na análise', error);
    } finally {
      isAnalyzing = false;
    }
  }

  /**
   * Mostra card com análise contextual completa
   */
  function showContextualCard(analysis, metadata) {
    // Remove card anterior
    removeContextualCard();
    
    const { score, level, color, summary, details, recommendation } = analysis;
    
    // Cria card contextual
    const card = document.createElement('div');
    card.id = 'shamar-contextual-card';
    card.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 3px solid ${color};
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      z-index: 999999;
      max-width: 380px;
      font-family: system-ui, -apple-system, sans-serif;
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    card.innerHTML = `
      <style>
        @keyframes slideIn {
          from { transform: translateX(450px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        #shamar-contextual-card:hover { 
          box-shadow: 0 12px 40px rgba(0,0,0,0.3); 
        }
        .shamar-detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .shamar-detail-item:last-child {
          border-bottom: none;
        }
        .shamar-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
      </style>
      
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 28px;">🐺</span>
          <div>
            <div style="font-weight: 700; font-size: 16px; color: #111;">Shamar Lens</div>
            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
              Análise Contextual
            </div>
          </div>
        </div>
        <button id="shamar-close-btn"
                style="background: none; border: none; font-size: 28px; cursor: pointer; 
                       color: #9ca3af; line-height: 1; padding: 0; width: 32px; height: 32px;
                       display: flex; align-items: center; justify-content: center;
                       border-radius: 8px; transition: all 0.2s;"
                onmouseover="this.style.background='#f3f4f6'; this.style.color='#374151';"
                onmouseout="this.style.background='none'; this.style.color='#9ca3af';">×</button>
      </div>
      
      <!-- Score Circle - CLICÁVEL -->
      <div class="shamar-clickable" data-tooltip-type="score" data-tooltip-value="${score}"
           style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px; 
                  padding: 16px; background: ${color}10; border-radius: 12px; border: 2px solid ${color}40;
                  cursor: help; transition: all 0.2s;"
           onmouseover="this.style.background='${color}15'; this.style.transform='scale(1.02)';"
           onmouseout="this.style.background='${color}10'; this.style.transform='scale(1)';">
        <div style="width: 80px; height: 80px; border-radius: 50%; 
                    background: linear-gradient(135deg, ${color}20, ${color}40); 
                    display: flex; align-items: center; justify-content: center; 
                    border: 4px solid ${color}; position: relative;">
          <div style="text-align: center;">
            <div style="font-size: 26px; font-weight: 800; color: ${color}; line-height: 1;">
              ${score}
            </div>
            <div style="font-size: 10px; color: ${color}; opacity: 0.8; font-weight: 600;">
              /100
            </div>
          </div>
          <!-- Ícone de ajuda -->
          <div style="position: absolute; top: -8px; right: -8px; background: white; 
                      border-radius: 50%; width: 24px; height: 24px; display: flex; 
                      align-items: center; justify-content: center; font-size: 14px; 
                      border: 2px solid ${color}; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            💡
          </div>
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 18px; color: ${color}; margin-bottom: 4px; text-transform: capitalize;">
            ${level}
          </div>
          <div style="font-size: 13px; color: #374151; line-height: 1.4;">
            ${summary}
          </div>
          <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">
            💡 Clique para entender o score
          </div>
        </div>
      </div>
      
      <!-- Detalhes -->
      <div style="background: #f9fafb; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 12px; color: #6b7280; margin-bottom: 10px; 
                    text-transform: uppercase; letter-spacing: 0.5px;">
          Análise Detalhada
        </div>
        
        <div class="shamar-detail-item shamar-clickable" data-tooltip-type="fontes" data-tooltip-value="${details.sources.quality}"
             style="cursor: help; transition: background 0.2s;"
             onmouseover="this.style.background='#f3f4f6';"
             onmouseout="this.style.background='transparent';">
          <span style="font-size: 13px; color: #374151;">📰 Fontes 💡</span>
          <span class="shamar-badge" style="background: ${getSourceColor(details.sources.quality)}; 
                                            color: white;">
            ${details.sources.quality}
          </span>
        </div>
        
        <div class="shamar-detail-item shamar-clickable" data-tooltip-type="tom" data-tooltip-value="${details.tone.tone}"
             style="cursor: help; transition: background 0.2s;"
             onmouseover="this.style.background='#f3f4f6';"
             onmouseout="this.style.background='transparent';">
          <span style="font-size: 13px; color: #374151;">🎭 Tom 💡</span>
          <span class="shamar-badge" style="background: ${getToneColor(details.tone.tone)}; 
                                            color: white;">
            ${details.tone.tone}
          </span>
        </div>
        
        <div class="shamar-detail-item shamar-clickable" data-tooltip-type="estrutura" data-tooltip-value="${details.structure.wellStructured}"
             style="cursor: help; transition: background 0.2s;"
             onmouseover="this.style.background='#f3f4f6';"
             onmouseout="this.style.background='transparent';">
          <span style="font-size: 13px; color: #374151;">📝 Estrutura 💡</span>
          <span class="shamar-badge" style="background: ${details.structure.wellStructured ? '#16a34a' : '#ea580c'}; 
                                            color: white;">
            ${details.structure.wellStructured ? 'Boa' : 'Fraca'}
          </span>
        </div>
        
        ${details.patterns.flagsCount > 0 ? `
        <div class="shamar-detail-item shamar-clickable" data-tooltip-type="padroes" data-tooltip-value="${details.patterns.flagsCount}"
             style="cursor: help; transition: background 0.2s;"
             onmouseover="this.style.background='#f3f4f6';"
             onmouseout="this.style.background='transparent';">
          <span style="font-size: 13px; color: #374151;">⚠️ Padrões Suspeitos 💡</span>
          <span class="shamar-badge" style="background: #dc2626; color: white;">
            ${details.patterns.flagsCount}
          </span>
        </div>
        ` : ''}
      </div>
      
      <!-- Recomendação -->
      <div style="background: linear-gradient(135deg, ${color}15, ${color}25); 
                  border-left: 4px solid ${color}; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
        <div style="font-weight: 600; font-size: 11px; color: ${color}; margin-bottom: 6px;
                    text-transform: uppercase; letter-spacing: 0.5px;">
          💡 Recomendação
        </div>
        <div style="font-size: 13px; color: #374151; line-height: 1.5;">
          ${recommendation}
        </div>
      </div>
      
      <!-- Footer com Disclaimer Legal -->
      <div style="text-align: center; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <div style="font-size: 11px; color: #6b7280; line-height: 1.5; margin-bottom: 8px;">
          📊 Análise automatizada educativa • Não constitui censura
        </div>
        <div style="display: flex; gap: 8px; justify-content: center; font-size: 10px;">
          <a href="#" class="shamar-legal-link" data-show="disclaimer"
             style="color: #3b82f6; text-decoration: none; cursor: pointer;"
             onmouseover="this.style.textDecoration='underline'"
             onmouseout="this.style.textDecoration='none'">
            ⚖️ Aviso Legal
          </a>
          <span style="color: #d1d5db;">•</span>
          <a href="#" class="shamar-legal-link" data-show="methodology"
             style="color: #3b82f6; text-decoration: none; cursor: pointer;"
             onmouseover="this.style.textDecoration='underline'"
             onmouseout="this.style.textDecoration='none'">
            🔬 Metodologia
          </a>
        </div>
        <div style="font-size: 10px; color: #d1d5db; margin-top: 6px;">
          v0.7.0 - Código Aberto 🔮
        </div>
      </div>
    `;
    
    document.body.appendChild(card);
    
    // Event listeners (mais robusto que onclick inline)
    const closeBtn = document.getElementById('shamar-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        collapseCardToBadge();
      });
    }
    
    // Event listeners para tooltips educativos
    const clickableElements = card.querySelectorAll('.shamar-clickable');
    clickableElements.forEach(element => {
      element.addEventListener('click', () => {
        const type = element.getAttribute('data-tooltip-type');
        const value = element.getAttribute('data-tooltip-value');
        showEducationalTooltip(type, value);
      });
    });
    
    // Event listeners para links legais
    const legalLinks = card.querySelectorAll('.shamar-legal-link');
    legalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const show = link.getAttribute('data-show');
        if (show === 'disclaimer') {
          ShamarLegalDisclaimer.showFull();
        } else if (show === 'methodology') {
          ShamarLegalDisclaimer.showMethodology();
        }
      });
    });
    
    // Card agora é PERMANENTE - só fecha quando usuário clicar no X
    // (removido setTimeout de auto-close)
  }
  
  // Torna função global para badge poder chamar
  window.showShamarCard = showContextualCard;
  window.collapseCardToBadge = collapseCardToBadge;
  
  
  /**
   * Colapsa card de volta para badge
   */
  function collapseCardToBadge() {
    // Remove card
    removeContextualCard();
    
    // Recria badge com análise atual
    if (typeof ShamarBadge !== 'undefined' && ShamarBadge.currentAnalysis) {
      ShamarBadge.isExpanded = false;
      ShamarBadge.show(ShamarBadge.currentAnalysis, {});
    }
  }
  
  // Torna função global para onclick
  window.collapseCardToBadge = collapseCardToBadge;

  /**
   * Remove card contextual
   */
  function removeContextualCard() {
    const card = document.getElementById('shamar-contextual-card');
    if (card) card.remove();
  }
  
  /**
   * Retorna cor para qualidade de fonte
   */
  function getSourceColor(quality) {
    const colors = {
      'identificadas': '#16a34a',
      'parcialmente identificadas': '#ca8a04',
      'anônimas': '#dc2626',
      'desconhecida': '#6b7280'
    };
    return colors[quality] || '#6b7280';
  }
  
  /**
   * Retorna cor para tom
   */
  function getToneColor(tone) {
    const colors = {
      'factual': '#16a34a',
      'neutro': '#6b7280',
      'parcialmente emotivo': '#ea580c',
      'fortemente emotivo': '#dc2626'
    };
    return colors[tone] || '#6b7280';
  }  
  /**
   * Mostra tooltip educativo quando clica em item
   */
  function showEducationalTooltip(type, value) {
    // Remove tooltip existente
    const existingTooltip = document.getElementById('shamar-educational-tooltip');
    if (existingTooltip) existingTooltip.remove();
    
    // Conteúdo educativo por tipo
    const content = getEducationalContent(type, value);
    
    // Cria tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'shamar-educational-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 3px solid rgba(255, 223, 128, 0.8);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3), 
                  0 0 80px rgba(255, 223, 128, 0.4);
      z-index: 9999999;
      max-width: 480px;
      max-height: 80vh;
      overflow-y: auto;
      font-family: system-ui, -apple-system, sans-serif;
      animation: tooltipAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    tooltip.innerHTML = `
      <style>
        @keyframes tooltipAppear {
          from { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
        }
        #shamar-educational-tooltip::-webkit-scrollbar {
          width: 8px;
        }
        #shamar-educational-tooltip::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        #shamar-educational-tooltip::-webkit-scrollbar-thumb {
          background: rgba(255, 223, 128, 0.6);
          border-radius: 4px;
        }
      </style>
      
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 32px;">💡</span>
          <div style="font-weight: 700; font-size: 20px; color: #111;">
            Entenda Melhor
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; font-size: 32px; cursor: pointer; 
                       color: #9ca3af; line-height: 1; padding: 0; width: 36px; height: 36px;
                       border-radius: 8px; transition: all 0.2s;"
                onmouseover="this.style.background='#f3f4f6'; this.style.color='#374151';"
                onmouseout="this.style.background='none'; this.style.color='#9ca3af';">×</button>
      </div>
      
      <!-- Conteúdo -->
      <div style="color: #374151; line-height: 1.7; font-size: 14px;">
        ${content}
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 20px; padding-top: 16px; border-top: 2px solid rgba(255, 223, 128, 0.3); 
                  text-align: center;">
        <div style="font-size: 11px; color: #9ca3af;">
          🐺 Shamar Lens - Educação Digital
        </div>
      </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Fecha ao clicar fora
    setTimeout(() => {
      const closeOnClickOutside = (e) => {
        if (!tooltip.contains(e.target)) {
          tooltip.remove();
          document.removeEventListener('click', closeOnClickOutside);
        }
      };
      document.addEventListener('click', closeOnClickOutside);
    }, 100);
  }
  
  // Torna função global para onclick nos tooltips
  window.showEducationalTooltip = showEducationalTooltip;
  
  /**
   * Retorna conteúdo educativo baseado no tipo
   */
  function getEducationalContent(type, value) {
    const contents = {
      score: `
        <h3 style="color: rgba(202, 138, 4, 1); margin: 0 0 16px 0; font-size: 18px;">
          🎯 Como Funciona o Score?
        </h3>
        
        <p style="margin-bottom: 16px;">
          O Shamar analisa <strong>4 dimensões</strong> do artigo e calcula um score de 0 a 100:
        </p>
        
        <div style="background: #f9fafb; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
          <div style="margin-bottom: 12px;">
            <strong style="color: #16a34a;">📰 Fontes (35%)</strong><br>
            <span style="font-size: 13px; color: #6b7280;">
              Artigos confiáveis citam fontes verificáveis
            </span>
          </div>
          
          <div style="margin-bottom: 12px;">
            <strong style="color: #3b82f6;">🎭 Tom (25%)</strong><br>
            <span style="font-size: 13px; color: #6b7280;">
              Jornalismo sério usa linguagem factual
            </span>
          </div>
          
          <div style="margin-bottom: 12px;">
            <strong style="color: #8b5cf6;">📝 Estrutura (20%)</strong><br>
            <span style="font-size: 13px; color: #6b7280;">
              Reportagens bem feitas têm substância
            </span>
          </div>
          
          <div>
            <strong style="color: #dc2626;">⚠️ Padrões Suspeitos (20%)</strong><br>
            <span style="font-size: 13px; color: #6b7280;">
              Detectamos linguagem manipuladora
            </span>
          </div>
        </div>
        
        <h4 style="margin: 16px 0 8px 0; font-size: 15px; color: #111;">📊 Escala de Confiança:</h4>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="padding: 8px 12px; background: #16a34a15; border-left: 4px solid #16a34a; border-radius: 6px;">
            <strong style="color: #16a34a;">80-100</strong> = 🟢 Confiável
          </div>
          <div style="padding: 8px 12px; background: #ca8a0415; border-left: 4px solid #ca8a04; border-radius: 6px;">
            <strong style="color: #ca8a04;">60-79</strong> = 🟡 Atenção
          </div>
          <div style="padding: 8px 12px; background: #ea580c15; border-left: 4px solid #ea580c; border-radius: 6px;">
            <strong style="color: #ea580c;">40-59</strong> = 🟠 Suspeito
          </div>
          <div style="padding: 8px 12px; background: #dc262615; border-left: 4px solid #dc2626; border-radius: 6px;">
            <strong style="color: #dc2626;">0-39</strong> = 🔴 Não Confiável
          </div>
        </div>
        
        <p style="margin-top: 16px; font-size: 13px; color: #6b7280; font-style: italic;">
          💡 Seu artigo tem score <strong>${value}</strong>. Quanto maior, mais confiável!
        </p>
      `,
      
      fontes: `
        <h3 style="color: #16a34a; margin: 0 0 16px 0; font-size: 18px;">
          📰 Por Que Fontes Importam?
        </h3>
        
        <p style="margin-bottom: 16px;">
          Fontes são <strong>fundamentais</strong> para verificar a veracidade da informação.
        </p>
        
        <div style="background: #16a34a10; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #16a34a;">
          <h4 style="margin: 0 0 8px 0; color: #16a34a; font-size: 15px;">✓ IDENTIFICADAS</h4>
          <p style="margin: 0 0 8px 0; font-size: 13px;">
            Cita nomes, cargos, instituições oficiais. Você pode verificar!
          </p>
          <div style="background: white; padding: 8px; border-radius: 6px; font-size: 12px; font-style: italic;">
            "Segundo o ministro João Silva..."<br>
            "Documento do STF revela..."<br>
            "Polícia Federal confirmou..."
          </div>
        </div>
        
        <div style="background: #ca8a0410; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #ca8a04;">
          <h4 style="margin: 0 0 8px 0; color: #ca8a04; font-size: 15px;">⚠️ ANÔNIMAS</h4>
          <p style="margin: 0 0 8px 0; font-size: 13px;">
            Não identifica quem disse. Difícil de checar!
          </p>
          <div style="background: white; padding: 8px; border-radius: 6px; font-size: 12px; font-style: italic;">
            "Fonte próxima disse..."<br>
            "Pessoas ligadas ao governo..."
          </div>
        </div>
        
        <div style="background: #dc262610; padding: 16px; border-radius: 12px; border-left: 4px solid #dc2626;">
          <h4 style="margin: 0 0 8px 0; color: #dc2626; font-size: 15px;">❌ DESCONHECIDA</h4>
          <p style="margin: 0; font-size: 13px;">
            Sem citações. Não dá pra checar. Pode ser opinião disfarçada!
          </p>
        </div>
        
        <p style="margin-top: 16px; font-size: 13px; color: #6b7280; font-style: italic;">
          💡 Este artigo tem fontes: <strong>${value}</strong>
        </p>
      `,
      
      tom: `
        <h3 style="color: #3b82f6; margin: 0 0 16px 0; font-size: 18px;">
          🎭 O Que É Tom do Texto?
        </h3>
        
        <p style="margin-bottom: 16px;">
          O <strong>tom</strong> revela se o texto informa objetivamente ou manipula emocionalmente.
        </p>
        
        <div style="background: #16a34a10; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #16a34a;">
          <h4 style="margin: 0 0 8px 0; color: #16a34a; font-size: 15px;">✓ FACTUAL</h4>
          <p style="margin: 0 0 8px 0; font-size: 13px;">
            Linguagem objetiva, sem emoção. Só informa.
          </p>
          <div style="background: white; padding: 8px; border-radius: 6px; font-size: 12px; font-style: italic;">
            ✓ "Tribunal decidiu que..."<br>
            ✓ "Dados mostram aumento de..."
          </div>
        </div>
        
        <div style="background: #6b728010; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #6b7280;">
          <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 15px;">~ NEUTRO</h4>
          <p style="margin: 0; font-size: 13px;">
            Equilibrado entre fatos e contexto.
          </p>
        </div>
        
        <div style="background: #dc262610; padding: 16px; border-radius: 12px; border-left: 4px solid #dc2626;">
          <h4 style="margin: 0 0 8px 0; color: #dc2626; font-size: 15px;">⚠️ EMOTIVO</h4>
          <p style="margin: 0 0 8px 0; font-size: 13px;">
            Usa adjetivos fortes para manipular emoção!
          </p>
          <div style="background: white; padding: 8px; border-radius: 6px; font-size: 12px; font-style: italic;">
            ❌ "Absurdo escandaloso!"<br>
            ❌ "Crime hediondo da política!"
          </div>
        </div>
        
        <p style="margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 8px; font-size: 13px;">
          💡 <strong>Dica:</strong> Notícias confiáveis <em>informam</em>. Manipulação <em>emociona</em>.
        </p>
        
        <p style="margin-top: 12px; font-size: 13px; color: #6b7280; font-style: italic;">
          Este artigo tem tom: <strong>${value}</strong>
        </p>
      `,
      
      estrutura: `
        <h3 style="color: #8b5cf6; margin: 0 0 16px 0; font-size: 18px;">
          📝 Por Que Estrutura Importa?
        </h3>
        
        <p style="margin-bottom: 16px;">
          A <strong>estrutura</strong> mostra se o artigo foi feito com cuidado ou às pressas.
        </p>
        
        <div style="background: #16a34a10; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #16a34a;">
          <h4 style="margin: 0 0 8px 0; color: #16a34a; font-size: 15px;">✓ BOA ESTRUTURA</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
            <li>Título coerente com o corpo</li>
            <li>Texto com substância (150+ palavras)</li>
            <li>Bem organizado em parágrafos</li>
            <li>Introdução, desenvolvimento, conclusão</li>
          </ul>
        </div>
        
        <div style="background: #ea580c10; padding: 16px; border-radius: 12px; border-left: 4px solid #ea580c;">
          <h4 style="margin: 0 0 8px 0; color: #ea580c; font-size: 15px;">⚠️ ESTRUTURA FRACA</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
            <li>Título clickbait ≠ corpo real</li>
            <li>Texto curto demais (sem profundidade)</li>
            <li>Mal estruturado ou confuso</li>
            <li>Promete mas não entrega</li>
          </ul>
        </div>
        
        <p style="margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 8px; font-size: 13px;">
          <strong>Por quê isso importa?</strong><br>
          • Clickbait <em>promete</em>, não <em>entrega</em><br>
          • Artigo curto = superficial<br>
          • Estrutura ruim = pressa ou má-fé
        </p>
        
        <p style="margin-top: 12px; font-size: 13px; color: #6b7280; font-style: italic;">
          Este artigo tem estrutura: <strong>${value ? 'Boa' : 'Fraca'}</strong>
        </p>
      `,
      
      padroes: `
        <h3 style="color: #dc2626; margin: 0 0 16px 0; font-size: 18px;">
          ⚠️ O Que São Padrões Suspeitos?
        </h3>
        
        <p style="margin-bottom: 16px;">
          Detectamos <strong>linguagem típica</strong> de conteúdo manipulador:
        </p>
        
        <div style="background: #dc262610; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #dc2626;">
          <h4 style="margin: 0 0 8px 0; color: #dc2626; font-size: 15px;">❌ FAKE NEWS</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
            <li>CAPS LOCK excessivo</li>
            <li>"URGENTE! BOMBA!"</li>
            <li>Fontes anônimas</li>
            <li>Verbos condicionais sem confirmação</li>
          </ul>
        </div>
        
        <div style="background: #ea580c10; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #ea580c;">
          <h4 style="margin: 0 0 8px 0; color: #ea580c; font-size: 15px;">⚠️ CLICKBAIT</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
            <li>"Você não vai acreditar..."</li>
            <li>"O que aconteceu depois..."</li>
            <li>Promessa vazia no título</li>
          </ul>
        </div>
        
        <div style="background: #8b5cf610; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #8b5cf6;">
          <h4 style="margin: 0 0 8px 0; color: #8b5cf6; font-size: 15px;">⚠️ POLARIZAÇÃO</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
            <li>Xingamentos políticos</li>
            <li>Desumanização de grupos</li>
            <li>Linguagem tribal violenta</li>
          </ul>
        </div>
        
        <div style="background: #f59e0b10; padding: 16px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <h4 style="margin: 0 0 8px 0; color: #f59e0b; font-size: 15px;">💰 GOLPES</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
            <li>"Clique aqui para ganhar R$..."</li>
            <li>Urgência artificial + dinheiro</li>
            <li>Promessas financeiras irreais</li>
          </ul>
        </div>
        
        <p style="margin-top: 16px; font-size: 13px; color: #6b7280; font-style: italic;">
          💡 Detectamos <strong>${value} padrão(ões) suspeito(s)</strong> neste artigo.
        </p>
      `
    };
    
    return contents[type] || '<p>Conteúdo educativo não disponível.</p>';
  }

  /**
   * MANTIDO: Exibe overlay educativo (BACKUP - não usado mais)
   */
  function showOverlay(analysis, metadata) {
    // Remove overlay anterior se existir
    if (currentOverlay) {
      currentOverlay.remove();
    }
    
    // Cria overlay
    const overlay = document.createElement('div');
    overlay.id = 'shamar-overlay';
    overlay.className = `shamar-overlay severity-${analysis.scoreLabel.color}`;
    
    // Define cor baseada na gravidade
    const severityColors = {
      'red': '#dc2626',
      'orange': '#ea580c',
      'yellow': '#ca8a04',
      'green': '#16a34a'
    };
    
    const accentColor = severityColors[analysis.scoreLabel.color] || '#6b7280';
    
    // Monta HTML do overlay
    overlay.innerHTML = `
      <div class="shamar-header">
        <div class="shamar-logo">
          <span class="shamar-icon">🐺</span>
          <span class="shamar-title">Shamar Lens BR</span>
        </div>
        <button class="shamar-close" aria-label="Fechar">×</button>
      </div>
      
      <div class="shamar-body">
        <div class="shamar-score">
          <div class="score-badge" style="background-color: ${accentColor}">
            ${analysis.score}/100
          </div>
          <div class="score-label">${analysis.scoreLabel.text}</div>
        </div>
        
        <div class="shamar-summary">
          Detectamos ${analysis.flags.length} padrão(ões) de possível manipulação neste conteúdo.
        </div>
        
        <div class="shamar-flags">
          ${analysis.flags.map(flag => `
            <div class="flag-item">
              <div class="flag-name">${flag.category}</div>
              <div class="flag-explanation">${flag.description}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="shamar-actions">
          <button class="shamar-btn shamar-btn-primary" data-action="learn-more">
            Por que isso é manipulação?
          </button>
          <button class="shamar-btn shamar-btn-secondary" data-action="report">
            Reportar falso positivo
          </button>
        </div>
        
        <div class="shamar-footer">
          <small>
            Shamar não bloqueia conteúdo - apenas educa. 
            <a href="#" data-action="about">Saiba mais</a>
          </small>
        </div>
      </div>
    `;
    
    // Adiciona event listeners
    overlay.querySelector('.shamar-close').addEventListener('click', () => {
      overlay.remove();
      currentOverlay = null;
    });
    
    overlay.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        handleAction(e.target.dataset.action, analysis, metadata);
      });
    });
    
    // Adiciona ao DOM
    document.body.appendChild(overlay);
    currentOverlay = overlay;
    
    // Auto-dismiss após 15 segundos (opcional)
    setTimeout(() => {
      if (currentOverlay === overlay) {
        overlay.classList.add('shamar-fade-out');
        setTimeout(() => overlay.remove(), 300);
      }
    }, 15000);
  }

  /**
   * Gerencia ações do usuário no overlay
   */
  function handleAction(action, analysis, metadata) {
    switch(action) {
      case 'learn-more':
        // Abre popup com explicação detalhada
        chrome.runtime.sendMessage({
          type: 'OPEN_EDUCATION',
          data: { analysis, metadata }
        });
        break;
        
      case 'report':
        // Envia feedback de falso positivo
        chrome.runtime.sendMessage({
          type: 'REPORT_FALSE_POSITIVE',
          data: { analysis, metadata }
        });
        alert('🐺 Obrigado pelo feedback! Vamos analisar este caso.');
        break;
        
      case 'about':
        // Abre página sobre o projeto
        chrome.runtime.sendMessage({
          type: 'OPEN_ABOUT'
        });
        break;
    }
  }

  /**
   * Observa mudanças no DOM (para SPAs)
   */
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      // Debounce: só analisa após 2s de inatividade
      clearTimeout(window.shamarAnalyzeTimeout);
      window.shamarAnalyzeTimeout = setTimeout(() => {
        analyzePage();
      }, 2000);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Inicialização
   */
  function init() {
    // Analisa página inicial
    setTimeout(() => {
      analyzePage();
    }, 1000); // Aguarda 1s para página carregar completamente
    
    // Observa mudanças (para SPAs)
    setupObserver();
    
    // Escuta mensagens do background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'ANALYZE_NOW') {
        analyzePage();
        sendResponse({ status: 'analyzing' });
      }
    });
  }

  // Inicia quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

