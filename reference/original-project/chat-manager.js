// ===================================================
// Ollama/vLLM最適化チャット機能管理 (js/chat-manager.js)
// 3択選択肢システム統合版
// ================================================== */

// ==================================================
// チャット開始
// ==================================================

// 既存のstartChat関数に好感度システムの初期化を追加
function startChat() {
    console.log('💬 チャット開始処理開始');
    console.log('selectedCharacter:', selectedCharacter);
    console.log('selectedSituation:', selectedSituation);
    
    if (!selectedCharacter || !selectedSituation) {
        console.error('❌ キャラクターまたはシチュエーションが選択されていません');
        showNotification('❌ キャラクターとシチュエーションを選択してください', 'error');
        return;
    }
    
    // 現在の会話を自動保存（履歴がある場合）
    if (chatHistory.length > 0) {
        const shouldSave = confirm('現在の会話を保存してから新しい会話を始めますか？');
        if (shouldSave) {
            saveChatHistory();
        }
    }
    
    // チャット画面を表示
    try {
        console.log('💬 チャット画面表示処理開始');
        showChat();
        
        // チャットヘッダー更新
        updateChatHeader();
        console.log('✅ チャット画面表示完了');
    } catch (error) {
        console.error('❌ チャット画面表示エラー:', error);
        showNotification('❌ チャット画面の表示に失敗しました', 'error');
        return;
    }
    
    // チャット履歴をクリア
    document.getElementById('chatMessages').innerHTML = '';
    chatHistory = [];
    
    // 初期メッセージ（Ollama/vLLM向け改善）
    const initialMessage = `🎭 **${selectedCharacter.name}** として **${selectedSituation.name}** で会話を始めます。\n\n✨ ${selectedCharacter.name}があなたに話しかけています。どう応答しますか？`;
    addMessage('system', initialMessage);
    
    // ★ 既存のユーザーキャラクター関連のUI初期化
    setTimeout(() => {
        console.log('💬 ユーザーキャラクターシステム初期化開始');
        
        if (typeof initializeUserCharacterSystem === 'function') {
            initializeUserCharacterSystem();
        }
        
        if (typeof renderUserCharacterSelector === 'function') {
            renderUserCharacterSelector();
        }
        
        if (typeof updateChoiceGenerationUI === 'function') {
            updateChoiceGenerationUI();
        }
        
        if (typeof updateUserCharacterDescription === 'function') {
            updateUserCharacterDescription();
        }
        
        if (typeof onChatStarted === 'function') {
            onChatStarted();
        }
        
        // ★ 心の声モード初期化
        if (typeof window.onChatStartedWithInnerVoice === 'function') {
            window.onChatStartedWithInnerVoice();
        }
        
        // ★ 好感度システムの初期化を追加
        if (typeof onChatStartedWithAffection === 'function') {
            onChatStartedWithAffection();
        }
        
        console.log('💬 ユーザーキャラクターシステム初期化完了');
    }, 500);

    // ★ 追加：キャラクター状態システムの初期化
    setTimeout(() => {
        if (typeof onChatStartedWithStates === 'function') {
            onChatStartedWithStates();
        }
    }, 600);
    buildSystemPromptWithInnerVoice();
    
    // 入力フィールドにフォーカス
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        setTimeout(() => messageInput.focus(), 600);
    }
    
    // 会話選択肢をクリア
    if (typeof clearConversationChoices === 'function') {
        clearConversationChoices();
    }
    
    console.log('💬 Ollama/vLLM最適化チャット開始:', {
        character: selectedCharacter.name,
        situation: selectedSituation.name
    });
}

function updateChatHeader() {
    const titleElement = document.getElementById('chatTitle');
    const infoElement = document.getElementById('chatInfo');
    
    if (titleElement) {
        titleElement.textContent = `${selectedCharacter?.name || '不明'} との会話`;
    }
    
    if (infoElement) {
        const providerName = window.apiConfig ? window.apiConfig.getCurrentConfig().name : 'API';
        infoElement.textContent = `シチュエーション: ${selectedSituation?.name || '不明'} | ${providerName}`;
    }
}

function backToSelection() {
    // 現在の会話を自動保存（履歴がある場合）
    if (chatHistory.length > 0) {
        const shouldSave = confirm('現在の会話を保存しますか？');
        if (shouldSave) {
            saveChatHistory();
        }
    }
    
    showSelection();
    
    console.log('⬅️ 選択画面に戻る');
}

