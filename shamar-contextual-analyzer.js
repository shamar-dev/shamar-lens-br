// shamar-contextual-analyzer.js - Análise Contextual Completa
// v0.4.0 - SEM GRIFO, SÓ ANÁLISE INTELIGENTE
// "O contexto é tudo. A palavra é nada."

const ShamarContextualAnalyzer = {
  
  /**
   * Analisa artigo COMPLETO e retorna avaliação contextual
   */
  analyze(fullText, metadata = {}) {
    console.log('🐺 Iniciando análise contextual completa...');
    
    // 1. Análise básica de padrões (usa detector existente)
    const patternAnalysis = this.analyzePatterns(fullText);
    
    // 2. Análise de estrutura
    const structureAnalysis = this.analyzeStructure(fullText, metadata);
    
    // 3. Análise de fontes
    const sourcesAnalysis = this.analyzeSources(fullText);
    
    // 4. Análise de tom
    const toneAnalysis = this.analyzeTone(fullText);
    
    // 5. Calcula score final contextual
    const finalScore = this.calculateContextualScore({
      patterns: patternAnalysis,
      structure: structureAnalysis,
      sources: sourcesAnalysis,
      tone: toneAnalysis
    });
    
    // 6. Gera recomendação
    const recommendation = this.generateRecommendation(finalScore);
    
    return {
      score: finalScore.score,
      level: finalScore.level,
      color: finalScore.color,
      summary: this.generateSummary(finalScore),
      details: {
        sources: sourcesAnalysis,
        tone: toneAnalysis,
        structure: structureAnalysis,
        patterns: patternAnalysis
      },
      recommendation: recommendation,
      timestamp: new Date().toISOString()
    };
  },
  
  /**
   * Analisa padrões (usa detector existente mas com contexto)
   */
  analyzePatterns(text) {
    if (typeof shamarAnalyzer === 'undefined') {
      return { detected: false, flags: [], score: 100 };
    }
    
    // Usa analyzer existente mas interpreta contextualmente
    const result = shamarAnalyzer.detectLocalPatterns(text);
    
    // Calcula % de texto afetado (não só quantidade de matches)
    const totalWords = text.split(/\s+/).length;
    const suspiciousWords = result.flags.reduce((sum, flag) => 
      sum + (flag.matchCount || 0), 0
    );
    const suspiciousPercentage = (suspiciousWords / totalWords) * 100;
    
    return {
      flagsCount: result.flags.length,
      suspiciousPercentage: Math.round(suspiciousPercentage * 10) / 10,
      categories: [...new Set(result.flags.map(f => f.category))],
      severity: this.getHighestSeverity(result.flags)
    };
  },
  
  /**
   * Analisa estrutura do artigo
   */
  analyzeStructure(text, metadata) {
    const title = metadata.title || '';
    const totalWords = text.split(/\s+/).length;
    
    // Título vs corpo
    const titleSensational = this.isSensational(title);
    const bodySensational = this.isSensational(text);
    
    // Comprimento
    const hasSubstance = totalWords > 150; // Artigo mínimo decente
    
    // Parágrafos
    const paragraphs = text.split(/\n\n+/).length;
    const avgParagraphLength = totalWords / paragraphs;
    const wellStructured = paragraphs > 3 && avgParagraphLength > 30;
    
    return {
      titleSensational,
      bodyBalance: bodySensational ? 'emotivo' : 'factual',
      hasSubstance,
      wellStructured,
      score: this.scoreStructure(titleSensational, bodySensational, hasSubstance, wellStructured)
    };
  },
  
  /**
   * Verifica se texto é sensacionalista
   */
  isSensational(text) {
    const sensationalWords = /\b(URGENTE|BOMBA|CHOQUE|ESCÂNDALO|ABSURDO|INACREDITÁVEL|POLÊMICA)/gi;
    const matches = text.match(sensationalWords) || [];
    const words = text.split(/\s+/).length;
    return (matches.length / words) > 0.02; // Mais de 2% = sensacional
  },
  
  /**
   * Pontua estrutura
   */
  scoreStructure(titleSens, bodySens, substance, structured) {
    let score = 100;
    if (titleSens) score -= 20;
    if (bodySens) score -= 15;
    if (!substance) score -= 30;
    if (!structured) score -= 10;
    return Math.max(0, score);
  },
  
  /**
   * Analisa presença e qualidade de fontes
   */
  analyzeSources(text) {
    // Padrões de citação de fontes
    const officialSources = /\b(STF|Supremo|Ministério|governo|Polícia Federal|PF|MPF|segundo|de acordo com|afirmou|declarou)\b/gi;
    const anonymousSources = /\b(fonte anônima|fonte próxima|fontes dizem|segundo rumores)\b/gi;
    const namedSources = /\b(segundo [A-Z][a-z]+ [A-Z][a-z]+|afirmou [A-Z][a-z]+)\b/g;
    
    const officialCount = (text.match(officialSources) || []).length;
    const anonymousCount = (text.match(anonymousSources) || []).length;
    const namedCount = (text.match(namedSources) || []).length;
    
    let quality = 'desconhecida';
    let score = 50;
    
    if (officialCount > 2 || namedCount > 1) {
      quality = 'identificadas';
      score = 90;
    } else if (officialCount > 0 || namedCount > 0) {
      quality = 'parcialmente identificadas';
      score = 70;
    } else if (anonymousCount > 1) {
      quality = 'anônimas';
      score = 30;
    }
    
    return {
      quality,
      officialCount,
      namedCount,
      anonymousCount,
      score
    };
  },
  
  /**
   * Analisa tom do texto
   */
  analyzeTone(text) {
    // Palavras factuais vs emocionais
    const factualWords = /\b(segundo|informou|declarou|confirmou|divulgou|consta|processo|decisão|documento)\b/gi;
    const emotionalWords = /\b(absurdo|revolta|indignação|chocante|polêmica|escândalo|crime|vergonha)\b/gi;
    
    const factualCount = (text.match(factualWords) || []).length;
    const emotionalCount = (text.match(emotionalWords) || []).length;
    
    const totalWords = text.split(/\s+/).length;
    const factualRatio = (factualCount / totalWords) * 100;
    const emotionalRatio = (emotionalCount / totalWords) * 100;
    
    let tone = 'neutro';
    let score = 80;
    
    if (emotionalRatio > 3) {
      tone = 'fortemente emotivo';
      score = 40;
    } else if (emotionalRatio > 1.5) {
      tone = 'parcialmente emotivo';
      score = 60;
    } else if (factualRatio > 2) {
      tone = 'factual';
      score = 95;
    }
    
    return {
      tone,
      factualRatio: Math.round(factualRatio * 10) / 10,
      emotionalRatio: Math.round(emotionalRatio * 10) / 10,
      score
    };
  },
  
  /**
   * Calcula score contextual final
   */
  calculateContextualScore(analysis) {
    // Pesos por categoria
    const weights = {
      sources: 0.35,   // 35% - Fontes são críticas
      tone: 0.25,      // 25% - Tom importa
      structure: 0.20, // 20% - Estrutura mostra qualidade
      patterns: 0.20   // 20% - Padrões suspeitos
    };
    
    // Calcula score ponderado
    const score = Math.round(
      analysis.sources.score * weights.sources +
      analysis.tone.score * weights.tone +
      analysis.structure.score * weights.structure +
      (100 - analysis.patterns.suspiciousPercentage * 5) * weights.patterns
    );
    
    // Determina nível e cor
    let level, color;
    if (score >= 80) {
      level = 'confiável';
      color = '#16a34a'; // verde
    } else if (score >= 60) {
      level = 'atenção';
      color = '#ca8a04'; // amarelo
    } else if (score >= 40) {
      level = 'suspeito';
      color = '#ea580c'; // laranja
    } else {
      level = 'não confiável';
      color = '#dc2626'; // vermelho
    }
    
    return { score, level, color };
  },
  
  /**
   * Gera resumo executivo
   */
  generateSummary(finalScore) {
    const { score, level } = finalScore;
    
    if (score >= 80) {
      return 'Reportagem com características jornalísticas sólidas. Fontes identificadas e tom factual predominante.';
    } else if (score >= 60) {
      return 'Reportagem parcialmente factual com elementos opinativos ou sensacionalistas em alguns trechos.';
    } else if (score >= 40) {
      return 'Conteúdo com sinais moderados de manipulação. Fontes questionáveis ou tom excessivamente emotivo.';
    } else {
      return 'Conteúdo altamente suspeito. Múltiplos indicadores de manipulação detectados.';
    }
  },
  
  /**
   * Gera recomendação para o usuário
   */
  generateRecommendation(finalScore) {
    const { score } = finalScore;
    
    if (score >= 80) {
      return 'Pode confiar, mas sempre compare com outras fontes.';
    } else if (score >= 60) {
      return 'Leia com senso crítico. Verifique fontes e busque versões alternativas.';
    } else if (score >= 40) {
      return 'Cuidado! Busque confirmação em veículos confiáveis antes de compartilhar.';
    } else {
      return 'Conteúdo suspeito. Não compartilhe sem verificar em múltiplas fontes confiáveis.';
    }
  },
  
  /**
   * Pega maior severidade dos flags
   */
  getHighestSeverity(flags) {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    let highest = 'low';
    let highestValue = 0;
    
    flags.forEach(flag => {
      const value = severityOrder[flag.severity] || 0;
      if (value > highestValue) {
        highestValue = value;
        highest = flag.severity;
      }
    });
    
    return highest;
  }
};

// Exporta
if (typeof window !== 'undefined') {
  window.ShamarContextualAnalyzer = ShamarContextualAnalyzer;
  console.log('🐺 Analisador Contextual carregado');
}
