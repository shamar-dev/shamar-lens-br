// popup.js - Lógica do Popup da Extension

document.addEventListener('DOMContentLoaded', () => {
  console.log('🐺 Popup Shamar carregado');
  
  // Carrega estatísticas
  loadStats();
  
  // Carrega configurações
  loadSettings();
  
  // Event listeners
  setupEventListeners();
});

/**
 * Carrega estatísticas de uso
 */
async function loadStats() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
    
    document.getElementById('analysis-count').textContent = response.analysisCount || 0;
    document.getElementById('flags-count').textContent = response.flagsDetected || 0;
    
  } catch (error) {
    console.error('Erro ao carregar stats:', error);
  }
}

/**
 * Carrega configurações salvas
 */
async function loadSettings() {
  try {
    const data = await chrome.storage.local.get('settings');
    const settings = data.settings || {};
    
    document.getElementById('auto-analyze').checked = settings.autoAnalyze !== false;
    document.getElementById('show-overlay').checked = settings.showOverlay !== false;
    
  } catch (error) {
    console.error('Erro ao carregar settings:', error);
  }
}

/**
 * Salva configurações
 */
async function saveSettings() {
  const settings = {
    autoAnalyze: document.getElementById('auto-analyze').checked,
    showOverlay: document.getElementById('show-overlay').checked
  };
  
  try {
    await chrome.storage.local.set({ settings });
    console.log('🐺 Configurações salvas:', settings);
  } catch (error) {
    console.error('Erro ao salvar settings:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Análise da página atual
  document.getElementById('analyze-current').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_NOW' });
      
      // Feedback visual
      const btn = document.getElementById('analyze-current');
      const originalText = btn.querySelector('.action-text').textContent;
      btn.querySelector('.action-text').textContent = 'Analisando...';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.querySelector('.action-text').textContent = originalText;
        btn.disabled = false;
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao analisar página:', error);
      alert('Não foi possível analisar esta página. Certifique-se de estar em um site de notícias suportado.');
    }
  });
  
  // Material educativo
  document.getElementById('view-education').addEventListener('click', () => {
    chrome.windows.create({
      url: 'popup/education.html',
      type: 'popup',
      width: 600,
      height: 700
    });
  });
  
  // Toggles de configuração
  document.getElementById('auto-analyze').addEventListener('change', saveSettings);
  document.getElementById('show-overlay').addEventListener('change', saveSettings);
  
  // Footer links
  document.getElementById('about-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'popup/about.html' });
  });
  
  document.getElementById('github-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/shamar-lens-br' }); // TODO: criar repo
  });
  
  document.getElementById('feedback-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://forms.gle/shamar-feedback' }); // TODO: criar form
  });
}

/**
 * Auto-atualiza stats a cada 5 segundos
 */
setInterval(loadStats, 5000);