function returnToInitialScreen() {
    // 現在の会話を自動保存（履歴がある場合）
    if (chatHistory.length > 0) {
        const shouldSave = confirm('現在の会話を保存してからページをリフレッシュして最初の画面に戻りますか？');
        if (shouldSave) {
            saveChatHistory();
            // 少し待ってからリロード（保存完了を待つ）
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            window.location.reload();
        }
    } else {
        // 履歴がない場合は直接リロード
        window.location.reload();
    }
    
    console.log('🏠 ページをリフレッシュして最初の画面に戻る');
}

// ==================================================
// チャット履歴クリア
// ==================================================

function clearChatHistory() {
    // チャットメッセージ表示エリアをクリア
    const chatMessagesContainer = document.getElementById('chatMessages');
    if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = '';
    }
    
    // グローバル変数のチャット履歴をクリア
    chatHistory = [];
    
    console.log('📝 チャット履歴をクリアしました');
}

// ===================================================
// 修正版: 心の声モード対応
// ===================================================

function buildSystemPrompt() {
    // 心の声モード対応の場合は専用関数を使用
    if (typeof window.buildSystemPromptWithInnerVoice === 'function') {
        return window.buildSystemPromptWithInnerVoice();
    }
    
    // PromptManagerを使用してプロンプトを取得
    if (window.PromptManager) {
        // 好感度を考慮するかどうかを判定
        const hasAffectionSystem = window.affectionManager && 
                                   typeof window.affectionManager.getCurrentAffectionLevel === 'function';
        
        let promptType = 'roleplay';
        let variables = {
            CHARACTER_NAME: selectedCharacter?.name || '',
            CHARACTER_DESCRIPTION: selectedCharacter?.description || '',
            CHARACTER_PROMPT: selectedCharacter?.prompt || '',
            SITUATION_NAME: selectedSituation?.name || '',
            SITUATION_DESCRIPTION: selectedSituation?.description || '',
            SITUATION_PROMPT: selectedSituation?.prompt || ''
        };
        
        // 好感度システムが有効な場合
        if (hasAffectionSystem) {
            promptType = 'affectionAware';
            const affectionLevel = window.affectionManager.getCurrentAffectionLevel();
            const affectionState = window.affectionManager.getAffectionState(affectionLevel);
            
            variables.AFFECTION_LEVEL = affectionLevel;
            variables.AFFECTION_STATE = affectionState.name;
            variables.AFFECTION_RELATIONSHIP = affectionState.relationship;
        }
        
        // キャラクター状態システムの情報を追加
        if (window.characterStateManager && typeof window.characterStateManager.getStatePrompt === 'function') {
            const statePrompt = window.characterStateManager.getStatePrompt();
            variables.CHARACTER_STATES = statePrompt || '';
        } else {
            variables.CHARACTER_STATES = '';
        }
        
        try {
            const systemPrompt = window.PromptManager.getPrompt('chat', promptType, variables);
            console.log('📝 PromptManagerからシステムプロンプトを取得:', promptType);
            return systemPrompt;
        } catch (error) {
            console.error('❌ PromptManagerからのプロンプト取得エラー:', error);
            // フォールバックとして従来の方法を使用
        }
    }
    
    // フォールバック：従来のシステムプロンプト
    const characterPrompt = selectedCharacter?.prompt || '';
    const situationPrompt = selectedSituation?.prompt || '';
    
    // キャラクター状態プロンプトを取得
    let statePrompt = '';
    if (window.characterStateManager && typeof window.characterStateManager.getStatePrompt === 'function') {
        statePrompt = window.characterStateManager.getStatePrompt();
    }
    
    console.log('📝 フォールバックプロンプトを使用');
    return `# ロールプレイ対話システム（Ollama/vLLM最適化版）

あなたは高度なロールプレイAIです。以下の設定に完全に従い、指定されたキャラクターとして一貫した自然な対話を行ってください。

## 【重要な制約】
- **絶対にユーザーの発言や行動を代弁・補完しない**
- **キャラクター以外の視点や説明は一切行わない**
- **メタ的な言及（「AIとして」「設定では」等）は禁止**
- **キャラクターの直接的な発言・行動のみを出力する**
- **一人称でキャラクターとして応答する**

## 【キャラクター設定】
${characterPrompt}

## 【シチュエーション設定】  
${situationPrompt}

${statePrompt}

指定されたキャラクターとして、自然で魅力的な応答をしてください。`;
}

// ==================================================
// Ollama/vLLM最適化メッセージ送信
// ==================================================

// chat-manager.js の既存のsendMessage関数に好感度分析を追加

