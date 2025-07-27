// ===================================================
// RunPod GPU最適化API通信管理 (js/api-client.js) v3.0
// Ollama/vLLM専用最適化版
// ================================================== */

// ==================================================
// RunPod自動検出とネットワーク管理
// ==================================================

function getAutoDetectedBaseUrl(port) {
    // 現在アクセスしているサーバーのホスト名/IPアドレスを取得
    const hostname = window.location.hostname;
    
    // localhostの場合はそのまま、それ以外はRunPod IPとして扱う
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${port}`;
    } else {
        return `http://${hostname}:${port}`;
    }
}

// ==================================================
// RunPod GPU最適化API設定管理クラス
// ==================================================

class RunPodAPIConfig {
    constructor() {
        // RunPodでよく使用される設定テンプレート
        this.defaultConfigs = {
            // 🦙 Ollama on RunPod（推奨）
            ollama_runpod: {
                name: '🦙 Ollama (RunPod)',
                port: 11434,
                modelEndpoint: '/api/tags',
                chatEndpoint: '/v1/chat/completions',
                defaultModel: 'auto',
                defaultParams: {
                    temperature: 0.85,      // ロールプレイに最適（創造性と一貫性のバランス）
                    max_tokens: 4000,       // 長めの応答を許可
                    stream: true,
                    top_p: 0.92,           // 多様性を適度に確保
                    top_k: 50,             // Ollamaに有効
                    frequency_penalty: 0.15, // 繰り返し防止を強化
                    presence_penalty: 0.2,   // 新しい話題への展開を促進
                    repeat_penalty: 1.05,    // Ollama特有の設定
                    stop: ["ユーザー:", "User:", "人間:", "あなた:"], // ユーザー代弁防止
                    mirostat: 0,            // Ollama向け（0=無効、1または2で有効）
                    mirostat_eta: 0.1,      // 創造性調整
                    mirostat_tau: 5.0       // 予測性調整
                },
                isOllama: true,
                isRunPod: true,
                pullEndpoint: '/api/pull',
                showEndpoint: '/api/show',
                psEndpoint: '/api/ps'
            },
            // ⚡ vLLM on RunPod
            vllm_runpod: {
                name: '⚡ vLLM (RunPod)',
                port: 8000,
                modelEndpoint: '/v1/models',
                chatEndpoint: '/v1/chat/completions',
                defaultModel: 'auto',
                defaultParams: {
                    temperature: 0.8,        // vLLMは少し低めが安定
                    max_tokens: 4000,
                    stream: true,
                    top_p: 0.9,
                    frequency_penalty: 0.1,
                    presence_penalty: 0.15,
                    repetition_penalty: 1.1, // vLLM向け
                    stop: ["ユーザー:", "User:", "人間:", "あなた:"], // ユーザー代弁防止
                    use_beam_search: false,  // ロールプレイには不要
                    best_of: 1,             // 高速化のため
                    length_penalty: 1.0,    // 応答長度の調整
                    early_stopping: true    // 効率化
                },
                isVLLM: true,
                isRunPod: true
            },
            // 🏠 ローカルOllama（開発用）
            ollama_local: {
                name: '🏠 Ollama (Local)',
                port: 11434,
                modelEndpoint: '/api/tags',
                chatEndpoint: '/v1/chat/completions',
                defaultModel: 'auto',
                defaultParams: {
                    temperature: 0.85,      // ロールプレイに最適（創造性と一貫性のバランス）
                    max_tokens: 4000,       // 長めの応答を許可
                    stream: true,
                    top_p: 0.92,           // 多様性を適度に確保
                    top_k: 50,             // Ollamaに有効
                    frequency_penalty: 0.15, // 繰り返し防止を強化
                    presence_penalty: 0.2,   // 新しい話題への展開を促進
                    repeat_penalty: 1.05,    // Ollama特有の設定
                    stop: ["ユーザー:", "User:", "人間:", "あなた:"], // ユーザー代弁防止
                    mirostat: 0,            // Ollama向け（0=無効、1または2で有効）
                    mirostat_eta: 0.1,      // 創造性調整
                    mirostat_tau: 5.0       // 予測性調整
                },
                isOllama: true,
                isRunPod: false,
                pullEndpoint: '/api/pull',
                showEndpoint: '/api/show',
                psEndpoint: '/api/ps'
            },
            // 🏠 ローカルvLLM（開発用）
            vllm_local: {
                name: '🏠 vLLM (Local)',
                port: 8000,
                modelEndpoint: '/v1/models',
                chatEndpoint: '/v1/chat/completions',
                defaultModel: 'auto',
                defaultParams: {
                    temperature: 0.8,        // vLLMは少し低めが安定
                    max_tokens: 4000,
                    stream: true,
                    top_p: 0.9,
                    frequency_penalty: 0.1,
                    presence_penalty: 0.15,
                    repetition_penalty: 1.1, // vLLM向け
                    stop: ["ユーザー:", "User:", "人間:", "あなた:"], // ユーザー代弁防止
                    use_beam_search: false,  // ロールプレイには不要
                    best_of: 1,             // 高速化のため
                    length_penalty: 1.0,    // 応答長度の調整
                    early_stopping: true    // 効率化
                },
                isVLLM: true,
                isRunPod: false
            },
            // 🔮 Gemini-2.5-pro (Google AI)
            gemini_2_5_pro: {
                name: '🔮 Gemini 2.5 Pro (Google AI)',
                baseUrl: 'https://generativelanguage.googleapis.com',
                modelEndpoint: '/v1beta/models',
                chatEndpoint: '/v1beta/models/gemini-2.5-pro:generateContent',
                defaultModel: 'gemini-2.5-pro',
                defaultParams: {
                    temperature: 0.85,
                    maxOutputTokens: 4000,
                    topP: 0.92,
                    topK: 50,
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH", 
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }
                    ]
                },
                isGemini: true,
                isCloudAPI: true,
                requiresApiKey: true
            },
            // 🔮 Gemini-2.5-flash (Google AI)
            gemini_2_5_flash: {
                name: '⚡ Gemini 2.5 Flash (Google AI)',
                baseUrl: 'https://generativelanguage.googleapis.com',
                modelEndpoint: '/v1beta/models',
                chatEndpoint: '/v1beta/models/gemini-2.5-flash:generateContent',
                defaultModel: 'gemini-2.5-flash',
                defaultParams: {
                    temperature: 0.85,
                    maxOutputTokens: 8000,
                    topP: 0.92,
                    topK: 50,
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH", 
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }
                    ]
                },
                isGemini: true,
                isCloudAPI: true,
                requiresApiKey: true
            },
            // 🔮 Gemini-2.5-flash-lite (Google AI)
            gemini_2_5_flash_lite: {
                name: '💨 Gemini 2.5 Flash Lite (Google AI)',
                baseUrl: 'https://generativelanguage.googleapis.com',
                modelEndpoint: '/v1beta/models',
                chatEndpoint: '/v1beta/models/gemini-2.5-flash-lite:generateContent',
                defaultModel: 'gemini-2.5-flash-lite',
                defaultParams: {
                    temperature: 0.85,
                    maxOutputTokens: 8000,
                    topP: 0.92,
                    topK: 50,
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH", 
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }
                    ]
                },
                isGemini: true,
                isCloudAPI: true,
                requiresApiKey: true
            }
        };
        
        this.currentProvider = 'gemini_2_5_pro';  // デフォルトはGemini 2.5 Pro
        this.customBaseUrls = {};
        this.geminiApiKey = '';  // Gemini APIキー
        this.loadSettings();
        this.updateConfigs();
        
        console.log('🚀 RunPod GPU最適化APIConfig初期化完了');
    }
    
    updateConfigs() {
        this.configs = {};
        
        Object.keys(this.defaultConfigs).forEach(provider => {
            const template = this.defaultConfigs[provider];
            const customBaseUrl = this.customBaseUrls[provider];
            
            // Geminiの場合は既存のbaseUrlを使用、それ以外は自動検出
            let baseUrl;
            if (template.isGemini) {
                baseUrl = customBaseUrl || template.baseUrl;
            } else {
                baseUrl = customBaseUrl || getAutoDetectedBaseUrl(template.port);
            }
            
            this.configs[provider] = {
                ...template,
                baseUrl: baseUrl,
                isCustom: !!customBaseUrl
            };
            
            // デバッグ: Geminiの場合のみログ出力
            if (template.isGemini) {
                console.log(`🔮 Gemini設定更新: ${provider}`, {
                    baseUrl: baseUrl,
                    isGemini: template.isGemini,
                    templateBaseUrl: template.baseUrl
                });
            }
        });
    }
    
    getCurrentConfig() {
        return this.configs[this.currentProvider];
    }
    
    switchProvider(provider) {
        if (this.configs[provider]) {
            this.currentProvider = provider;
            this.saveSettings();
            if (typeof updateConnectionStatus === 'function') {
                updateConnectionStatus('disconnected', `${this.configs[provider].name}に切り替え中...`);
            }
            if (typeof checkConnectionStatus === 'function') {
                checkConnectionStatus();
            }
            console.log(`🔄 プロバイダー切り替え: ${this.configs[provider].name}`);
        }
    }
    
    setCustomBaseUrl(provider, baseUrl) {
        if (baseUrl && baseUrl.trim()) {
            let normalizedUrl = baseUrl.trim();
            if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
                normalizedUrl = 'http://' + normalizedUrl;
            }
            normalizedUrl = normalizedUrl.replace(/\/$/, '');
            
            this.customBaseUrls[provider] = normalizedUrl;
            console.log(`🔧 カスタムURL設定: ${provider} -> ${normalizedUrl}`);
        } else {
            delete this.customBaseUrls[provider];
            console.log(`🔄 自動検出に戻す: ${provider}`);
        }
        
        this.updateConfigs();
        this.saveSettings();
    }
    
    resetToAutoDetected(provider) {
        delete this.customBaseUrls[provider];
        this.updateConfigs();
        this.saveSettings();
    }
    
    getFullUrl(endpoint) {
        const config = this.getCurrentConfig();
        return config.baseUrl + endpoint;
    }
    
    saveSettings() {
        try {
            localStorage.setItem('runpod_api_provider', this.currentProvider);
            localStorage.setItem('runpod_custom_base_urls', JSON.stringify(this.customBaseUrls));
            if (this.geminiApiKey) {
                localStorage.setItem('gemini_api_key', this.geminiApiKey);
            }
        } catch (error) {
            console.error('RunPod API設定保存エラー:', error);
        }
    }
    
    loadSettings() {
        try {
            const savedProvider = localStorage.getItem('runpod_api_provider');
            if (savedProvider && this.defaultConfigs[savedProvider]) {
                this.currentProvider = savedProvider;
            }
            
            const savedUrls = localStorage.getItem('runpod_custom_base_urls');
            if (savedUrls) {
                this.customBaseUrls = JSON.parse(savedUrls) || {};
            }
            
            // Gemini APIキーの読み込み
            const savedGeminiKey = localStorage.getItem('gemini_api_key');
            if (savedGeminiKey) {
                this.geminiApiKey = savedGeminiKey;
            }
        } catch (error) {
            console.error('RunPod API設定読み込みエラー:', error);
            this.customBaseUrls = {};
        }
    }
    
    // Gemini APIキー管理
    setGeminiApiKey(apiKey) {
        this.geminiApiKey = apiKey;
        this.saveSettings();
        console.log('🔮 Gemini APIキーが設定されました');
    }
    
    getGeminiApiKey() {
        return this.geminiApiKey;
    }
    
    hasGeminiApiKey() {
        return !!this.geminiApiKey && this.geminiApiKey.trim().length > 0;
    }
    
    getCurrentProvider() {
        return this.currentProvider;
    }
    
    // API接続テスト
    async testConnection() {
        try {
            const config = this.getCurrentConfig();
            
            if (config.isGemini) {
                return await this.testGeminiConnection();
            } else {
                return await this.testOllamaConnection(config);
            }
        } catch (error) {
            console.error('接続テストエラー:', error);
            return {
                success: false,
                error: error.message || '接続テストに失敗しました'
            };
        }
    }
    
    // Gemini接続テスト
    async testGeminiConnection() {
        console.log('🔮 Gemini接続テスト開始');
        
        if (!this.hasGeminiApiKey()) {
            return {
                success: false,
                error: 'APIキーが設定されていません'
            };
        }
        
        try {
            const config = this.getCurrentConfig();
            const apiKey = this.getGeminiApiKey();
            
            console.log('🔍 Gemini接続デバッグ:', {
                provider: this.currentProvider,
                baseUrl: config?.baseUrl,
                hasApiKey: !!apiKey,
                configName: config?.name
            });
            
            if (!config?.baseUrl) {
                return {
                    success: false,
                    error: 'baseURLが設定されていません'
                };
            }
            
            const testUrl = `${config.baseUrl}/v1beta/models?key=${apiKey}`;
            console.log('🔗 接続URL:', testUrl.replace(apiKey, '***'));
            
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    message: 'Gemini APIに正常に接続できました',
                    models: data.models?.length || 0
                };
            } else {
                return {
                    success: false,
                    error: `接続エラー: ${response.status} ${response.statusText}`
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `接続エラー: ${error.message}`
            };
        }
    }
    
    // Ollama/vLLM接続テスト
    async testOllamaConnection(config) {
        try {
            const testUrl = `${config.baseUrl}/api/tags`;
            
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    message: `${config.name}に正常に接続できました`,
                    models: data.models?.length || 0
                };
            } else {
                return {
                    success: false,
                    error: `接続エラー: ${response.status} ${response.statusText}`
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `接続エラー: ${error.message}`
            };
        }
    }
    
    // RunPod専用デバッグ情報
    getDebugInfo() {
        return {
            currentProvider: this.currentProvider,
            webServerHost: window.location.hostname,
            isRunPodEnvironment: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
            autoDetectedUrls: {
                ollama: getAutoDetectedBaseUrl(11434),
                vllm: getAutoDetectedBaseUrl(8000)
            },
            customUrls: this.customBaseUrls,
            currentConfig: this.getCurrentConfig()
        };
    }
}

