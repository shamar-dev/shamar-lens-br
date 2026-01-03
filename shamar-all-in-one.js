// ============================================================================
// SHAMAR LENS BR - ALL-IN-ONE
// Arquivo consolidado: patterns + analyzer + content-script
// ============================================================================

// ============================================================================
// PARTE 1: PATTERNS (detector/patterns.js)
// ============================================================================
// patterns.js - Red Flags de Manipulação Política Brasileira
// Versão MVP - 5 padrões principais

const MANIPULATION_PATTERNS = {
  
  // 1. FAKE NEWS CLÁSSICA
  fake_news: {
    name: "Possível Fake News",
    severity: "high",
    triggers: [
      /\bURGENTE\b/i,
      /\bBOMBA\b/i,
      /\bESCÂNDALO\b/i,
      /\bvazou\b/i,
      /fonte anônima/i,
      /circula nas redes/i,
      /segundo informações/i,
      /teria dito/i,
      /estaria/i
    ],
    indicators: {
      no_source: {
        pattern: /(?!.*(segundo|conforme|de acordo com).{0,50}(fonte|jornal|portal|agência))/i,
        weight: 0.3
      },
      anonymous_source: {
        pattern: /fonte (anônima|reservada|confidencial)/i,
        weight: 0.4
      },
      emotional_caps: {
        pattern: /[A-ZÀÁÂÃÉÊÍÓÔÕÚÇ]{8,}/g,
        weight: 0.2,
        threshold: 3 // mínimo de ocorrências
      },
      conditional_verb: {
        pattern: /\b(teria|estaria|seria|poderia)\s+(dito|feito|afirmado)/i,
        weight: 0.3
      }
    },
    explanation: "Conteúdo usa linguagem típica de desinformação: manchetes sensacionalistas, fontes não verificáveis e verbos condicionais que evitam responsabilidade factual.",
    education_link: "O que caracteriza fake news?"
  },

  // 2. CLICKBAIT POLÍTICO
  clickbait: {
    name: "Clickbait Político",
    severity: "medium",
    triggers: [
      /você não vai acreditar/i,
      /o que aconteceu (depois|em seguida)/i,
      /revelação chocante/i,
      /descobriu-se que/i,
      /veja o (vídeo|áudio)/i,
      /surpreendente/i,
      /impressionante/i
    ],
    explanation: "Manchete projetada para gerar cliques através de curiosidade artificial, não para informar objetivamente.",
    education_link: "Como identificar clickbait?"
  },

  // 3. POLARIZAÇÃO EXTREMA (específico BR)
  polarization: {
    name: "Linguagem Polarizadora",
    severity: "high",
    triggers: [
      /\bpetralha\b/i,
      /\bbolsominion\b/i,
      /\bmortadela\b/i,
      /\bgado\b/i,
      /\bcomunista\b/i,
      /\bfascista\b/i,
      /\bcoxinha\b/i,
      /\besquerdopata\b/i,
      /\bdireitista\b/i,
      /\bglobista\b/i,
      /\blulopetista\b/i
    ],
    explanation: "Uso de rótulos pejorativos que desumanizam adversários políticos e impedem debate racional. Técnica clássica de propaganda para criar divisão.",
    education_link: "Por que polarização é manipulação?"
  },

  // 4. FALÁCIAS LÓGICAS
  fallacies: {
    name: "Falácia Lógica Detectada",
    severity: "medium",
    types: {
      ad_hominem: {
        pattern: /(corrupto|ladrão|bandido|criminoso|vagabundo).{0,50}(político|governo|partido|presidente|ministro)/i,
        explanation: "Ataque à pessoa em vez de aos argumentos (Ad Hominem)"
      },
      false_dichotomy: {
        pattern: /ou\s+(\w+)\s+ou\s+(\w+)/i,
        context_required: true,
        explanation: "Falsa dicotomia - apresenta apenas 2 opções quando existem mais"
      },
      appeal_to_emotion: {
        pattern: /(crianças|família|Deus|Jesus|pátria).{0,100}(voto|eleição|político|partido)/i,
        explanation: "Apelo emocional em vez de argumentação racional"
      },
      appeal_to_fear: {
        pattern: /(perigo|ameaça|destruir|acabar com).{0,50}(brasil|país|democracia|família)/i,
        explanation: "Apelo ao medo para influenciar opinião"
      }
    },
    education_link: "O que são falácias lógicas?"
  },

  // 5. DESINFORMAÇÃO FINANCEIRA (golpes políticos)
  financial_scam: {
    name: "⚠️ ALERTA DE POSSÍVEL GOLPE",
    severity: "critical",
    triggers: [
      /ganhe?\s+R?\$?\s*\d+/i,
      /dinheiro fácil/i,
      /método secreto/i,
      /PIX automático/i,
      /renda extra/i,
      /investimento garantido/i,
      /retorno de \d+%/i,
      /clique (aqui|no link)/i
    ],
    explanation: "ATENÇÃO: Conteúdo apresenta características de golpe financeiro. Nunca clique em links suspeitos ou forneça dados pessoais/bancários.",
    education_link: "Como identificar golpes online?"
  }
};