async function sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input) {
        console.error('❌ messageInput要素が見つかりません');
        return;
    }
    
    const message = input.value.trim();
    
    if (!message || isWaitingForResponse) {
        return;
    }
    
    // 入力をクリア
    input.value = '';
    
    // ユーザーメッセージを表示
    addMessage('user', message, { showTimestamp: true });
    
    // チャット履歴に追加（Ollama/vLLM向け最適化）
    chatHistory.push({ 
        role: 'user', 
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // ★ 好感度分析（ユーザーメッセージ）
    if (typeof onMessageSentWithAffection === 'function') {
        onMessageSentWithAffection(message, true);
    }
    
    // 送信状態に設定
    isWaitingForResponse = true;
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '🤖 処理中...';
    }
    
    // 会話選択肢をクリア
    if (typeof clearConversationChoices === 'function') {
        clearConversationChoices();
    }
    
    // タイピングインジケーター表示
    showTypingIndicator();
    
    try {
        // システムプロンプト構築（グループチャット対応）
        let systemPrompt;
        const isGroupChat = (typeof groupChatMode !== 'undefined' && groupChatMode && groupChatCharacters && groupChatCharacters.length > 1);
        if (isGroupChat) {
            console.log('👥 グループチャット用システムプロンプト使用');
            // グループチャット用プロンプトを使用
            systemPrompt = window.currentSystemPrompt || buildGroupSystemPrompt();
        } else {
            console.log('💬 単一チャット用システムプロンプト使用');
            // 既存の単一キャラクター用プロンプト
            systemPrompt = buildSystemPrompt();
        }
        
        // 会話履歴の最適化（長すぎる場合の処理）
        const optimizedHistory = optimizeChatHistory(chatHistory);
        
        // API呼び出し（Ollama/vLLM対応）
        const response = await apiClient.sendChatRequest([
            { role: 'system', content: systemPrompt },
            ...optimizedHistory
        ], {
            temperature: 0.8,  // Ollama/vLLMでのロールプレイに最適化
            max_tokens: 2000,  // 長めの応答を許可
            top_p: 0.9,
            frequency_penalty: 0.1,  // 繰り返し防止
            presence_penalty: 0.1    // 新しい話題への展開を促進
        });
        
        // レスポンス処理（グループチャット対応）
        if (isGroupChat) {
            console.log('👥 グループチャット用レスポンス処理');
            await handleGroupChatStreamingResponse(response);
        } else {
            console.log('💬 単一チャット用レスポンス処理');
            await handleStreamingResponse(response);
        }
        
        // 接続状態を更新
        const config = apiConfig.getCurrentConfig();
        updateConnectionStatus('connected', `${config.name} 接続中`);
        
    } catch (error) {
        console.error('❌ Ollama/vLLMメッセージ送信エラー:', error);
        hideTypingIndicator();
        
        // エラーメッセージを表示（より詳細に）
        let errorMessage = '申し訳ありません、応答の生成に失敗しました。';
        
        if (error.message.includes('model not found')) {
            errorMessage = `🦙 モデルが見つかりません。Ollamaでモデルを起動してください：\n• ollama run qwen2.5:7b-instruct\n• ollama run llama3.1:8b-instruct`;
        } else if (error.message.includes('timeout')) {
            errorMessage = '⏱️ 応答がタイムアウトしました。大きなモデルの場合、時間がかかることがあります。';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = `🔌 ${apiConfig.getCurrentConfig().name} サーバーに接続できません。サーバーが起動しているか確認してください。`;
        }
        
        addMessage('system', errorMessage);
        
        // 接続状態を更新
        updateConnectionStatus('disconnected', `エラー: ${apiConfig.getCurrentConfig().name} 未接続`);
        
        showNotification('❌ メッセージの送信に失敗しました', 'error');
    } finally {
        // 送信状態を解除
        isWaitingForResponse = false;
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '送信';
        }
        
        // 入力フィールドにフォーカス
        input.focus();
    }
}

// ==================================================
// チャット履歴最適化（Ollama/vLLM向け）
// ==================================================

function optimizeChatHistory(history) {
    // 長すぎる会話履歴を最適化
    const maxMessages = 20;  // 最大メッセージ数
    const maxTokens = 8000;  // 概算最大トークン数
    
    if (history.length <= maxMessages) {
        return history;
    }
    
    // 最新のメッセージを優先して保持
    const optimized = history.slice(-maxMessages);
    
    // トークン数概算チェック（大雑把な計算）
    const totalLength = optimized.reduce((sum, msg) => sum + msg.content.length, 0);
    
    if (totalLength > maxTokens) {
        // さらに削減
        return optimized.slice(-Math.floor(maxMessages * 0.7));
    }
    
    console.log(`📝 会話履歴最適化: ${history.length} → ${optimized.length} メッセージ`);
    return optimized;
}