// ==================================================
// RunPod GPU最適化APIクライアントクラス
// ==================================================

class RunPodOptimizedAPIClient {
    constructor() {
        this.retryCount = 3;
        this.timeout = 60000;  // RunPodの大きなモデルに対応
        this.rateLimiter = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.cachedRunningModel = null;
        this.performanceMetrics = {
            requestCount: 0,
            totalResponseTime: 0,
            lastResponseTime: 0,
            errors: 0
        };
        
        console.log('🚀 RunPod GPU最適化APIクライアント初期化完了');
    }

    // 🦙 Ollama実行中モデルを取得（RunPod最適化）
    async getRunningOllamaModel() {
        if (!window.apiConfig) {
            return null;
        }
        
        const config = window.apiConfig.getCurrentConfig();
        if (!config.isOllama) {
            return null;
        }

        try {
            // RunPodでは/api/psが重いことがあるので、タイムアウトを短く
            const psUrl = window.apiConfig.getFullUrl('/api/ps');
            const psResponse = await fetch(psUrl, {
                method: 'GET',
                signal: AbortSignal.timeout(10000)  // 10秒
            });

            if (psResponse.ok) {
                const psData = await psResponse.json();
                console.log('🔍 RunPod Ollama実行中プロセス:', psData);
                
                if (psData.models && psData.models.length > 0) {
                    const runningModel = psData.models[0].name;
                    console.log('✅ RunPod実行中モデル検出:', runningModel);
                    this.cachedRunningModel = runningModel;
                    return runningModel;
                }
            }

            // 実行中のモデルがない場合は、利用可能な最初のモデルを使用
            const tagsUrl = window.apiConfig.getFullUrl('/api/tags');
            const tagsResponse = await fetch(tagsUrl, {
                method: 'GET',
                signal: AbortSignal.timeout(10000)
            });

            if (tagsResponse.ok) {
                const tagsData = await tagsResponse.json();
                if (tagsData.models && tagsData.models.length > 0) {
                    // RunPodでロールプレイに適したモデルを優先選択
                    const preferredModels = [
                        'qwen2.5:32b-instruct',
                        'qwen2.5:14b-instruct',
                        'qwen2.5:7b-instruct',
                        'llama3.1:8b-instruct',
                        'llama3.1:70b-instruct'
                    ];
                    
                    for (const preferred of preferredModels) {
                        const found = tagsData.models.find(m => m.name.includes(preferred));
                        if (found) {
                            console.log('🎯 RunPod推奨モデル使用:', found.name);
                            this.cachedRunningModel = found.name;
                            return found.name;
                        }
                    }
                    
                    // 推奨モデルがない場合は最初のモデル
                    if (tagsData.models.length > 0) {
                        const firstModel = tagsData.models[0].name;
                        console.log('📋 RunPod利用可能な最初のモデルを使用:', firstModel);
                        this.cachedRunningModel = firstModel;
                        return firstModel;
                    }
                }
                
                // モデルリストが空の場合のフォールバック
                console.warn('⚠️ RunPod利用可能なモデルが見つかりません。ハードコードされたモデルを使用');
                const fallbackModel = 'hf.co/mradermacher/Qwen3-8B-ERP-v0.1-i1-GGUF:IQ2_XXS';
                this.cachedRunningModel = fallbackModel;
                return fallbackModel;
            }

            return null;

        } catch (error) {
            console.warn('⚠️ RunPod Ollama実行中モデル検出失敗:', error.message);
            return this.cachedRunningModel;
        }
    }

