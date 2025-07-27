// ===================================================
// ユーティリティと基底クラス (js/utils.js)
// ================================================== */

// ==================================================
// DOM操作最適化クラス
// ==================================================

class DOMOptimizer {
    constructor() {
        this.updateQueue = [];
        this.isProcessing = false;
    }
    
    // バッチ更新でレンダリング最適化
    batchUpdate(callback) {
        this.updateQueue.push(callback);
        if (!this.isProcessing) {
            this.isProcessing = true;
            requestAnimationFrame(() => this.processQueue());
        }
    }
    
    processQueue() {
        // DocumentFragmentを使って一括DOM操作
        this.updateQueue.forEach(callback => callback());
        this.updateQueue = [];
        this.isProcessing = false;
    }
    
    // 要素の可視性チェック
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // スムーズスクロール
    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ==================================================
// メモリ管理クラス
// ==================================================

class MemoryManager {
    constructor() {
        this.eventListeners = new Map();
        this.intervals = new Set();
        this.timeouts = new Set();
        this.observers = new Set();
    }
    
    // 安全なイベントリスナー追加
    addListener(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler, options });
    }
    
    // 安全なタイマー管理
    safeSetTimeout(callback, delay) {
        const id = setTimeout(() => {
            callback();
            this.timeouts.delete(id);
        }, delay);
        this.timeouts.add(id);
        return id;
    }
    
    safeSetInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.intervals.add(id);
        return id;
    }
    
    // Intersection Observer の管理
    createIntersectionObserver(callback, options = {}) {
        const observer = new IntersectionObserver(callback, options);
        this.observers.add(observer);
        return observer;
    }
    
    // メモリリーク防止のクリーンアップ
    cleanup() {
        this.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
        });
        this.eventListeners.clear();
        
        this.timeouts.forEach(id => clearTimeout(id));
        this.intervals.forEach(id => clearInterval(id));
        this.timeouts.clear();
        this.intervals.clear();
        
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        console.log('🧹 メモリクリーンアップ完了');
    }
}

// ==================================================
// パフォーマンス監視クラス
// ==================================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            renderTime: [],
            apiCallTime: [],
            domUpdateTime: [],
            userInteractionTime: []
        };
        this.startTimes = new Map();
    }
    
    // 処理時間測定開始
    startMeasure(name) {
        this.startTimes.set(name, performance.now());
    }
    
    // 処理時間測定終了
    endMeasure(name) {
        const startTime = this.startTimes.get(name);
        if (startTime) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            if (!this.metrics[name]) {
                this.metrics[name] = [];
            }
            this.metrics[name].push(duration);
            
            // 5秒以上かかる処理は警告
            if (duration > 5000) {
                console.warn(`⚠️ 重い処理検出: ${name} - ${duration.toFixed(2)}ms`);
            }
            
            this.startTimes.delete(name);
            return duration;
        }
        return null;
    }
    
    // 処理時間測定（コールバック形式）
    measureTime(name, callback) {
        const start = performance.now();
        const result = callback();
        const end = performance.now();
        
        const duration = end - start;
        if (!this.metrics[name]) this.metrics[name] = [];
        this.metrics[name].push(duration);
        
        // 5秒以上かかる処理は警告
        if (duration > 5000) {
            console.warn(`⚠️ 重い処理検出: ${name} - ${duration.toFixed(2)}ms`);
        }
        
        return result;
    }
    
    // 統計取得
    getStats() {
        const stats = {};
        Object.entries(this.metrics).forEach(([key, values]) => {
            if (values.length > 0) {
                stats[key] = {
                    avg: values.reduce((a, b) => a + b, 0) / values.length,
                    max: Math.max(...values),
                    min: Math.min(...values),
                    count: values.length,
                    latest: values[values.length - 1]
                };
            }
        });
        return stats;
    }
    
    // メトリクスのリセット
    resetMetrics() {
        Object.keys(this.metrics).forEach(key => {
            this.metrics[key] = [];
        });
        this.startTimes.clear();
    }
}

// ==================================================
// ユーティリティ関数
// ==================================================

// デバウンス関数（頻繁な処理の最適化用）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数（スクロールイベント等の最適化用）
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// HTMLエスケープ関数
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// HTMLエスケープ解除関数
function unescapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
}

// ランダムID生成
function generateRandomId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ディープコピー関数
function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepCopy(item));
    if (typeof obj === 'object') {
        const copy = {};
        Object.keys(obj).forEach(key => {
            copy[key] = deepCopy(obj[key]);
        });
        return copy;
    }
}

// ファイルサイズのフォーマット
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 日付のフォーマット
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