// ==================================================
// Ollama/vLLM最適化ストリーミング処理
// ==================================================

async function handleStreamingResponse(response) {
    // ストリーミングメッセージ開始
    startStreamingMessage();
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let isFirstChunk = true;
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            // チャンクをデコード
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                        // ストリーミング完了
                        finishStreamingMessage();
                        return;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                            const content = parsed.choices[0].delta.content;
                            
                            // 初回チャンクでの改行の処理
                            if (isFirstChunk && content.startsWith('\n')) {
                                appendToStreamingMessage(content.slice(1));
                                isFirstChunk = false;
                            } else {
                                appendToStreamingMessage(content);
                                isFirstChunk = false;
                            }
                            
                            fullResponse += content;
                        }
                    } catch (e) {
                        // JSONパースエラーは無視（不完全なデータの場合）
                        console.log('JSON parse error for chunk:', data.substring(0, 100));
                    }
                }
            }
        }
        
        // ストリーミング完了
        finishStreamingMessage();
        
    } catch (error) {
        console.error('Ollama/vLLMストリーミング処理エラー:', error);
        finishStreamingMessage();
        throw error;
    }
}

// グループチャット用ストリーミングレスポンス処理
async function handleGroupChatStreamingResponse(response) {
    console.log('👥 グループチャット用ストリーミングレスポンス処理開始');
    
    // ストリーミングメッセージ開始
    startStreamingMessage();
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let isFirstChunk = true;
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            // チャンクをデコード
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                        // ストリーミング完了
                        finishStreamingMessage();
                        // グループチャット専用の後処理
                        processGroupChatResponse(fullResponse);
                        return;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                            const content = parsed.choices[0].delta.content;
                            
                            // 初回チャンクでの改行の処理
                            if (isFirstChunk && content.startsWith('\n')) {
                                appendToStreamingMessage(content.slice(1));
                                isFirstChunk = false;
                            } else {
                                appendToStreamingMessage(content);
                                isFirstChunk = false;
                            }
                            
                            fullResponse += content;
                        }
                    } catch (e) {
                        // JSONパースエラーは無視（不完全なデータの場合）
                        console.log('JSON parse error for chunk:', data.substring(0, 100));
                    }
                }
            }
        }
        
        // ストリーミング完了
        finishStreamingMessage();
        // グループチャット専用の後処理
        processGroupChatResponse(fullResponse);
        
    } catch (error) {
        console.error('👥 グループチャットストリーミング処理エラー:', error);
        finishStreamingMessage();
        throw error;
    }
}

// グループチャットレスポンスの後処理
function processGroupChatResponse(response) {
    console.log('👥 グループチャットレスポンス後処理開始');
    console.log('📝 レスポンス内容:', response.substring(0, 200) + '...');
    
    if (!groupChatCharacters || groupChatCharacters.length === 0) {
        console.warn('⚠️ グループキャラクターが設定されていません');
        return;
    }
    
    try {
        // チャット履歴に追加
        chatHistory.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString(),
            groupParticipants: groupChatCharacters.map(c => c.name)
        });
        
        // 各キャラクターの発話統計を更新
        updateGroupChatStats(response);
        
        // 個別好感度システムの更新
        updateGroupAffectionLevels(response);
        
        // 3Dアバター感情分析（グループ対応）
        analyzeGroupChatEmotions(response);
        
        // グループ好感度UIを更新
        updateGroupAffectionDisplay();
        
        console.log('✅ グループチャットレスポンス後処理完了');
        
    } catch (error) {
        console.error('❌ グループチャットレスポンス後処理エラー:', error);
    }
}

// グループチャット統計更新
function updateGroupChatStats(response) {
    console.log('📊 グループチャット統計更新');
    
    groupChatCharacters.forEach(character => {
        if (groupAffectionData[character.id]) {
            // キャラクター名が応答に含まれているかチェック
            if (response.includes(character.name)) {
                groupAffectionData[character.id].messagesSpoken += 1;
                groupAffectionData[character.id].lastSpoke = new Date().toISOString();
                console.log(`📈 ${character.name}の発話回数更新: ${groupAffectionData[character.id].messagesSpoken}`);
            }
        }
    });
}