    // 🎯 モデル名を自動解決（RunPod最適化）
    async resolveModelName(configModel) {
        const config = window.apiConfig?.getCurrentConfig();
        
        console.log('🔍 モデル名解決開始:', { configModel, config: config?.name });
        
        if (config?.isOllama) {
            const runningModel = await this.getRunningOllamaModel();
            if (runningModel && runningModel !== '' && runningModel !== 'undefined') {
                console.log(`🎯 RunPod自動検出モデル使用: ${runningModel}`);
                return runningModel;
            }
            console.log('⚠️ RunPod実行中モデルが見つかりません。フォールバックを使用');
        }
        
        // フォールバック処理を改善
        let fallbackModel;
        if (configModel === 'auto' || !configModel || configModel === '' || configModel === 'undefined') {
            fallbackModel = 'gpt-3.5-turbo';
        } else {
            fallbackModel = configModel;
        }
        
        console.log(`📋 フォールバックモデル使用: ${fallbackModel}`);
        return fallbackModel;
    }

    // 🔮 Gemini API専用チャットリクエスト
    async sendGeminiChatRequest(messages, options = {}) {
        const config = window.apiConfig.getCurrentConfig();
        const apiKey = window.apiConfig.getGeminiApiKey();
        
        if (!apiKey) {
            throw new Error('Gemini APIキーが設定されていません。設定画面でAPIキーを入力してください。');
        }
        
        const url = `${config.baseUrl}${config.chatEndpoint}?key=${apiKey}`;
        const startTime = performance.now();
        
        console.log('🔮 Gemini APIリクエスト URL:', url);
        
        // OpenAI形式のメッセージをGemini形式に変換
        const geminiMessages = this.convertToGeminiFormat(messages);
        
        const requestBody = {
            contents: geminiMessages,
            generationConfig: {
                temperature: config.defaultParams.temperature,
                maxOutputTokens: config.defaultParams.maxOutputTokens,
                topP: config.defaultParams.topP,
                topK: config.defaultParams.topK
            },
            safetySettings: config.defaultParams.safetySettings
        };
        
        console.log('🔮 Gemini リクエストボディ:', JSON.stringify(requestBody, null, 2));
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('🔮❌ Gemini API エラー:', errorData);
                throw new Error(`Gemini API エラー: ${response.status} - ${errorData}`);
            }
            
            const data = await response.json();
            console.log('🔮✅ Gemini API レスポンス:', data);
            
            // パフォーマンス測定
            const duration = performance.now() - startTime;
            this.performanceMetrics.totalResponseTime += duration;
            this.performanceMetrics.averageResponseTime = this.performanceMetrics.totalResponseTime / this.performanceMetrics.requestCount;
            
