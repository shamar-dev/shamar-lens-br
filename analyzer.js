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
const shamarAnalyzer = new ShamarAnalyzer();

// Reset contador a cada hora
setInterval(() => {
  shamarAnalyzer.resetApiCounter();
  shamarAnalyzer.clearOldCache();
}, 60 * 60 * 1000);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ShamarAnalyzer, shamarAnalyzer };
}

// CRÍTICO: Expor globalmente para o navegador
window.ShamarAnalyzer = ShamarAnalyzer;
window.shamarAnalyzer = shamarAnalyzer;
