# 🔮 Guia de Integração: Camada Espiritual + Técnica

## Visão Geral

Este guia explica como integrar os novos módulos que reforçam o propósito espiritual do Shamar Lens sem comprometer a qualidade técnica do código.

## Arquitetura Proposta

```
shamar-core/              # Núcleo técnico (sem espiritualidade)
  ├── analyzer.js
  ├── patterns.js
  └── scoring.js

shamar-spirit/            # Camada espiritual (opcional, separada)
  ├── blessing.js         # Orações (já existe em background.js)
  └── intention.js        # Propósito (documentação)

shamar-compassion/        # Interface compassiva (NOVO)
  ├── shamar-compassionate-messages.js
  ├── shamar-modes.js
  ├── shamar-reflection.js
  └── shamar-privacy-indicator.js

shamar-ui/               # Interface visual
  ├── shamar-badge.js
  ├── shamar-aura.js
  └── shamar-legal.js
```

## Módulos Criados

### 1. `shamar-compassionate-messages.js`
**Propósito:** Sistema de mensagens compassivas que alertam sem acusar.

**Características:**
- Linguagem não-acusatória
- Foco em educação, não punição
- Mensagens adaptadas por score
- Tooltips educativos com tom compassivo

**Uso:**
```javascript
const message = ShamarCompassionateMessages.getMessage(score, level, details);
// Retorna: { title, body, tone, action, icon }
```

### 2. `shamar-modes.js`
**Propósito:** Sistema de modos que respeita o ritmo do usuário.

**Modos Disponíveis:**
- **ACTIVE**: Análise completa (padrão)
- **CONTEMPLATIVE**: Apenas alertas críticos, badge mínimo
- **EDUCATIONAL**: Todos os tooltips, modo aprendizado
- **SILENT**: Análise em background, sem UI

**Uso:**
```javascript
ShamarModes.setMode('contemplative');
const shouldShow = ShamarModes.shouldShowBadge(score);
```

### 3. `shamar-reflection.js`
**Propósito:** Sistema de reflexão pós-análise com perguntas guiadas.

**Características:**
- Perguntas que estimulam pensamento crítico
- Não dá respostas, faz perguntas
- Só aparece no modo educativo
- Delay de 2s para "respiração" antes da reflexão

**Uso:**
```javascript
ShamarReflection.showReflectionDialog(analysis, metadata);
ShamarReflection.showPauseMoment(); // Antes da análise
```

### 4. `shamar-privacy-indicator.js`
**Propósito:** Indicador visual de privacidade (santuário de dados).

**Características:**
- Mostra que análise é 100% local
- Indicador completo na primeira vez
- Indicador mínimo depois
- Modal com detalhes ao clicar

**Uso:**
```javascript
ShamarPrivacyIndicator.show(); // Auto-mostra ao carregar
```

## Integração no `content-script.js`

### Passo 1: Adicionar novos scripts no `manifest.json`

```json
{
  "content_scripts": [
    {
      "js": [
        "shamar-bundle.js",
        "shamar-contextual-analyzer.js",
        "shamar-compassionate-messages.js",  // NOVO
        "shamar-modes.js",                    // NOVO
        "shamar-reflection.js",               // NOVO
        "shamar-privacy-indicator.js",         // NOVO
        "shamar-aura.js",
        "shamar-badge.js",
        "shamar-legal.js",
        "content-script.js"
      ]
    }
  ]
}
```

### Passo 2: Atualizar `analyzePage()` em `content-script.js`

```javascript
async function analyzePage() {
  if (isAnalyzing) return;
  
  const content = extractMainContent();
  
  if (content === lastAnalyzedContent || content.length < 100) {
    return;
  }
  
  isAnalyzing = true;
  lastAnalyzedContent = content;
  
  try {
    const metadata = extractMetadata();
    
    // MOMENTO DE PAUSA (compassivo)
    if (window.ShamarReflection) {
      window.ShamarReflection.showPauseMoment();
    }
    
    // Análise contextual
    const contextualAnalysis = ShamarContextualAnalyzer.analyze(content, metadata);
    
    // Verifica se deve mostrar badge (respeitando modo)
    if (window.ShamarModes?.shouldShowBadge(contextualAnalysis.score)) {
      // Usa mensagens compassivas
      const message = window.ShamarCompassionateMessages?.getMessage(
        contextualAnalysis.score,
        contextualAnalysis.level,
        contextualAnalysis.details
      );
      
      // Mostra badge com mensagem compassiva
      ShamarBadge.show(contextualAnalysis, metadata, message);
    }
    
    // Ativa aura se necessário (respeitando modo)
    if (window.ShamarModes?.shouldActivateAura(contextualAnalysis.score)) {
      const breathSpeed = ShamarBadge.getBreathSpeed(contextualAnalysis.score);
      ShamarAura.activate(breathSpeed);
    }
    
    // Mostra diálogo de reflexão (se modo educativo)
    if (window.ShamarReflection) {
      window.ShamarReflection.showReflectionDialog(contextualAnalysis, metadata);
    }
    
  } catch (error) {
    console.error('🐺 Shamar: Erro na análise', error);
  } finally {
    isAnalyzing = false;
  }
}
```

### Passo 3: Atualizar `showEducationalTooltip()` para usar mensagens compassivas