// Sistema de pontuação para determinar confiabilidade
const SCORING_SYSTEM = {
  calculate: function(detectedPatterns) {
    let score = 100; // começa em 100 (confiável)
    
    detectedPatterns.forEach(pattern => {
      switch(pattern.severity) {
        case 'critical':
          score -= 50;
          break;
        case 'high':
          score -= 30;
          break;
        case 'medium':
          score -= 15;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });
    
    return Math.max(0, score); // mínimo 0
  },
  
  getLabel: function(score) {
    if (score >= 80) return { text: "Confiável", color: "green" };
    if (score >= 60) return { text: "Verificar Fontes", color: "yellow" };
    if (score >= 40) return { text: "Suspeito", color: "orange" };
    return { text: "Alto Risco de Manipulação", color: "red" };
  }
};

// Exportar para uso nos outros módulos
}

// CRÍTICO: Expor globalmente para o navegador
window.MANIPULATION_PATTERNS = MANIPULATION_PATTERNS;
window.SCORING_SYSTEM = SCORING_SYSTEM;

// Expor globalmente
window.MANIPULATION_PATTERNS = MANIPULATION_PATTERNS;
window.SCORING_SYSTEM = SCORING_SYSTEM;

// ============================================================================
// PARTE 2: ANALYZER (detector/analyzer.js)
// ============================================================================
// analyzer.js - Motor de Análise Híbrido (Local + Claude API)

class ShamarAnalyzer {
  constructor() {
    this.cache = new Map(); // Cache de análises para não reprocessar
    this.apiCallCount = 0;
    this.maxApiCallsPerHour = 60; // Controle de custo
  }

  /**
   * FASE 1: Detecção Local (rápida, sem custo)
   * Analisa texto usando padrões regex locais
   */
  detectLocalPatterns(text) {
    const detectedPatterns = [];
    
    // Itera sobre cada categoria de padrão
    for (const [categoryKey, category] of Object.entries(MANIPULATION_PATTERNS)) {
      const matches = [];
      
      // Testa cada trigger da categoria
      if (category.triggers) {
        category.triggers.forEach(trigger => {
          if (trigger.test(text)) {
            matches.push({
              trigger: trigger.source,
              matched: text.match(trigger)
            });
          }
        });
      }
      
      // Se detectou triggers, adiciona aos resultados
      if (matches.length > 0) {
        detectedPatterns.push({
          category: categoryKey,
          name: category.name,
          severity: category.severity,
          matches: matches,
          explanation: category.explanation,
          education_link: category.education_link
        });
      }
      
      // Verifica indicadores específicos (para fake_news)
      if (categoryKey === 'fake_news' && category.indicators) {
        let indicatorScore = 0;
        const indicatorMatches = [];
        
        for (const [indicatorKey, indicator] of Object.entries(category.indicators)) {
          if (indicator.pattern && indicator.pattern.test(text)) {
            indicatorScore += indicator.weight || 0.2;
            indicatorMatches.push(indicatorKey);
          }
        }
        
        // Se score de indicadores passou threshold, adiciona
        if (indicatorScore > 0.5 && matches.length === 0) {
          detectedPatterns.push({
            category: categoryKey,
            name: category.name,
            severity: category.severity,
            matches: indicatorMatches,
            explanation: category.explanation,
            education_link: category.education_link,
            confidence: indicatorScore
          });
        }
      }
    }
    
    return detectedPatterns;
  }

  /**
   * FASE 2: Análise Profunda (Claude API)
   * Só chamada se detectou red flags locais
   */
  async analyzeWithAPI(text, url, localFlags) {
    // Verifica rate limit
    if (this.apiCallCount >= this.maxApiCallsPerHour) {
      console.warn('Shamar: Rate limit atingido, usando apenas análise local');
      return this.buildLocalOnlyResponse(localFlags);
    }
    
    // Verifica cache
    const cacheKey = this.generateCacheKey(text);
    if (this.cache.has(cacheKey)) {
      console.log('Shamar: Usando análise em cache');
      return this.cache.get(cacheKey);
    }
    
    try {
      // TODO: Integrar Claude API real
      // Por enquanto, retorna análise local expandida
      const analysis = await this.mockAPICall(text, url, localFlags);
      
      // Salva em cache
      this.cache.set(cacheKey, analysis);
      this.apiCallCount++;
      
      return analysis;
      
    } catch (error) {
      console.error('Shamar: Erro na API, fallback para análise local', error);
      return this.buildLocalOnlyResponse(localFlags);
    }
  }