            // Gemini形式のレスポンスをストリーミング形式に変換
            return this.convertGeminiToStreamingResponse(data);
            
        } catch (error) {
            console.error('🔮❌ Gemini API リクエストエラー:', error);
            this.performanceMetrics.errorCount++;
            throw error;
        }
    }
    
    // Gemini用のメッセージ形式変換
    convertToGeminiFormat(messages) {
        return messages.map(msg => {
            return {
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            };
        });
    }
    
    // Geminiレスポンスをストリーミング形式に変換
    convertGeminiToStreamingResponse(geminiResponse) {
        const content = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // ストリーミング形式のReadableStreamを模擬
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                // SSE形式でデータを送信
                const sseData = `data: ${JSON.stringify({
                    choices: [{
                        delta: { content: content },
                        finish_reason: 'stop'
                    }]
                })}\n\n`;
                
                controller.enqueue(encoder.encode(sseData));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
            }
        });
        
        return {
            body: stream,
            ok: true,
            status: 200,
            content: content
        };
    }

    // 🦙 RunPod Ollama専用チャットリクエスト
    async sendOllamaChatRequest(messages, options = {}) {
        const config = window.apiConfig.getCurrentConfig();
        const url = window.apiConfig.getFullUrl(config.chatEndpoint);
        const startTime = performance.now();
        
        // RunPod GPU用にレート制限を緩和
        if (!this.checkRateLimit(url, 60)) {  // 1分間に60回まで
            throw new Error('レート制限に達しました。しばらく待ってから再試行してください。');
        }
        
        for (let attempt = 1; attempt <= this.retryCount; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                // 🎯 RunPodモデル名を自動解決
                const modelName = await this.resolveModelName(config.defaultModel);
                
                // モデル名の検証とフォールバック
                if (!modelName || modelName === '' || modelName === 'undefined') {
                    console.warn('⚠️ モデル名が無効です。フォールバックを使用:', modelName);
                    throw new Error('モデル名を解決できませんでした');
                }

                // デバッグ: options と config の内容を確認
                console.log('🔍 デバッグ情報:', {
                    modelName,
                    'config.defaultParams': config.defaultParams,
                    'options': options,
                    'options.model': options.model
                });

                // RunPod GPU最適化パラメーター（モデル名は最後に設定して上書きを防ぐ）
                const requestBody = {
                    messages: messages,
                    ...config.defaultParams,
                    ...options,
                    // RunPod Ollama専用最適化
                    stream: true,
                    temperature: Math.min(Math.max(options.temperature || 0.8, 0.1), 2.0),
                    max_tokens: Math.min(options.max_tokens || 3000, 4096),
                    top_p: Math.min(Math.max(options.top_p || 0.9, 0.1), 1.0),
                    // モデル名は最後に設定して上書きを確実に防ぐ
                    model: modelName
                };

                console.log('🚀 RunPod Ollama API リクエスト送信:', {
                    url,
                    provider: config.name,
                    model: requestBody.model,
                    messageCount: messages.length,
                    attempt,
                    isRunPod: config.isRunPod
                });

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    
                    // RunPod Ollama特有のエラー処理
                    if (errorText.includes('model not found') || errorText.includes('not found')) {
                        this.cachedRunningModel = null;
                        if (attempt < this.retryCount) {
                            console.log('🔄 RunPodモデル検出キャッシュをクリアして再試行...');
                            await this.delay(2000);  // RunPodは少し長めの待機
                            continue;
                        }
                        
                        throw new Error(`🦙 RunPodでモデル '${requestBody.model}' が見つかりません。\n\n利用可能なモデルを確認してください：\n• ollama list\n• ollama run qwen2.5:7b-instruct\n• ollama run qwen2.5:32b-instruct`);
                    }
                    
                    if (errorText.includes('GPU') || errorText.includes('CUDA')) {
                        throw new Error(`🖥️ RunPod GPU エラー: ${errorText}`);
                    }
                    
                    throw new APIError(`RunPod HTTP ${response.status}: ${errorText}`);
                }

                // パフォーマンス測定
                const responseTime = performance.now() - startTime;
                this.updatePerformanceMetrics(responseTime);

                console.log(`✅ RunPod Ollama API レスポンス受信成功 (${responseTime.toFixed(0)}ms)`);
                return response;

            } catch (error) {
                console.error(`❌ RunPod Ollama API呼び出し失敗 (試行 ${attempt}/${this.retryCount}):`, error);
                
                if (attempt === this.retryCount) {
                    this.performanceMetrics.errors++;
                    throw new APIError(this.getRunPodOllamaErrorMessage(error));
                }
                
                // RunPod用指数バックオフ（GPU負荷を考慮）
                await this.delay(Math.pow(2, attempt) * 1500);
            }
        }
    }

    // ⚡ RunPod vLLM専用チャットリクエスト
    async sendVLLMChatRequest(messages, options = {}) {
        const config = window.apiConfig.getCurrentConfig();
        const url = window.apiConfig.getFullUrl(config.chatEndpoint);
        const startTime = performance.now();
        
        if (!this.checkRateLimit(url, 100)) {  // vLLMは高速なので制限緩和
            throw new Error('レート制限に達しました。しばらく待ってから再試行してください。');
        }
        
        for (let attempt = 1; attempt <= this.retryCount; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                // デバッグ: options と config の内容を確認
                console.log('🔍 vLLM デバッグ情報:', {
                    'config.defaultModel': config.defaultModel,
                    'config.defaultParams': config.defaultParams,
                    'options': options,
                    'options.model': options.model
                });

                // RunPod vLLM最適化パラメーター（モデル名は最後に設定して上書きを防ぐ）
                const requestBody = {
                    messages: messages,
                    ...config.defaultParams,
                    ...options,
                    // vLLM専用最適化
                    stream: true,
                    temperature: Math.min(Math.max(options.temperature || 0.8, 0.01), 2.0),
                    max_tokens: Math.min(options.max_tokens || 3000, 8192),
                    top_p: Math.min(Math.max(options.top_p || 0.9, 0.01), 0.99),
                    repetition_penalty: 1.1,  // vLLM用
                    use_beam_search: false,    // ロールプレイには不要
                    // モデル名は最後に設定して上書きを確実に防ぐ
                    model: config.defaultModel
                };

                console.log('🚀 RunPod vLLM API リクエスト送信:', {
                    url,
                    provider: config.name,
                    model: requestBody.model,
                    messageCount: messages.length,
                    attempt
                });

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new APIError(`RunPod vLLM HTTP ${response.status}: ${errorText}`);
                }

                // パフォーマンス測定
                const responseTime = performance.now() - startTime;
                this.updatePerformanceMetrics(responseTime);

                console.log(`✅ RunPod vLLM API レスポンス受信成功 (${responseTime.toFixed(0)}ms)`);
                return response;

            } catch (error) {
                console.error(`❌ RunPod vLLM API呼び出し失敗 (試行 ${attempt}/${this.retryCount}):`, error);
                
                if (attempt === this.retryCount) {
                    this.performanceMetrics.errors++;
                    throw new APIError(this.getRunPodVLLMErrorMessage(error));
                }
                
                await this.delay(Math.pow(2, attempt) * 1000);
            }
        }
    }

    // 🎯 メインのチャットリクエストメソッド（RunPod最適化）
    async sendChatRequest(messages, options = {}) {
        if (!window.apiConfig) {
            throw new Error('API設定が初期化されていません');
        }
        
        const config = window.apiConfig.getCurrentConfig();
        this.performanceMetrics.requestCount++;
        
        console.log(`🚀 ${config.isGemini ? 'Gemini' : config.isOllama ? 'RunPod Ollama' : 'RunPod vLLM'} チャットリクエスト開始`);
        
        if (config.isGemini) {
            return this.sendGeminiChatRequest(messages, options);
        } else if (config.isOllama) {
            return this.sendOllamaChatRequest(messages, options);
        } else if (config.isVLLM) {
            return this.sendVLLMChatRequest(messages, options);
        } else {
            // フォールバック
            return this.sendStandardChatRequest(messages, options);
        }
    }

    // グループチャット用のsendMessage互換メソッド
    async sendMessage(requestData) {
        // requestDataからmessagesとoptionsを抽出
        const messages = requestData.messages || [];
        const options = {
            model: requestData.model,
            temperature: requestData.temperature,
            max_tokens: requestData.max_tokens,
            stream: requestData.stream || false,
            ...requestData
        };
        
        console.log('📨 sendMessage called with:', { messages: messages.length, options });
        
        try {
            const response = await this.sendChatRequest(messages, options);
            console.log('✅ sendMessage response:', response);
            
            // レスポンスからcontent部分を抽出
            if (response && response.choices && response.choices[0] && response.choices[0].message) {
                return response.choices[0].message.content;
            } else if (typeof response === 'string') {
                return response;
            } else {
                return JSON.stringify(response);
            }
        } catch (error) {
            console.error('❌ sendMessage error:', error);
            throw error;
        }
    }

    // 🔍 RunPod Ollama専用のモデル確認
    async checkOllamaModels() {
        if (!window.apiConfig) {
            return { success: false, error: 'API設定が初期化されていません' };
        }
        
        const config = window.apiConfig.getCurrentConfig();
        if (!config.isOllama) {
            return this.checkModels();
        }
        
        const url = window.apiConfig.getFullUrl('/api/tags');
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // RunPod用に長めに

            const response = await fetch(url, {
                method: 'GET',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                const models = data.models ? data.models.map(m => ({
                    id: m.name,
                    name: m.name,
                    size: m.size,
                    modified_at: m.modified_at,
                    digest: m.digest?.substring(0, 12) + '...',
                    family: m.details?.family || '不明',
                    parameters: m.details?.parameter_size || '不明'
                })) : [];
                
                // RunPod推奨モデルをマーク
                models.forEach(model => {
                    if (model.name.includes('qwen2.5') || model.name.includes('llama3.1')) {
                        model.recommended = true;
                    }
                });
                
                return { 
                    success: true, 
                    models: models,
                    isOllama: true,
                    isRunPod: config.isRunPod
                };
            } else {
                return { 
                    success: false, 
                    error: `RunPod HTTP ${response.status}` 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: `RunPod接続エラー: ${error.message}` 
            };
        }
    }

    // レート制限チェック（RunPod GPU用に調整）
    checkRateLimit(url, maxRequests = 30) {
        const now = Date.now();
        const windowMs = 60000; // 1分
        
        if (!this.rateLimiter.has(url)) {
            this.rateLimiter.set(url, []);
        }
        
        const requests = this.rateLimiter.get(url);
        const validRequests = requests.filter(time => now - time < windowMs);
        
        if (validRequests.length >= maxRequests) {
            return false;
        }
        
        validRequests.push(now);
        this.rateLimiter.set(url, validRequests);
        return true;
    }

    // パフォーマンス測定更新
    updatePerformanceMetrics(responseTime) {
        this.performanceMetrics.totalResponseTime += responseTime;
        this.performanceMetrics.lastResponseTime = responseTime;
    }

    // RunPod Ollama専用エラーメッセージ
    getRunPodOllamaErrorMessage(error) {
        if (error.name === 'AbortError') {
            return 'リクエストがタイムアウトしました。RunPod Ollamaサーバーが大きなモデルを処理中の可能性があります。';
        }
        if (error.message.includes('Failed to fetch')) {
            return `RunPod Ollamaサーバーに接続できません。\n\n確認事項：\n• RunPodのポート11434が開いているか\n• Ollamaサービスが起動しているか\n• ネットワーク接続が正常か`;
        }
        if (error.message.includes('model') && error.message.includes('not found')) {
            return error.message;
        }
        if (error.message.includes('GPU')) {
            return `RunPod GPUエラー: ${error.message}\n\nGPUメモリが不足している可能性があります。`;
        }
        return `RunPod Ollama通信エラー: ${error.message}`;
    }

    // RunPod vLLM専用エラーメッセージ
    getRunPodVLLMErrorMessage(error) {
        if (error.name === 'AbortError') {
            return 'リクエストがタイムアウトしました。RunPod vLLMサーバーの応答を確認してください。';
        }
        if (error.message.includes('Failed to fetch')) {
            return `RunPod vLLMサーバーに接続できません。\n\n確認事項：\n• RunPodのポート8000が開いているか\n• vLLMサービスが起動しているか\n• モデルが正常にロードされているか`;
        }
        return `RunPod vLLM通信エラー: ${error.message}`;
    }

    // 既存のメソッド（短縮版）
    async checkModels() {
        const config = window.apiConfig?.getCurrentConfig();
        if (config?.isOllama) {
            return this.checkOllamaModels();
        }
        
        if (!window.apiConfig) {
            return { success: false, error: 'API設定が初期化されていません' };
        }
        
        const url = window.apiConfig.getFullUrl(config.modelEndpoint);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: 'GET',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                return { 
                    success: true, 
                    models: data.data || data.models || [],
                    isRunPod: config.isRunPod
                };
            } else {
                return { 
                    success: false, 
                    error: `HTTP ${response.status}` 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    async sendStandardChatRequest(messages, options = {}) {
        // 既存のstandardリクエスト処理（省略）
        return this.sendVLLMChatRequest(messages, options);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // RunPod用統計情報取得
    getStats() {
        const avgResponseTime = this.performanceMetrics.requestCount > 0 ? 
            this.performanceMetrics.totalResponseTime / this.performanceMetrics.requestCount : 0;
            
        return {
            rateLimiterEntries: this.rateLimiter.size,
            queueLength: this.requestQueue.length,
            isProcessingQueue: this.isProcessingQueue,
            currentProvider: window.apiConfig ? window.apiConfig.currentProvider : 'unknown',
            cachedRunningModel: this.cachedRunningModel,
            performanceMetrics: {
                ...this.performanceMetrics,
                avgResponseTime: Math.round(avgResponseTime)
            },
            isRunPod: window.apiConfig ? window.apiConfig.getCurrentConfig().isRunPod : false
        };
    }

    // 🔍 RunPod Ollama状態確認（デバッグ用）
    async debugRunPodOllamaStatus() {
        try {
            const runningModel = await this.getRunningOllamaModel();
            const tagsResult = await this.checkOllamaModels();
            
            return {
                runningModel: runningModel,
                availableModels: tagsResult.success ? tagsResult.models.map(m => m.id) : [],
                cached: this.cachedRunningModel,
                isRunPod: window.apiConfig ? window.apiConfig.getCurrentConfig().isRunPod : false,
                stats: this.getStats()
            };
        } catch (error) {
            return {
                error: error.message,
                cached: this.cachedRunningModel,
                isRunPod: window.apiConfig ? window.apiConfig.getCurrentConfig().isRunPod : false
            };
        }
    }
}

// ==================================================
// カスタムエラークラス
// ==================================================

class APIError extends Error {
    constructor(message, code = null, details = null) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

// ==================================================
// RunPod用UI管理関数
// ==================================================

function addRunPodProviderSwitchUI() {
    if (!window.apiConfig) {
        console.log('⚠️ apiConfigが利用できません。0.5秒後に再試行します。');
        setTimeout(addRunPodProviderSwitchUI, 500);
        return;
    }
    
    const managementContainer = document.getElementById('managementContainer');
    if (!managementContainer) {
        console.error('❌ 管理画面コンテナが見つかりません');
        return;
    }
    
    // 既存のAPI設定セクションを削除
    const existingApiSection = managementContainer.querySelector('.api-settings-section');
    if (existingApiSection) {
        existingApiSection.remove();
    }
    
    const config = window.apiConfig.getCurrentConfig();
    const debugInfo = window.apiConfig.getDebugInfo();
    
    const apiSection = document.createElement('div');
    apiSection.className = 'card management-section api-settings-section';
    apiSection.innerHTML = `
        <h2 class="section-title">🚀 API設定 (RunPod GPU / Gemini AI)</h2>
        
        <!-- プロバイダー選択 -->
        <div class="form-group">
            <label for="apiProvider">APIプロバイダー</label>
            <select id="apiProvider" onchange="switchAPIProvider(this.value)">
                <option value="gemini_2_5_pro">🔮 Gemini 2.5 Pro (Google AI)</option>
                <option value="gemini_2_5_flash">⚡ Gemini 2.5 Flash (Google AI)</option>
                <option value="gemini_2_5_flash_lite">💨 Gemini 2.5 Flash Lite (Google AI)</option>
                <option value="ollama_runpod">🦙 Ollama (RunPod)</option>
                <option value="vllm_runpod">⚡ vLLM (RunPod)</option>
                <option value="ollama_local">🏠 Ollama (Local)</option>
                <option value="vllm_local">🏠 vLLM (Local)</option>
            </select>
        </div>
        
        <!-- 接続先設定 -->
        <div class="form-group">
            <label for="apiEndpoint">接続先URL ${config.isRunPod ? '(RunPod)' : '(Local)'}</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" id="apiEndpoint" 
                       placeholder="例: http://your-runpod-id-11434.proxy.runpod.net (RunPod)" 
                       style="flex: 1;" onchange="updateCustomBaseUrl()">
                <button class="btn btn-secondary" onclick="resetToAutoDetected()" style="white-space: nowrap;">
                    🔄 自動検出
                </button>
            </div>
            <div style="font-size: 0.8em; color: #ccc; margin-top: 5px;">
                <div>🤖 自動検出: <code>${config.isCustom ? '未使用' : config.baseUrl}</code></div>
                <div>🌐 Webサーバー: <code>${window.location.origin}</code></div>
                <div>🚀 RunPod環境: <code>${debugInfo.isRunPodEnvironment ? 'はい' : 'いいえ (Local)'}</code></div>
            </div>
        </div>
        
        <!-- Gemini APIキー設定 -->
        <div id="geminiApiKeySection" class="form-group" style="display: none;">
            <label for="geminiApiKey">🔮 Gemini APIキー</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="password" id="geminiApiKey" 
                       placeholder="Gemini APIキーを入力してください"
                       style="flex: 1;">
                <button class="btn btn-secondary" onclick="saveGeminiApiKey()" style="white-space: nowrap;">
                    💾 保存
                </button>
            </div>
            <div style="font-size: 0.8em; color: #ccc; margin-top: 5px;">
                APIキーは <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #4ecdc4;">Google AI Studio</a> で取得できます
            </div>
        </div>
        
        <!-- 接続状態 -->
        <div id="apiStatus" class="status-item">
            状態: 確認中...
        </div>
        
        <!-- コントロールボタン -->
        <div class="controls">
            <button class="btn btn-primary" onclick="testAPIConnection()">🔍 接続テスト</button>
            <button class="btn btn-secondary" onclick="checkAvailableModels()">📋 利用可能モデル確認</button>
            <button class="btn btn-secondary" onclick="showRunPodPerformanceStats()">📊 パフォーマンス統計</button>
            <button class="btn btn-secondary" onclick="resetAPISettings()">🔄 設定リセット</button>
            <button class="btn btn-secondary" onclick="showRunPodDebugInfo()">🐛 RunPodデバッグ情報</button>
        </div>
        
        <!-- RunPod用ヘルプ情報 -->
        <div style="margin-top: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; font-size: 0.9em;">
            <h4 style="margin-bottom: 10px;">🚀 RunPod接続方法</h4>
            <div id="runPodHelp">
                <p><strong>Ollama:</strong> http://your-pod-id-11434.proxy.runpod.net</p>
                <p><strong>vLLM:</strong> http://your-pod-id-8000.proxy.runpod.net</p>
                <p><strong>ローカル:</strong> 自動検出を使用</p>
                <p style="color: #4ecdc4; margin-top: 10px;">💡 RunPodのProxy URLを使用すると外部からアクセス可能です</p>
            </div>
        </div>
    `;
    
    managementContainer.insertBefore(apiSection, managementContainer.firstChild);
    
    // 現在のプロバイダーを選択状態にする
    const currentProvider = window.apiConfig.getCurrentProvider();
    const apiProviderSelect = apiSection.querySelector('#apiProvider');
    if (apiProviderSelect && currentProvider) {
        apiProviderSelect.value = currentProvider;
    }
    
    updateAPIUI();
    
    console.log('🚀 RunPod GPU API設定UIを追加しました');
}

// 新しいイベントハンドラー
function updateCustomBaseUrl() {
    const endpointInput = document.getElementById('apiEndpoint');
    if (endpointInput && window.apiConfig) {
        window.apiConfig.setCustomBaseUrl(window.apiConfig.currentProvider, endpointInput.value);
        updateAPIUI();
        if (typeof showNotification === 'function') {
            showNotification('RunPod接続先URLを更新しました', 'info');
        }
        setTimeout(testAPIConnection, 500);
    }
}

function resetToAutoDetected() {
    if (window.apiConfig) {
        window.apiConfig.resetToAutoDetected(window.apiConfig.currentProvider);
        updateAPIUI();
        if (typeof showNotification === 'function') {
            showNotification('自動検出に戻しました', 'info');
        }
        setTimeout(testAPIConnection, 500);
    }
}

function showRunPodPerformanceStats() {
    if (!window.apiClient) {
        console.error('❌ APIクライアントが初期化されていません');
        showNotification('❌ APIクライアントが初期化されていません', 'error');
        return;
    }
    
    const stats = window.apiClient.getStats();
    const info = `
🚀 RunPod GPU パフォーマンス統計

📊 リクエスト統計:
　• 総リクエスト数: ${stats.performanceMetrics.requestCount}
　• 平均応答時間: ${stats.performanceMetrics.avgResponseTime}ms
　• 最後の応答時間: ${Math.round(stats.performanceMetrics.lastResponseTime)}ms
　• エラー数: ${stats.performanceMetrics.errors}

🤖 現在の設定:
　• プロバイダー: ${window.apiConfig.getCurrentConfig().name}
　• RunPod環境: ${stats.isRunPod ? 'はい' : 'いいえ'}
　• キャッシュ済みモデル: ${stats.cachedRunningModel || 'なし'}

💾 システム状態:
　• レート制限エントリ: ${stats.rateLimiterEntries}
　• 処理キュー: ${stats.queueLength}
    `;
    
    console.info('🚀 RunPod GPU パフォーマンス統計', info);
    showNotification('🚀 パフォーマンス統計をコンソールに表示しました', 'info');
}

function showRunPodDebugInfo() {
    if (!window.apiConfig) {
        console.error('❌ API設定が初期化されていません');
        showNotification('❌ API設定が初期化されていません', 'error');
        return;
    }
    
    const debugInfo = window.apiConfig.getDebugInfo();
    const apiStats = window.apiClient ? window.apiClient.getStats() : {};
    
    const info = `
🚀 RunPod GPU デバッグ情報

🌐 ネットワーク情報:
　• Webサーバーホスト: ${debugInfo.webServerHost}
　• RunPod環境判定: ${debugInfo.isRunPodEnvironment ? 'RunPod' : 'Local'}
　• WebサーバーURL: ${window.location.origin}

🤖 API自動検出URL:
　• Ollama: ${debugInfo.autoDetectedUrls.ollama}
　• vLLM: ${debugInfo.autoDetectedUrls.vllm}

⚙️ 現在の設定:
　• プロバイダー: ${debugInfo.currentProvider}
　• 接続先: ${debugInfo.currentConfig.baseUrl}
　• カスタム設定: ${debugInfo.currentConfig.isCustom ? 'はい' : 'いいえ'}
　• RunPod: ${debugInfo.currentConfig.isRunPod ? 'はい' : 'いいえ'}
　• Ollama: ${debugInfo.currentConfig.isOllama ? 'はい' : 'いいえ'}

💾 保存済みカスタムURL:
${Object.keys(debugInfo.customUrls).length > 0 ? 
    Object.entries(debugInfo.customUrls).map(([k, v]) => `　• ${k}: ${v}`).join('\n') : 
    '　• なし'
}
    `.trim();
    
    console.info('🔧 RunPod API デバッグ情報', info);
    showNotification('🔧 API デバッグ情報をコンソールに表示しました', 'info');
}

// その他の既存関数は省略（元のコードと同じ）

// ==================================================
// グローバル変数への登録
// ==================================================

window.apiConfig = new RunPodAPIConfig();
window.apiClient = new RunPodOptimizedAPIClient();

// ==================================================
// グローバル関数として公開
// ==================================================

window.addProviderSwitchUI = addRunPodProviderSwitchUI;

// プロバイダー切り替え関数
window.switchAPIProvider = function(provider) {
    if (window.apiConfig) {
        window.apiConfig.switchProvider(provider);
        updateAPIUI();
        if (typeof showNotification === 'function') {
            showNotification(`${window.apiConfig.getCurrentConfig().name} に切り替えました`, 'info');
        }
    }
};

// Gemini APIキー保存関数
window.saveGeminiApiKey = function() {
    const keyInput = document.getElementById('geminiApiKey');
    if (keyInput && window.apiConfig) {
        const apiKey = keyInput.value.trim();
        console.log('🔮 APIキー保存試行:', { hasKey: !!apiKey, keyLength: apiKey.length });
        
        if (apiKey) {
            window.apiConfig.setGeminiApiKey(apiKey);
            
            // 保存確認
            const savedKey = window.apiConfig.getGeminiApiKey();
            console.log('🔮 APIキー保存結果:', { saved: !!savedKey, matches: savedKey === apiKey });
            
            if (typeof showNotification === 'function') {
                showNotification('Gemini APIキーが保存されました', 'success');
            }
        } else {
            if (typeof showNotification === 'function') {
                showNotification('APIキーを入力してください', 'error');
            }
        }
    }
};

// UI更新関数
function updateAPIUI() {
    const provider = window.apiConfig?.getCurrentProvider();
    const config = window.apiConfig?.getCurrentConfig();
    
    console.log('🔍 UI更新デバッグ:', {
        provider: provider,
        isGemini: config?.isGemini,
        configName: config?.name
    });
    
    // Gemini APIキー入力の表示/非表示
    const geminiSection = document.getElementById('geminiApiKeySection');
    if (geminiSection) {
        const shouldShow = config?.isGemini === true;
        geminiSection.style.display = shouldShow ? 'block' : 'none';
        console.log('🔮 Geminiセクション表示:', shouldShow, geminiSection);
    } else {
        console.warn('⚠️ geminiApiKeySectionが見つかりません');
    }
    
    // APIキー入力欄の値設定
    const keyInput = document.getElementById('geminiApiKey');
    if (keyInput && config?.isGemini) {
        keyInput.value = window.apiConfig.getGeminiApiKey() || '';
    }
    
    // プロバイダー選択の更新
    const providerSelect = document.getElementById('apiProvider');
    if (providerSelect && provider) {
        providerSelect.value = provider;
    }
}

window.testAPIConnection = async function() {
    const statusDiv = document.getElementById('apiStatus');
    
    if (!window.apiConfig) {
        if (statusDiv) {
            statusDiv.textContent = '❌ API設定が初期化されていません';
            statusDiv.style.color = '#ff6b6b';
        }
        return;
    }
    
    const config = window.apiConfig.getCurrentConfig();
    const testMessage = config.isGemini ? 'Gemini API接続テスト中...' : 'RunPod接続テスト中...';
    
    if (statusDiv) {
        statusDiv.textContent = testMessage;
        statusDiv.style.color = '#ffeb3b';
    }
    
    try {
        const result = await window.apiConfig.testConnection();
        if (result.success) {
            const message = `✅ ${config.name} 接続成功`;
            if (statusDiv) {
                statusDiv.textContent = message;
                statusDiv.style.color = '#4ecdc4';
            }
            if (typeof showNotification === 'function') {
                showNotification(message, 'success');
            }
        } else {
            const message = `❌ ${config.name} 接続失敗: ${result.error}`;
            if (statusDiv) {
                statusDiv.textContent = message;
                statusDiv.style.color = '#ff6b6b';
            }
            if (typeof showNotification === 'function') {
                showNotification(message, 'error');
            }
        }
    } catch (error) {
        const message = `❌ 接続エラー: ${error.message}`;
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.color = '#ff6b6b';
        }
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        }
    }
};

// 簡略化された他の関数
window.checkAvailableModels = async function() {
    try {
        if (typeof showNotification === 'function') {
            showNotification('RunPodモデル情報を取得中...', 'info');
        }
        
        const result = await window.apiClient.checkModels();
        const config = window.apiConfig.getCurrentConfig();
        
        if (result.success && result.models.length > 0) {
            const modelNames = result.models
                .map(model => {
                    const id = model.id || model.name || model;
                    const size = model.size ? ` (${formatFileSize(model.size)})` : '';
                    const recommended = model.recommended ? ' ⭐' : '';
                    return '• ' + id + size + recommended;
                })
                .slice(0, 20)
                .join('\n');
            
            const message = `${config.name} 利用可能モデル${result.isRunPod ? ' (RunPod)' : ''}:\n\n${modelNames}${result.models.length > 20 ? '\n\n...他' + (result.models.length - 20) + '件' : ''}`;
            console.info('📋 利用可能モデル一覧', message);
            
            if (typeof showNotification === 'function') {
                showNotification(`${result.models.length}個のモデルが利用可能です`, 'success');
            }
        } else {
            const message = `モデル情報の取得に失敗しました: ${result.error || '不明なエラー'}`;
            console.error('❌ モデル情報取得エラー:', message);
            if (typeof showNotification === 'function') {
                showNotification(message, 'error');
            }
        }
    } catch (error) {
        const message = `エラー: ${error.message}`;
        console.error('❌ モデル一覧取得中のエラー:', error);
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        }
    }
};

window.updateAPIUI = function() {
    if (!window.apiConfig) return;
    
    const config = window.apiConfig.getCurrentConfig();
    const providerSelect = document.getElementById('apiProvider');
    const endpointInput = document.getElementById('apiEndpoint');
    
    if (providerSelect) {
        providerSelect.value = window.apiConfig.currentProvider;
    }
    if (endpointInput) {
        endpointInput.value = config.isCustom ? config.baseUrl : '';
        endpointInput.placeholder = `自動検出: ${getAutoDetectedBaseUrl(window.apiConfig.defaultConfigs[window.apiConfig.currentProvider].port)}`;
    }
};

window.resetAPISettings = function() {
    if (confirm('RunPod API設定をデフォルトに戻しますか？')) {
        localStorage.removeItem('runpod_api_provider');
        localStorage.removeItem('runpod_custom_base_urls');
        
        window.apiConfig = new RunPodAPIConfig();
        window.apiClient = new RunPodOptimizedAPIClient();
        
        updateAPIUI();
        if (typeof showNotification === 'function') {
            showNotification('RunPod API設定をリセットしました', 'info');
        }
    }
};

window.showRunPodPerformanceStats = showRunPodPerformanceStats;
window.showRunPodDebugInfo = showRunPodDebugInfo;
window.updateCustomBaseUrl = updateCustomBaseUrl;
window.resetToAutoDetected = resetToAutoDetected;

// DOM読み込み完了後にUI自動追加
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('managementContainer')) {
            addRunPodProviderSwitchUI();
            console.log('✅ RunPod GPU API設定UI自動追加完了');
        }
    }, 1000);
});