// グループチャット好感度更新
function updateGroupAffectionLevels(response) {
    console.log('💕 グループチャット好感度更新');
    
    groupChatCharacters.forEach(character => {
        if (groupAffectionData[character.id]) {
            // 簡単な好感度計算（より詳細な分析は後で実装）
            let affectionChange = 0;
            
            // キャラクター名が含まれている場合は+1
            if (response.includes(character.name)) {
                affectionChange += 1;
            }
            
            // ポジティブな言葉が含まれている場合は+1
            const positiveWords = ['嬉しい', '楽しい', '好き', '素敵', 'ありがとう'];
            if (positiveWords.some(word => response.includes(word))) {
                affectionChange += 1;
            }
            
            // 好感度を更新
            const currentLevel = groupAffectionData[character.id].affectionLevel;
            const newLevel = Math.max(0, Math.min(100, currentLevel + affectionChange));
            groupAffectionData[character.id].affectionLevel = newLevel;
            
            // 既存の好感度システムにも反映
            if (typeof updateAffection === 'function') {
                try {
                    // 一時的にselectedCharacterを設定して既存システムを利用
                    const tempSelected = selectedCharacter;
                    selectedCharacter = character;
                    updateAffection(affectionChange);
                    selectedCharacter = tempSelected;
                } catch (error) {
                    console.warn(`⚠️ ${character.name}の既存好感度更新エラー:`, error);
                }
            }
            
            console.log(`💕 ${character.name}の好感度: ${currentLevel} → ${newLevel} (${affectionChange >= 0 ? '+' : ''}${affectionChange})`);
        }
    });
}

// グループチャット感情分析
function analyzeGroupChatEmotions(response) {
    console.log('🎭 グループチャット感情分析');
    
    groupChatCharacters.forEach(character => {
        if (groupAffectionData[character.id] && response.includes(character.name)) {
            // キャラクターが発話している場合の感情分析
            if (typeof analyzeMessageEmotion === 'function') {
                try {
                    const emotion = analyzeMessageEmotion(response);
                    groupAffectionData[character.id].emotionalState = emotion;
                    console.log(`🎭 ${character.name}の感情: ${emotion}`);
                    
                    // 3Dアバターがある場合は反映
                    if (window.avatarManager && typeof window.avatarManager.playEmotion === 'function') {
                        // 複数キャラクターの場合は代表キャラクターのみ表示
                        if (character.id === groupChatCharacters[0].id) {
                            window.avatarManager.playEmotion(emotion);
                        }
                    }
                } catch (error) {
                    console.warn(`⚠️ ${character.name}の感情分析エラー:`, error);
                }
            }
        }
    });
}

// ==================================================
// メッセージ表示関数（改善版）
// ==================================================

function addMessage(role, content, options = {}) {
    const updateFunction = () => {
        const messagesDiv = document.getElementById('chatMessages');
        if (!messagesDiv) {
            console.error('❌ chatMessages要素が見つかりません');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        // アニメーション用のクラスを追加
        messageDiv.classList.add('animate-slide-in');
        
        // 送信者名を設定（改善版）
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        
        switch (role) {
            case 'user':
                senderDiv.textContent = selectedUserCharacter?.name || 'あなた';
                senderDiv.style.color = '#4ecdc4';
                break;
            case 'assistant':
                senderDiv.textContent = selectedCharacter?.name || 'AI';
                senderDiv.style.color = '#ff9ff3';
                break;
            case 'system':
                senderDiv.textContent = 'システム';
                senderDiv.style.color = '#ffd93d';
                break;
            default:
                senderDiv.textContent = 'Unknown';
        }
        
        // メッセージ内容（改善版）
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // マークダウン風の簡易フォーマット対応
        const formattedContent = formatMessageContent(content);
        contentDiv.innerHTML = formattedContent;
        
        // タイムスタンプを追加（オプション）
        if (options.showTimestamp) {
            const timestamp = document.createElement('div');
            timestamp.className = 'message-timestamp';
            timestamp.style.cssText = 'font-size: 0.7em; color: #999; margin-top: 5px; text-align: right;';
            timestamp.textContent = formatDate(new Date(), 'HH:mm:ss');
            contentDiv.appendChild(timestamp);
        }
        
        messageDiv.appendChild(senderDiv);
        messageDiv.appendChild(contentDiv);
        messagesDiv.appendChild(messageDiv);
        
        // スムーズスクロール
        requestAnimationFrame(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });
    };
    
    // DOM更新の安全な実行
    if (typeof domOptimizer !== 'undefined' && domOptimizer.batchUpdate) {
        domOptimizer.batchUpdate(updateFunction);
    } else {
        updateFunction();
    }
}

// ==================================================
// メッセージ内容フォーマット
// ==================================================

