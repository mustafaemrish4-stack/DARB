<?php
/**
 * Plugin Name: Solvica Premium AI
 * Plugin URI: https://solvica.com
 * Description: المساعد التعليمي الذكي (Solvica) بتصميم عصري واحترافي.
 * Version: 4.0.0
 * Author: مصطفى
 * Author URI: https://solvica.com
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function solvica_ai_enqueue_assets() {
    wp_enqueue_style( 'solvica-ai-style', plugin_dir_url( __FILE__ ) . 'assets/style.css', array(), '4.0.0' );
    wp_enqueue_script( 'solvica-ai-script', plugin_dir_url( __FILE__ ) . 'assets/script.js', array('jquery'), '4.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'solvica_ai_enqueue_assets' );

function solvica_ai_render_widget() {
    ?>
    <div id="solvica-widget-container">
        <button id="solvica-trigger-btn">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="solvica-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span class="solvica-tooltip">Solvica AI</span>
        </button>
        <div id="solvica-chat-box" class="solvica-hidden">
            <div class="solvica-header">
                <div class="solvica-header-info">
                    <div class="solvica-bot-avatar">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    </div>
                    <div>
                        <span class="solvica-bot-name">Solvica AI <span class="badge">PRO</span></span>
                        <span class="solvica-status">متصل بشبكة الرؤية الذكية | مصمم: مصطفى</span>
                    </div>
                </div>
                <button id="solvica-close-btn">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            
            <div id="solvica-chat-history">
                <div class="solvica-message bot-msg">
                    <div class="msg-bubble">مرحباً! أنا <strong>Solvica AI</strong>. أنا قادر الآن على قراءة محتوى الصور، وفهم الملفات النصية، والبحث في الإنترنت بدقة مرعبة! هل لديك أي ملف أو صورة لأحللها؟</div>
                </div>
            </div>
            
            <div id="solvica-attachment-preview" class="solvica-hidden">
                <div class="preview-wrapper">
                    <img id="solvica-preview-img" src="" alt="preview" style="display:none;">
                    <div id="solvica-file-info" style="display:none; color:#e2e8f0; font-size:12px; margin-top:5px; word-break: break-all;"></div>
                    <button id="solvica-remove-attachment">&times;</button>
                </div>
            </div>

            <div class="solvica-input-area">
                <label for="solvica-file-upload" class="solvica-action-btn" title="إرفاق صورة أو ملف">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                </label>
                <input type="file" id="solvica-file-upload" accept="image/*,.txt,.csv,.json,.md,.js,.html,.css,.php">
                
                <button id="solvica-mic-btn" class="solvica-action-btn" title="التحدث بالصوت">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>

                <input type="text" id="solvica-user-input" placeholder="اسأل واطلب قراءة الملفات..." autocomplete="off">
                <label class="solvica-agent-toggle" title="تفعيل وضع الوكيل الذكي (البحث في الإنترنت)">
                    <input type="checkbox" id="solvica-agent-mode">
                    <span class="agent-icon">🧠</span>
                </label>
                
                <button id="solvica-send-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    </div>
    <?php
}
add_action( 'wp_footer', 'solvica_ai_render_widget' );
?>