```javascript
function showEducationalTooltip(type, value) {
  // Remove tooltip existente
  const existingTooltip = document.getElementById('shamar-educational-tooltip');
  if (existingTooltip) existingTooltip.remove();
  
  // Usa sistema de mensagens compassivas
  const educational = window.ShamarCompassionateMessages?.getEducationalMessage(type, value);
  
  if (!educational) {
    // Fallback para conteúdo antigo
    const content = getEducationalContent(type, value);
    // ... código existente
    return;
  }
  
  // Cria tooltip com mensagem compassiva
  const tooltip = document.createElement('div');
  tooltip.id = 'shamar-educational-tooltip';
  // ... estilos ...
  
  tooltip.innerHTML = `
    <!-- Header -->
    <div style="...">
      <span>${educational.icon || '💡'}</span>
      <div>${educational.title}</div>
    </div>
    
    <!-- Intro compassivo -->
    <div style="...">
      ${educational.intro}
    </div>
    
    <!-- Explicação -->
    <div style="...">
      ${educational.explanation}
    </div>
    
    <!-- Guidance (não imposição) -->
    <div style="...">
      ${educational.guidance}
    </div>
  `;
  
  document.body.appendChild(tooltip);
}
```

### Passo 4: Adicionar seletor de modo no popup

No `popup.html`, adicionar:

```html
<section class="modes-section">
  <h2>Modo de Operação</h2>
  <div class="modes-grid">
    <label class="mode-option">
      <input type="radio" name="shamar-mode" value="active" checked>
      <div class="mode-card">
        <span class="mode-icon">🐺</span>
        <div class="mode-name">Ativo</div>
        <div class="mode-desc">Análise completa</div>
      </div>
    </label>
    
    <label class="mode-option">
      <input type="radio" name="shamar-mode" value="contemplative">
      <div class="mode-card">
        <span class="mode-icon">🧘</span>
        <div class="mode-name">Contemplativo</div>
        <div class="mode-desc">Apenas críticos</div>
      </div>
    </label>
    
    <label class="mode-option">
      <input type="radio" name="shamar-mode" value="educational">
      <div class="mode-card">
        <span class="mode-icon">📚</span>
        <div class="mode-name">Educativo</div>
        <div class="mode-desc">Modo aprendizado</div>
      </div>
    </label>
    
    <label class="mode-option">
      <input type="radio" name="shamar-mode" value="silent">
      <div class="mode-card">
        <span class="mode-icon">🔇</span>
        <div class="mode-name">Silencioso</div>
        <div class="mode-desc">Sem elementos visuais</div>
      </div>
    </label>
  </div>
</section>
```

No `popup.js`:

```javascript
// Carrega modo atual
chrome.storage.local.get(['shamar_mode'], (result) => {
  const currentMode = result.shamar_mode || 'active';
  document.querySelector(`input[value="${currentMode}"]`).checked = true;
});

// Salva mudança de modo
document.querySelectorAll('input[name="shamar-mode"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const mode = e.target.value;
    chrome.storage.local.set({ shamar_mode: mode });
    
    // Notifica content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'CHANGE_MODE',
        mode: mode
      });
    });
  });
});
```

No `content-script.js`, adicionar listener:

```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHANGE_MODE' && window.ShamarModes) {
    window.ShamarModes.setMode(message.mode);
    sendResponse({ status: 'mode-changed' });
  }
});
```

## Separação de Responsabilidades

### Código Técnico (Core)
- **Sem espiritualidade**: Apenas lógica de análise
- **Testável**: Unit tests possíveis
- **Colaborativo**: Qualquer dev pode contribuir

### Camada Compassiva
- **Interface**: Como comunicamos com o usuário
- **Linguagem**: Tom e estilo das mensagens
- **UX**: Respeito ao ritmo do usuário

### Camada Espiritual (Opcional)
- **Separada**: Em arquivos próprios
- **Documentada**: Explicada em docs
- **Não intrusiva**: Não afeta código técnico

## Benefícios da Arquitetura

1. **Escalabilidade**: Novos modos e mensagens fáceis de adicionar
2. **Manutenibilidade**: Código organizado por responsabilidade
3. **Colaboração**: Devs seculares podem contribuir no core
4. **Propósito**: Camada compassiva reforça missão espiritual
5. **Flexibilidade**: Modos permitem personalização

## Testes Sugeridos

```javascript
// Teste de mensagens compassivas
describe('ShamarCompassionateMessages', () => {
  it('deve retornar mensagem celebratória para score alto', () => {
    const msg = ShamarCompassionateMessages.getMessage(85, 'confiável', {});
    expect(msg.tone).toBe('celebratory');
  });
  
  it('deve retornar mensagem compassiva para score médio', () => {
    const msg = ShamarCompassionateMessages.getMessage(65, 'atenção', {});
    expect(msg.tone).toBe('compassionate');
  });
});

// Teste de modos
describe('ShamarModes', () => {
  it('deve respeitar modo contemplativo (não mostrar badge para score alto)', () => {
    ShamarModes.setMode('contemplative');
    expect(ShamarModes.shouldShowBadge(75)).toBe(false);
    expect(ShamarModes.shouldShowBadge(45)).toBe(true);
  });
});
```

## Próximos Passos

1. ✅ Integrar novos módulos no `manifest.json`
2. ✅ Atualizar `content-script.js` para usar novos módulos
3. ✅ Adicionar seletor de modo no popup
4. ⏳ Testar em diferentes sites
5. ⏳ Coletar feedback de usuários
6. ⏳ Ajustar mensagens baseado em feedback

---

**Lembre-se:** O propósito espiritual guia as decisões, mas a excelência técnica honra o propósito. Ambos são necessários.

🔮🛡️⚔️🕊️
