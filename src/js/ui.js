/**
 * UI Manager - Gerencia a interface do usuário
 */

export class UIManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.currentScreen = 'inicial';
        this.elements = {};
    }
    
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupObservers();
        this.initCounter();
    }
    
    initCounter() {
        // Inicializar contador de usuários
        const count = this.getUserCount();
        this.updateCounter(count);
    }
    
    getUserCount() {
        // Pegar contador do localStorage
        const count = localStorage.getItem('carbonCalculatorUserCount');
        return count ? parseInt(count) : 0;
    }
    
    incrementUserCount() {
        const currentCount = this.getUserCount();
        const newCount = currentCount + 1;
        localStorage.setItem('carbonCalculatorUserCount', newCount);
        this.updateCounter(newCount);
        return newCount;
    }
    
    updateCounter(count) {
        const counterElement = document.getElementById('total-calculations');
        if (counterElement) {
            this.animateCounter(counterElement, count);
        }
    }
    
    animateCounter(element, targetValue) {
        const duration = 2000; // 2 segundos
        const startValue = parseInt(element.textContent) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);
            element.textContent = currentValue.toLocaleString('pt-BR');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetValue.toLocaleString('pt-BR');
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    cacheElements() {
        this.elements = {
            // Telas
            telaInicial: document.getElementById('tela-inicial'),
            telaFormulario: document.getElementById('tela-formulario'),
            telaResultado: document.getElementById('tela-resultado'),
            
            // Botões
            btnComecar: document.getElementById('começar'),
            btnCalcular: document.getElementById('calcular'),
            btnVoltar: document.getElementById('voltar'),
            btnCalcularNovamente: document.getElementById('calcular-novamente'),
            btnInicio: document.getElementById('inicio'),
            
            // Resultado
            resultadoCO2: document.getElementById('resultado-co2')
        };
        
        // Log para debug
        console.log('🔍 Elementos cacheados:', Object.keys(this.elements));
    }
    
    setupEventListeners() {
        // Navegação
        if (this.elements.btnComecar) {
            this.elements.btnComecar.addEventListener('click', () => {
                this.showScreen('formulario');
            });
        }
        
        if (this.elements.btnCalcular) {
            this.elements.btnCalcular.addEventListener('click', () => {
                this.handleCalculate();
            });
        }
        
        if (this.elements.btnVoltar) {
            this.elements.btnVoltar.addEventListener('click', () => {
                this.showScreen('inicial');
            });
        }
        
        if (this.elements.btnCalcularNovamente) {
            this.elements.btnCalcularNovamente.addEventListener('click', () => {
                this.showScreen('formulario');
            });
        }
        
        if (this.elements.btnInicio) {
            this.elements.btnInicio.addEventListener('click', () => {
                this.showScreen('inicial');
            });
        }
        
        // Formulário interativo
        this.setupFormInteractions();
    }
    
    setupFormInteractions() {
        // Mostrar/ocultar detalhes do carro
        const usaCarroRadios = document.querySelectorAll('input[name="usa-carro"]');
        usaCarroRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const carroDetalhes = document.getElementById('carro-detalhes');
                if (e.target.value === 'sim') {
                    carroDetalhes.style.display = 'block';
                } else {
                    carroDetalhes.style.display = 'none';
                }
            });
        });
        
        // Atualizar valor do slider de carne
        const carneSlider = document.getElementById('refeicoes-carne');
        const carneValue = document.getElementById('carne-value');
        if (carneSlider && carneValue) {
            carneSlider.addEventListener('input', (e) => {
                carneValue.textContent = e.target.value;
            });
        }
    }
    
    setupObservers() {
        // Observar eventos do EventBus
        this.eventBus.subscribe('calculationComplete', (result) => {
            this.displayResult(result);
            this.showScreen('resultado');
        });
        
        this.eventBus.subscribe('calculationError', (error) => {
            this.showNotification('Erro ao calcular. Tente novamente.', 'error');
        });
        
        this.eventBus.subscribe('locationLoaded', (location) => {
            console.log('🎯 Evento locationLoaded recebido:', location);
            this.displayLocation(location);
        });
        
        this.eventBus.subscribe('weatherLoaded', (weather) => {
            this.displayWeather(weather);
        });
    }
    
    showScreen(screen) {
        // Esconder todas as telas
        Object.values(this.elements).forEach(el => {
            if (el && el.classList && el.classList.contains('tela')) {
                el.classList.remove('ativa');
            }
        });
        
        // Mostrar tela solicitada
        const screenMap = {
            'inicial': this.elements.telaInicial,
            'formulario': this.elements.telaFormulario,
            'resultado': this.elements.telaResultado
        };
        
        if (screenMap[screen]) {
            screenMap[screen].classList.add('ativa');
            this.currentScreen = screen;
        }
    }
    
    handleCalculate() {
        // Coletar dados do novo formulário intuitivo
        const usaCarro = document.querySelector('input[name="usa-carro"]:checked')?.value === 'sim';
        const tempoCarro = usaCarro ? parseFloat(document.getElementById('tempo-carro')?.value || 0) : 0;
        const transportePublico = parseFloat(document.getElementById('transporte-publico')?.value || 0);
        const refeicoesCarne = parseFloat(document.getElementById('refeicoes-carne')?.value || 7);
        const pessoasCasa = parseFloat(document.getElementById('pessoas-casa')?.value || 2);
        const tipoResidencia = parseFloat(document.getElementById('tipo-residencia')?.value || 50);
        const arCondicionado = parseFloat(document.querySelector('input[name="ar-condicionado"]:checked')?.value || 0);
        
        // Converter para os valores que a API espera
        // Tempo de carro em minutos/dia -> km/semana (assumindo 50 km/h médio)
        const kmCarro = (tempoCarro * 50 / 60) * 7; // minutos -> horas -> km -> por semana
        
        // Energia: base do tipo de residência + ar condicionado, dividido por pessoas
        const energiaEletrica = (tipoResidencia + arCondicionado) / pessoasCasa;
        
        const userData = {
            kmCarro: Math.round(kmCarro),
            refeicoesCarne: refeicoesCarne,
            energiaEletrica: Math.round(energiaEletrica),
            transporte: transportePublico
        };
        
        console.log('📊 Dados calculados:', userData);
        
        // Incrementar contador de usuários
        const newCount = this.incrementUserCount();
        console.log('👥 Total de usuários:', newCount);
        
        // Notificar para calcular
        this.eventBus.notify('calculate', userData);
    }
    
    displayResult(result) {
        if (!this.elements.resultadoCO2) return;
        
        const co2Anual = parseFloat(result.co2Anual);
        const mediaBrasileira = 4500; // kg CO2 per capita/ano no Brasil
        const mediaGlobal = 4500;
        const metaSustentavel = 2000;
        
        // Calcular percentual vs média
        const vsMedia = ((co2Anual / mediaBrasileira - 1) * 100).toFixed(0);
        const vsMeta = ((co2Anual / metaSustentavel - 1) * 100).toFixed(0);
        
        // Equivalências
        const arvores = Math.ceil(co2Anual / 21); // Uma árvore absorve ~21kg CO2/ano
        const carrosKm = Math.ceil(co2Anual / 0.2); // 0.2kg CO2 por km
        const voosSP_RJ = Math.ceil(co2Anual / 200); // ~200kg CO2 por voo
        
                const html = `
            <div class="dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chart-line"></i> Seu Relatório de Emissões</h2>
                    <p class="dashboard-subtitle">Análise completa da sua pegada de carbono</p>
                </div>
                
                <!-- Valores Principais -->
                <div class="emissions-grid">
                    <div class="emission-card primary">
                        <div class="emission-icon"><i class="fas fa-calendar-week"></i></div>
                        <div class="emission-value">${result.co2Semanal} kg</div>
                        <div class="emission-label">Emissões Semanais</div>
                    </div>
                    <div class="emission-card highlight">
                        <div class="emission-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="emission-value">${result.co2Anual} kg</div>
                        <div class="emission-label">Emissões Anuais</div>
                    </div>
                    <div class="emission-card ${this.getClassificationClass(result.classification)}">
                        <div class="emission-icon">${this.getClassificationIcon(result.classification)}</div>
                        <div class="emission-value">${result.classification}</div>
                        <div class="emission-label">Sua Classificação</div>
                    </div>
                </div>
                
                <!-- Comparações -->
                <div class="comparison-section">
                    <h3><i class="fas fa-balance-scale"></i> Como Você se Compara</h3>
                    <div class="comparison-bars">
                        <div class="comparison-item">
                            <div class="comparison-header">
                                <span class="comparison-label">Meta Sustentável (Acordo de Paris)</span>
                                <span class="comparison-value">2.000 kg/ano</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill green" style="width: ${Math.min(100, (2000/co2Anual)*100)}%"></div>
                            </div>
                        </div>
                        
                        <div class="comparison-item">
                            <div class="comparison-header">
                                <span class="comparison-label">Sua Emissão</span>
                                <span class="comparison-value">${result.co2Anual} kg/ano</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill blue" style="width: 100%"></div>
                            </div>
                        </div>
                        
                        <div class="comparison-item">
                            <div class="comparison-header">
                                <span class="comparison-label">Média Brasileira</span>
                                <span class="comparison-value">${mediaBrasileira.toLocaleString()} kg/ano</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill orange" style="width: ${Math.min(100, (mediaBrasileira/co2Anual)*100)}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="insight-cards">
                        <div class="insight-card ${vsMedia > 0 ? 'warning' : 'success'}">
                            <div class="insight-icon">${vsMedia > 0 ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>'}</div>
                            <div class="insight-text">
                                Você emite <strong>${Math.abs(vsMedia)}%</strong> 
                                ${vsMedia > 0 ? 'a mais' : 'a menos'} que a média brasileira
                            </div>
                        </div>
                        <div class="insight-card ${vsMeta > 0 ? 'danger' : 'success'}">
                            <div class="insight-icon">${vsMeta > 0 ? '<i class="fas fa-times-circle"></i>' : '<i class="fas fa-trophy"></i>'}</div>
                            <div class="insight-text">
                                ${vsMeta > 0 ? `${vsMeta}% acima da meta sustentável` : 'Dentro da meta sustentável!'}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Equivalências -->
                <div class="equivalence-section">
                    <h3><i class="fas fa-exchange-alt"></i> O que Isso Significa na Prática?</h3>
                    <p class="section-subtitle">Suas emissões anuais são equivalentes a:</p>
                    <div class="equivalence-grid">
                        <div class="equivalence-card">
                            <div class="equiv-icon"><i class="fas fa-tree"></i></div>
                            <div class="equiv-value">${arvores}</div>
                            <div class="equiv-label">árvores necessárias para compensar</div>
                            <div class="equiv-note">por 1 ano</div>
                        </div>
                        <div class="equivalence-card">
                            <div class="equiv-icon"><i class="fas fa-car"></i></div>
                            <div class="equiv-value">${carrosKm.toLocaleString()}</div>
                            <div class="equiv-label">km dirigidos de carro</div>
                            <div class="equiv-note">≈ ${Math.ceil(carrosKm/40000)} voltas na Terra</div>
                        </div>
                        <div class="equivalence-card">
                            <div class="equiv-icon"><i class="fas fa-plane"></i></div>
                            <div class="equiv-value">${voosSP_RJ}</div>
                            <div class="equiv-label">voos São Paulo - Rio</div>
                            <div class="equiv-note">ida e volta</div>
                        </div>
                    </div>
                </div>
                
                <!-- Contextualização -->
                ${result.location ? `
                    <div class="context-section">
                        <h3><i class="fas fa-globe-americas"></i> Contexto Regional</h3>
                        <div class="context-grid">
                            <div class="context-item">
                                <span class="context-icon"><i class="fas fa-map-marker-alt"></i></span>
                                <span class="context-label">Localização:</span>
                                <span class="context-value">${result.location.city || result.location.country}</span>
                            </div>
                            <div class="context-item">
                                <span class="context-icon"><i class="fas fa-globe"></i></span>
                                <span class="context-label">Fator Regional:</span>
                                <span class="context-value">${result.regionalFactor}x</span>
                            </div>
                            <div class="context-item">
                                <span class="context-icon"><i class="fas fa-bolt"></i></span>
                                <span class="context-label">Matriz Energética:</span>
                                <span class="context-value">${result.regionalFactor < 1.1 ? 'Relativamente limpa' : 'Intensiva em carbono'}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Ações Recomendadas -->
                <div class="actions-section">
                    <h3><i class="fas fa-tasks"></i> Ações para Reduzir sua Pegada</h3>
                    <p class="section-subtitle">Recomendações personalizadas baseadas no seu perfil:</p>
                    <div class="actions-grid">
                        ${this.generateActionCards(result).join('')}
                    </div>
                </div>
                
                <!-- Fatos Importantes -->
                <div class="facts-section">
                    <h3><i class="fas fa-lightbulb"></i> Você Sabia?</h3>
                    <div class="facts-grid">
                        <div class="fact-card">
                            <div class="fact-icon"><i class="fas fa-temperature-high"></i></div>
                            <div class="fact-text">A temperatura global já aumentou <strong>1,1°C</strong> desde a era pré-industrial</div>
                        </div>
                        <div class="fact-card">
                            <div class="fact-icon"><i class="fas fa-industry"></i></div>
                            <div class="fact-text">70% das emissões globais vêm de apenas <strong>100 empresas</strong></div>
                        </div>
                        <div class="fact-card">
                            <div class="fact-icon"><i class="fas fa-clock"></i></div>
                            <div class="fact-text">Temos até <strong>2030</strong> para reduzir emissões em 45% e evitar catástrofe climática</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.elements.resultadoCO2.innerHTML = html;
    }
    
    displayLocation(location) {
        const locationElement = document.getElementById('location-info');
        if (locationElement) {
            const locationText = location.city 
                ? `${location.city}, ${location.country}` 
                : location.country || 'Brasil';
            locationElement.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span>${locationText}</span>
            `;
            console.log('✅ Localização exibida:', locationText);
        } else {
            console.error('❌ Elemento location-info não encontrado');
        }
    }
    
    displayWeather(weather) {
        const weatherElement = document.getElementById('weather-info');
        if (weatherElement && weather && weather.temp) {
            const weatherText = `${weather.temp}°C - ${weather.condition}`;
            const simulatedBadge = weather.simulated ? ' <small style="opacity:0.7">(simulado)</small>' : '';
            
            weatherElement.innerHTML = `
                <i class="fas fa-cloud-sun"></i>
                <span>${weatherText}${simulatedBadge}</span>
            `;
            console.log('✅ Clima exibido:', weatherText);
        } else {
            console.log('⚠️ Dados de clima incompletos:', weather);
        }
    }
    
    getClassificationClass(classification) {
        const map = {
            'Excelente': 'success',
            'Bom': 'good',
            'Médio': 'warning',
            'Alto': 'danger'
        };
        return map[classification] || 'info';
    }
    
    getClassificationIcon(classification) {
        const map = {
            'Excelente': '<i class="fas fa-trophy"></i>',
            'Bom': '<i class="fas fa-check-circle"></i>',
            'Médio': '<i class="fas fa-exclamation-triangle"></i>',
            'Alto': '<i class="fas fa-exclamation-circle"></i>'
        };
        return map[classification] || '<i class="fas fa-chart-bar"></i>';
    }
    
    generateActionCards(result) {
        const actions = [];
        const anual = parseFloat(result.co2Anual);
        
        // Transporte
        if (anual > 2000) {
            actions.push(`
                <div class="action-card">
                    <div class="action-header">
                        <div class="action-icon transport"><i class="fas fa-bicycle"></i></div>
                        <div class="action-title">Transporte Sustentável</div>
                    </div>
                    <div class="action-body">
                        <p><strong>Impacto:</strong> Redução de até 30% nas emissões</p>
                        <ul>
                            <li>Use transporte público sempre que possível</li>
                            <li>Considere bicicleta ou caminhada para distâncias curtas</li>
                            <li>Compartilhe carona com colegas</li>
                            <li>Planeje suas rotas para otimizar o trajeto</li>
                        </ul>
                    </div>
                    <div class="action-impact"><i class="fas fa-piggy-bank"></i> Economia: R$ 200-500/mês</div>
                </div>
            `);
        }
        
        // Alimentação
        if (anual > 2500) {
            actions.push(`
                <div class="action-card">
                    <div class="action-header">
                        <div class="action-icon food"><i class="fas fa-leaf"></i></div>
                        <div class="action-title">Alimentação Consciente</div>
                    </div>
                    <div class="action-body">
                        <p><strong>Impacto:</strong> Redução de até 25% nas emissões</p>
                        <ul>
                            <li>Reduza o consumo de carne vermelha</li>
                            <li>Inclua mais vegetais e legumes na dieta</li>
                            <li>Compre produtos locais e da estação</li>
                            <li>Evite desperdício de alimentos</li>
                        </ul>
                    </div>
                    <div class="action-impact"><i class="fas fa-heartbeat"></i> Co-benefício: Saúde melhor</div>
                </div>
            `);
        }
        
        // Energia
        if (anual > 3000) {
            actions.push(`
                <div class="action-card">
                    <div class="action-header">
                        <div class="action-icon energy"><i class="fas fa-bolt"></i></div>
                        <div class="action-title">Eficiência Energética</div>
                    </div>
                    <div class="action-body">
                        <p><strong>Impacto:</strong> Redução de até 20% nas emissões</p>
                        <ul>
                            <li>Troque lâmpadas para LED</li>
                            <li>Desligue aparelhos da tomada</li>
                            <li>Use ar condicionado com moderação</li>
                            <li>Considere energia solar</li>
                        </ul>
                    </div>
                    <div class="action-impact"><i class="fas fa-piggy-bank"></i> Economia: R$ 100-300/mês</div>
                </div>
            `);
        }
        
        // Compensação
        actions.push(`
            <div class="action-card">
                <div class="action-header">
                    <div class="action-icon compensation"><i class="fas fa-tree"></i></div>
                    <div class="action-title">Compensação de Carbono</div>
                </div>
                <div class="action-body">
                    <p><strong>Impacto:</strong> Neutralização das emissões restantes</p>
                    <ul>
                        <li>Plante árvores (${Math.ceil(parseFloat(result.co2Anual) / 21)} árvores/ano para compensar)</li>
                        <li>Apoie projetos de reflorestamento</li>
                        <li>Invista em créditos de carbono certificados</li>
                        <li>Participe de iniciativas comunitárias</li>
                    </ul>
                </div>
                    <div class="action-impact"><i class="fas fa-globe-americas"></i> Impacto: Carbono neutro</div>
                </div>
            `);
        
        return actions;
    }
    
    showLoading(message = 'Carregando...') {
        const loadingEl = document.getElementById('loading') || this.createLoadingElement();
        loadingEl.querySelector('.loading-message').textContent = message;
        loadingEl.classList.add('active');
    }
    
    hideLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.classList.remove('active');
        }
    }
    
    createLoadingElement() {
        const loadingEl = document.createElement('div');
        loadingEl.id = 'loading';
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <div class="loading-message">Carregando...</div>
            </div>
        `;
        document.body.appendChild(loadingEl);
        return loadingEl;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notificacao ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}