// ファイルサイズフォーマット関数
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ==================================================
// Gemini API UI制御関数
// ==================================================

// APIプロバイダー切り替え
function switchApiProvider() {
    const select = document.getElementById('apiProvider');
    const geminiSection = document.getElementById('geminiApiKeySection');
    
    if (!select || !geminiSection) return;
    
    const selectedProvider = select.value;
    
    // APIConfig更新
    if (window.apiConfig) {
        window.apiConfig.switchProvider(selectedProvider);
        console.log(`🔄 APIプロバイダーを切り替えました: ${selectedProvider}`);
    }
    
    // Gemini選択時のみAPIキー入力欄を表示
    if (selectedProvider.startsWith('gemini_')) {
        geminiSection.style.display = 'block';
        loadGeminiApiKey();
    } else {
        geminiSection.style.display = 'none';
    }
    
    updateApiConnectionStatus();
}

// Gemini APIキーの保存
function saveGeminiApiKey() {
    const input = document.getElementById('geminiApiKey');
    if (!input || !window.apiConfig) return;
    
    const apiKey = input.value.trim();
    
    if (!apiKey) {
        showNotification('❌ APIキーを入力してください', 'error');
        return;
    }
    
    // APIキーの基本的な形式チェック（AI で始まることが多い）
    if (!apiKey.startsWith('AI') || apiKey.length < 20) {
        showNotification('⚠️ APIキーの形式が正しくない可能性があります', 'warning');
    }
    
    window.apiConfig.setGeminiApiKey(apiKey);
    showNotification('✅ Gemini APIキーを保存しました', 'success');
    
    updateApiConnectionStatus();
}