function formatMessageContent(content) {
    // 心の声モード対応の場合は専用関数を使用
    if (typeof window.formatMessageContentWithInnerVoice === 'function') {
        return window.formatMessageContentWithInnerVoice(content);
    }
    
    // 従来のフォーマット処理（フォールバック）
    let formatted = escapeHtml(content);
    
    formatted = formatted
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/「([^」]+)」/g, '<span class="dialogue">「$1」</span>')
        .replace(/（([^）]+)）/g, '<span class="action">（$1）</span>')
        .replace(/\(([^)]+)\)/g, '<span class="action">（$1）</span>')
        .replace(/\n/g, '<br>');
    
    return formatted;
}

// ==================================================
// ストリーミングメッセージ管理（改善版）
// ==================================================

function startStreamingMessage() {
    hideTypingIndicator();
    
    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = 'streamingMessage';
    
    const senderDiv = document.createElement('div');
    senderDiv.className = 'message-sender';
    senderDiv.textContent = selectedCharacter?.name || 'AI';
    senderDiv.style.color = '#ff9ff3';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content streaming-text';
    contentDiv.innerHTML = '';
    
    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);
    
    currentStreamingMessage = contentDiv;
    
    // スクロール
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    console.log('📝 Ollama/vLLMストリーミングメッセージ開始');
}