// JSON ダウンロードヘルパー関数
function downloadJSON(data, filename) {
    try {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        
        // 一時的にDOMに追加してクリック
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // メモリクリーンアップ
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
        
        console.log(`📤 ファイルダウンロード: ${filename}`);
    } catch (error) {
        console.error('ファイルダウンロードエラー:', error);
        throw new Error('ファイルのダウンロードに失敗しました');
    }
}

// ファイル読み込みヘルパー関数
function readJSONFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (error) {
                reject(new Error('JSONファイルの解析に失敗しました'));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('ファイルの読み込みに失敗しました'));
        };
        
        reader.readAsText(file);
    });
}

// ローカルストレージヘルパー
const Storage = {
    // 安全な保存
    setItem(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('LocalStorage保存エラー:', error);
            return false;
        }
    },
    
    // 安全な読み込み
    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('LocalStorage読み込みエラー:', error);
            return defaultValue;
        }
    },
    
    // 削除
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('LocalStorage削除エラー:', error);
            return false;
        }
    },
    
    // ストレージ使用量取得
    getUsage() {
        let total = 0;
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
        } catch (error) {
            console.error('ストレージ使用量計算エラー:', error);
        }
        return total;
    }
};

// アニメーションヘルパー
const Animation = {
    // フェードイン
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = Math.min(progress, 1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // フェードアウト
    fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = initialOpacity * (1 - Math.min(progress, 1));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // スライドダウン
    slideDown(element, duration = 300) {
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.height = (targetHeight * Math.min(progress, 1)) + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        }
        
        requestAnimationFrame(animate);
    }
};

// エラーハンドリングヘルパー
function handleError(error, context = '') {
    console.error(`❌ エラー${context ? ` (${context})` : ''}:`, error);
    
    // ユーザーフレンドリーなエラーメッセージ
    let userMessage = 'エラーが発生しました。';
    
    if (error.message.includes('fetch')) {
        userMessage = '通信エラーが発生しました。インターネット接続を確認してください。';
    } else if (error.message.includes('JSON')) {
        userMessage = 'データの形式が正しくありません。';
    } else if (error.message.includes('Storage')) {
        userMessage = 'データの保存に失敗しました。ブラウザの容量を確認してください。';
    }
    
    if (typeof showNotification === 'function') {
        showNotification(userMessage, 'error');
    } else {
        console.error('❌ Error fallback:', userMessage);
    }
}

// ブラウザ機能チェック
const BrowserSupport = {
    // Web Speech API サポート
    hasSpeechRecognition() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },
    
    // Intersection Observer サポート
    hasIntersectionObserver() {
        return 'IntersectionObserver' in window;
    },
    
    // WebSocket サポート
    hasWebSocket() {
        return 'WebSocket' in window;
    },
    
    // LocalStorage サポート
    hasLocalStorage() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // 全体的なサポート状況
    checkAll() {
        return {
            speechRecognition: this.hasSpeechRecognition(),
            intersectionObserver: this.hasIntersectionObserver(),
            webSocket: this.hasWebSocket(),
            localStorage: this.hasLocalStorage()
        };
    }
};

// ==================================================
// グローバルエクスポート
// ==================================================

// グローバルインスタンス化
window.domOptimizer = new DOMOptimizer();
window.performanceMonitor = new PerformanceMonitor();
// window.timerManager = new TimerManager(); // TimerManagerクラスは未実装のためコメントアウト維持

// MemoryManager のグローバルインスタンス
window.memoryManager = new MemoryManager();

// MemoryManager クラスのグローバルエクスポート
window.MemoryManager = MemoryManager;

// その他ユーティリティ関数のグローバルエクスポート
window.debounce = debounce;
window.throttle = throttle;
window.escapeHtml = escapeHtml;
window.unescapeHtml = unescapeHtml;
window.downloadJSON = downloadJSON;
window.readJSONFile = readJSONFile;
window.Storage = Storage;
window.Animation = Animation;
window.handleError = handleError;
window.BrowserSupport = BrowserSupport;

// utils オブジェクトとして統合エクスポート
window.utils = {
    domOptimizer: window.domOptimizer,
    performanceMonitor: window.performanceMonitor,
    timerManager: window.timerManager, // 未実装のためundefined
    memoryManager: window.memoryManager,
    measureTime: (name, callback) => window.performanceMonitor?.measureTime(name, callback),
    safeSetInterval: (callback, delay) => window.timerManager?.safeSetInterval(callback, delay),
    debounce,
    throttle,
    escapeHtml,
    unescapeHtml,
    downloadJSON,
    readJSONFile,
    Storage,
    Animation,
    handleError,
    BrowserSupport
};