// Gemini APIキーの読み込み
function loadGeminiApiKey() {
    const input = document.getElementById('geminiApiKey');
    if (!input || !window.apiConfig) return;
    
    const savedKey = window.apiConfig.getGeminiApiKey();
    if (savedKey) {
        input.value = savedKey;
    }
}

// APIキーの表示/非表示切り替え
function toggleGeminiApiKeyVisibility() {
    const input = document.getElementById('geminiApiKey');
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// API接続テスト
async function testApiConnection() {
    if (!window.apiClient || !window.apiConfig) {
        showNotification('❌ APIクライアントが初期化されていません', 'error');
        return;
    }
    
    const config = window.apiConfig.getCurrentConfig();
    showNotification('🔍 接続テスト中...', 'info');
    
    try {
        if (config.isGemini) {
            await testGeminiConnection();
        } else {
            // 既存のOllama/vLLMテスト
            const testMessage = [{ role: 'user', content: '接続テスト' }];
            const response = await window.apiClient.sendChatRequest(testMessage);
            showNotification('✅ 接続テスト成功', 'success');
        }
    } catch (error) {
        console.error('❌ 接続テストエラー:', error);
        showNotification(`❌ 接続テスト失敗: ${error.message}`, 'error');
    }
}

// Gemini接続テスト
async function testGeminiConnection() {
    const config = window.apiConfig.getCurrentConfig();
    const apiKey = window.apiConfig.getGeminiApiKey();
    
    if (!apiKey) {
        throw new Error('Gemini APIキーが設定されていません');
    }
    
    const testMessage = [{ role: 'user', content: 'Hello, this is a connection test.' }];
    const response = await window.apiClient.sendGeminiChatRequest(testMessage);
    
    showNotification('✅ Gemini API接続テスト成功', 'success');
}

// API接続状態の更新
function updateApiConnectionStatus() {
    const statusDiv = document.getElementById('apiConnectionStatus');
    if (!statusDiv || !window.apiConfig) return;
    
    const config = window.apiConfig.getCurrentConfig();
    const hasGeminiKey = window.apiConfig.hasGeminiApiKey();
    
    let statusHtml = `<h4>現在の設定:</h4>`;
    statusHtml += `<p><strong>プロバイダー:</strong> ${config.name}</p>`;
    
    if (config.isGemini) {
        statusHtml += `<p><strong>APIキー:</strong> ${hasGeminiKey ? '✅ 設定済み' : '❌ 未設定'}</p>`;
        statusHtml += `<p><strong>モデル:</strong> ${config.defaultModel}</p>`;
    } else {
        statusHtml += `<p><strong>エンドポイント:</strong> ${window.apiConfig.getFullUrl(config.chatEndpoint)}</p>`;
    }
    
    statusDiv.innerHTML = statusHtml;
}

// APIデバッグ情報表示
function showApiDebugInfo() {
    if (!window.apiConfig) {
        showNotification('❌ APIConfigが初期化されていません', 'error');
        return;
    }
    
    const debugInfo = window.apiConfig.getDebugInfo();
    console.info('🔧 API デバッグ情報', debugInfo);
    showNotification('🔧 デバッグ情報をコンソールに表示しました', 'info');
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const select = document.getElementById('apiProvider');
        if (select && window.apiConfig) {
            // 現在のプロバイダーを選択状態にする
            select.value = window.apiConfig.getCurrentProvider();
            switchApiProvider(); // 初期状態を反映
        }
    }, 1000);
});

console.log('🚀 RunPod GPU最適化API通信モジュール v3.0 読み込み完了');