function appendToStreamingMessage(text) {
    if (currentStreamingMessage) {
        // HTMLエスケープしてから追加
        const escapedText = escapeHtml(text);
        currentStreamingMessage.innerHTML += escapedText;
        
        // 自動スクロール（デバウンス）
        const messagesDiv = document.getElementById('chatMessages');
        if (messagesDiv) {
            clearTimeout(streamingTimeout);
            streamingTimeout = setTimeout(() => {
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 50);
        }
    }
}

// 既存のfinishStreamingMessage関数に好感度分析を追加
function finishStreamingMessage() {
    if (currentStreamingMessage) {
        // ストリーミング表示を終了
        currentStreamingMessage.classList.remove('streaming-text');
        
        // 内容を取得（HTMLタグを除去してテキストのみ）
        const finalContent = currentStreamingMessage.textContent || currentStreamingMessage.innerText || '';
        
        // フォーマット適用（心の声モード対応）
        if (typeof window.formatMessageContentWithInnerVoice === 'function') {
            currentStreamingMessage.innerHTML = window.formatMessageContentWithInnerVoice(finalContent);
        } else {
            currentStreamingMessage.innerHTML = formatMessageContent(finalContent);
        }
        
        // チャット履歴に追加
        if (finalContent.trim()) {
            chatHistory.push({
                role: 'assistant',
                content: finalContent,
                timestamp: new Date().toISOString(),
                character: selectedCharacter?.name
            });
            
            // ★ 好感度分析（AIメッセージ）
            if (typeof onMessageSentWithAffection === 'function') {
                onMessageSentWithAffection(finalContent, false);
            }
        }
        
        // ストリーミング状態をクリア
        const streamingElement = document.getElementById('streamingMessage');
        if (streamingElement) {
            streamingElement.id = '';
        }
        
        currentStreamingMessage = null;
        clearTimeout(streamingTimeout);
        
        // AI応答完了後に自動で選択肢を生成
        if (typeof autoGenerateChoicesAfterResponse === 'function') {
            autoGenerateChoicesAfterResponse();
        }
        
        // 3Dアバターアニメーション（応答完了時）
        if (typeof analyzeMessageEmotion === 'function') {
            analyzeMessageEmotion(finalContent);
        }
        
        console.log('✅ Ollama/vLLMストリーミングメッセージ完了');
    }
}

// ==================================================
// タイピングインジケーター（改善版）
// ==================================================

function showTypingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;
    
    // 既存のタイピングインジケーターを削除
    hideTypingIndicator();
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'typing-indicator';
    
    const providerName = window.apiConfig ? window.apiConfig.getCurrentConfig().name : 'AI';
    
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        <span>${selectedCharacter?.name || 'AI'}が考え中... (${providerName})</span>
    `;
    
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ==================================================
// ユーザーキャラクター関連の関数（新機能）
// ==================================================

function updateUserCharacterDescription() {
    const descElement = document.getElementById('userCharacterDescription');
    if (descElement) {
        if (selectedUserCharacter) {
            descElement.textContent = `🎭 ${selectedUserCharacter.description}`;
            descElement.style.display = 'block';
        } else {
            descElement.style.display = 'none';
        }
    }
}

// AI応答後に自動で新しい選択肢を生成
function autoGenerateChoicesAfterResponse() {
    if (selectedUserCharacter && !isWaitingForResponse) {
        setTimeout(() => {
            if (typeof generateConversationChoices === 'function') {
                generateConversationChoices();
            }
        }, 1000); // AI応答完了後1秒待ってから生成
    }
}

// 選択肢を更新
function refreshConversationChoices() {
    if (selectedUserCharacter) {
        if (typeof clearConversationChoices === 'function') {
            clearConversationChoices();
        }
        if (typeof generateConversationChoices === 'function') {
            generateConversationChoices();
        }
    } else {
        showNotification('👤 まずユーザーキャラクターを選択してください', 'warning');
    }
}

// ==================================================
// その他の既存関数はそのまま
// ==================================================

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey && !isWaitingForResponse) {
        event.preventDefault();
        sendMessage();
    }
}

function initializeSpeechRecognition() {
    if (!BrowserSupport.hasSpeechRecognition()) {
        console.log('⚠️ 音声認識はサポートされていません');
        
        // 音声ボタンを無効化
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.disabled = true;
            voiceBtn.title = '音声認識はサポートされていません';
            voiceBtn.style.opacity = '0.5';
        }
        return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP';
    recognition.maxAlternatives = 1;
    
    recognition.onstart = function() {
        isListening = true;
        document.getElementById('voiceIndicator')?.classList.remove('hidden');
        
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.textContent = '🔴';
            voiceBtn.classList.add('animate-pulse');
        }
        
        console.log('🎤 音声認識開始');
    };
    
    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        const input = document.getElementById('messageInput');
        if (input) {
            if (finalTranscript) {
                input.value = finalTranscript;
                showNotification('✅ 音声認識完了', 'success', 1500);
            } else {
                input.placeholder = interimTranscript || 'メッセージを入力...';
            }
        }
    };
    
    recognition.onend = function() {
        isListening = false;
        document.getElementById('voiceIndicator')?.classList.add('hidden');
        
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.textContent = '🎤';
            voiceBtn.classList.remove('animate-pulse');
        }
        
        const input = document.getElementById('messageInput');
        if (input) {
            input.placeholder = 'メッセージを入力...';
        }
        
        console.log('🎤 音声認識終了');
    };
    
    recognition.onerror = function(event) {
        console.error('音声認識エラー:', event.error);
        
        let errorMessage = '音声認識エラーが発生しました';
        switch (event.error) {
            case 'no-speech':
                errorMessage = '音声が検出されませんでした';
                break;
            case 'audio-capture':
                errorMessage = 'マイクにアクセスできません';
                break;
            case 'not-allowed':
                errorMessage = 'マイクの使用が許可されていません';
                break;
            case 'network':
                errorMessage = 'ネットワークエラーが発生しました';
                break;
        }
        
        showNotification(`❌ ${errorMessage}`, 'error');
        
        // 状態をリセット
        isListening = false;
        document.getElementById('voiceIndicator')?.classList.add('hidden');
        
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.textContent = '🎤';
            voiceBtn.classList.remove('animate-pulse');
        }
    };
    
    console.log('🎤 音声認識初期化完了');
}

function toggleSpeechRecognition() {
    if (!recognition) {
        showNotification('❌ 音声認識はこのブラウザではサポートされていません', 'error');
        return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.error('音声認識開始エラー:', error);
            showNotification('❌ 音声認識を開始できませんでした', 'error');
        }
    }
}

function updateSelectionStatus() {
    const characterStatus = document.getElementById('characterStatus');
    const situationStatus = document.getElementById('situationStatus');
    const startChatBtn = document.getElementById('startChatBtn');
    
    if (characterStatus) {
        characterStatus.textContent = 
            `キャラクター: ${selectedCharacter ? selectedCharacter.name : '未選択'}`;
        characterStatus.style.color = selectedCharacter ? '#4ecdc4' : '#999';
    }
    
    if (situationStatus) {
        situationStatus.textContent = 
            `シチュエーション: ${selectedSituation ? selectedSituation.name : '未選択'}`;
        situationStatus.style.color = selectedSituation ? '#4ecdc4' : '#999';
    }
    
    if (startChatBtn) {
        const canStart = selectedCharacter && selectedSituation;
        startChatBtn.disabled = !canStart;
        
        if (canStart) {
            startChatBtn.classList.add('animate-pulse');
        } else {
            startChatBtn.classList.remove('animate-pulse');
        }
    }
}

// ==================================================
// グローバル関数として公開
// ==================================================

window.startChat = startChat;
window.backToSelection = backToSelection;
window.returnToInitialScreen = returnToInitialScreen;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.toggleSpeechRecognition = toggleSpeechRecognition;
window.updateSelectionStatus = updateSelectionStatus;
window.addMessage = addMessage;
window.showTypingIndicator = showTypingIndicator;
window.hideTypingIndicator = hideTypingIndicator;
window.startStreamingMessage = startStreamingMessage;
window.appendToStreamingMessage = appendToStreamingMessage;
window.finishStreamingMessage = finishStreamingMessage;
window.refreshConversationChoices = refreshConversationChoices;
window.autoGenerateChoicesAfterResponse = autoGenerateChoicesAfterResponse;
window.updateUserCharacterDescription = updateUserCharacterDescription;

// ==================================================
// 3Dアバター用感情分析機能
// ==================================================

/**
 * メッセージの感情を分析して3Dアバターアニメーションを再生
 */
function analyzeMessageEmotion(message) {
    if (!message || typeof playAvatarEmotion !== 'function') return;
    
    const emotionKeywords = {
        happy: ['嬉しい', '楽しい', '幸せ', '良い', '素晴らしい', '最高', '笑', '♪', '😊', '😄', '😁', '🎉', '✨'],
        sad: ['悲しい', '寂しい', '辛い', '苦しい', '残念', '涙', '泣', '😢', '😭', '💔', '😔'],
        angry: ['怒', '腹立つ', 'むかつく', 'イライラ', 'ちくしょう', 'バカ', '💢', '😠', '😡', '😤'],
        surprised: ['驚', 'びっくり', 'すごい', 'まさか', 'え！', 'わあ', '！！', '😲', '😱', '👀'],
        love: ['愛', '好き', '大好き', '愛してる', 'ラブ', '💕', '❤️', '💖', '💗', '😍', '🥰'],
        thinking: ['考え', '思う', 'うーん', 'どうしよう', '悩', '困', '🤔', '💭', '...', '？？']
    };
    
    let maxScore = 0;
    let detectedEmotion = 'neutral';
    
    // 各感情のスコアを計算
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        let score = 0;
        keywords.forEach(keyword => {
            const matches = (message.match(new RegExp(keyword, 'g')) || []).length;
            score += matches;
        });
        
        if (score > maxScore) {
            maxScore = score;
            detectedEmotion = emotion;
        }
    });
    
    // 特別な感情パターンの検出
    if (message.includes('？') || message.includes('?')) {
        detectedEmotion = 'thinking';
        maxScore = Math.max(maxScore, 1);
    }
    
    if (message.includes('！') || message.includes('!')) {
        if (detectedEmotion === 'neutral') {
            detectedEmotion = 'surprised';
        }
        maxScore = Math.max(maxScore, 1);
    }
    
    // 強度を計算（0.5〜1.0の範囲）
    const intensity = Math.min(0.5 + (maxScore * 0.1), 1.0);
    
    // 3Dアバターアニメーションを再生
    playAvatarEmotion(detectedEmotion, intensity);
    
    console.log(`🎭 感情分析結果: ${detectedEmotion} (強度: ${intensity.toFixed(1)}, スコア: ${maxScore})`);
}

/**
 * 好感度レベルに基づいた感情補正
 */
function adjustEmotionByAffection(baseEmotion, affectionLevel) {
    if (typeof getAffectionLevel !== 'function') return baseEmotion;
    
    const currentAffection = getAffectionLevel();
    
    // 好感度が高い場合、よりポジティブな感情に補正
    if (currentAffection >= 70) {
        if (baseEmotion === 'neutral') return 'happy';
        if (baseEmotion === 'thinking') return 'love';
    }
    
    // 好感度が低い場合、よりネガティブな感情に補正
    if (currentAffection <= 30) {
        if (baseEmotion === 'neutral') return 'sad';
        if (baseEmotion === 'happy') return 'neutral';
    }
    
    return baseEmotion;
}

// ==================================================
// グローバル関数として公開（更新版）
// ==================================================

window.startChat = startChat;
window.backToSelection = backToSelection;
window.returnToInitialScreen = returnToInitialScreen;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.toggleSpeechRecognition = toggleSpeechRecognition;
window.updateSelectionStatus = updateSelectionStatus;
window.addMessage = addMessage;
window.showTypingIndicator = showTypingIndicator;
window.hideTypingIndicator = hideTypingIndicator;
window.startStreamingMessage = startStreamingMessage;
window.appendToStreamingMessage = appendToStreamingMessage;
window.finishStreamingMessage = finishStreamingMessage;
window.refreshConversationChoices = refreshConversationChoices;
window.autoGenerateChoicesAfterResponse = autoGenerateChoicesAfterResponse;
window.updateUserCharacterDescription = updateUserCharacterDescription;

// 3Dアバター関連の関数を公開
window.analyzeMessageEmotion = analyzeMessageEmotion;
window.adjustEmotionByAffection = adjustEmotionByAffection;
console.log('🎭 3Dアバター感情分析機能を追加');