  /**
   * Análise completa (orquestra local + API)
   */
  async analyze(text, url) {
    // Normaliza texto
    const normalizedText = text.trim().substring(0, 5000); // limita tamanho
    
    if (normalizedText.length < 50) {
      return null; // Texto muito curto, ignora
    }
    
    // FASE 1: Detecção local
    const localFlags = this.detectLocalPatterns(normalizedText);
    
    if (localFlags.length === 0) {
      return null; // Conteúdo limpo
    }
    
    // FASE 2: Análise profunda (apenas se detectou algo)
    const deepAnalysis = await this.analyzeWithAPI(normalizedText, url, localFlags);
    
    return deepAnalysis;
  }

  /**
   * Resposta usando apenas análise local (fallback)
   */
  buildLocalOnlyResponse(localFlags) {
    const score = SCORING_SYSTEM.calculate(localFlags);
    const scoreLabel = SCORING_SYSTEM.getLabel(score);
    
    return {
      detected: true,
      source: 'local',
      score: score,
      scoreLabel: scoreLabel,
      flags: localFlags,
      summary: this.generateSummary(localFlags),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Gera resumo educativo das flags detectadas
   */
  generateSummary(flags) {
    if (flags.length === 0) return "Nenhuma manipulação detectada.";
    
    const criticalFlags = flags.filter(f => f.severity === 'critical');
    const highFlags = flags.filter(f => f.severity === 'high');
    
    if (criticalFlags.length > 0) {
      return `⚠️ ALERTA CRÍTICO: ${criticalFlags[0].explanation}`;
    }
    
    if (highFlags.length > 0) {
      return `🐺 Shamar detectou: ${highFlags.map(f => f.name).join(', ')}`;
    }
    
    return `🐺 Padrões suspeitos detectados: ${flags.map(f => f.name).join(', ')}`;
  }

  /**
   * Gera chave de cache (hash simples do texto)
   */
  generateCacheKey(text) {
    // Hash simples para cache
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  /**
   * Mock da chamada API (placeholder para integração real)
   */
  async mockAPICall(text, url, localFlags) {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Por enquanto, retorna análise local expandida
    // TODO: Substituir por chamada real à Claude API
    return this.buildLocalOnlyResponse(localFlags);
  }

  /**
   * Limpa cache antigo (>1 hora)
   */
  clearOldCache() {
    // TODO: implementar limpeza baseada em timestamp
    if (this.cache.size > 1000) {
      this.cache.clear();
    }
  }

  /**
   * Reset contador de API calls (chamado a cada hora)
   */
  resetApiCounter() {
    this.apiCallCount = 0;
  }
}

// Instância singleton
}, 60 * 60 * 1000);

}

// CRÍTICO: Expor globalmente para o navegador
window.ShamarAnalyzer = ShamarAnalyzer;
window.shamarAnalyzer = shamarAnalyzer;

// Expor globalmente
window.ShamarAnalyzer = ShamarAnalyzer;

// ============================================================================
// PARTE 3: CONTENT SCRIPT
// ============================================================================
(function() {
  'use strict';
  
  console.log('🐺 Shamar Lens BR ativado');
  
  // Cria instância do analyzer
  window.shamarAnalyzer = new ShamarAnalyzer();

  let isAnalyzing = false;
  let lastAnalyzedContent = '';
  let currentOverlay = null;
    }
    
    console.log('🐺 Shamar Lens BR ativado');
    init();
  });

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
      
      if (analysis && analysis.detected) {
        console.log('🐺 Shamar detectou manipulação:', analysis);
        showOverlay(analysis, metadata);
      } else {
        console.log('🐺 Shamar: Conteúdo limpo');
      }
      
    } catch (error) {
      console.error('🐺 Shamar: Erro na análise', error);
    } finally {
      isAnalyzing = false;
    }
  }

  /**
   * Exibe overlay educativo
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
          ${analysis.summary}
        </div>
        
        <div class="shamar-flags">
          ${analysis.flags.map(flag => `
            <div class="flag-item">
              <div class="flag-name">${flag.name}</div>
              <div class="flag-explanation">${flag.explanation}</div>
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

})();
