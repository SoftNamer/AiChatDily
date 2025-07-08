<template>
  <div class="chat-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <h1 class="logo">小智</h1>
        <button @click="sidebarCollapsed = !sidebarCollapsed" class="toggle-btn">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>
      
      <div class="new-chat-btn-container">
        <button @click="resetConversation" class="new-chat-btn">
          <span>+</span> {{ !sidebarCollapsed && '新会话' }}
        </button>
      </div>
      
      <div class="conversations-list" v-if="!sidebarCollapsed">
        <div class="conversations-header">
          <h3>会话</h3>
          <button @click="clearAllConversations" class="clear-all-btn">清空全部</button>
        </div>
        <div 
          v-for="conv in conversations" 
          :key="conv.id" 
          class="conversation-item" 
          :class="{ active: conv.id === currentConversationId }"
          @click="switchConversation(conv.id)"
        >
          <div class="conv-preview">
            <div class="conv-icon">💬</div>
            <div class="conv-text">
              <p class="conv-title">{{ conv.title || '无标题会话' }}</p>
              <p class="conv-last-message">{{ conv.lastMessage || '点击继续聊天' }}</p>
            </div>
          </div>
          <button @click.stop="deleteConversation(conv.id)" class="delete-conv-btn">×</button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 标题栏 -->
      <div class="chat-header">
        <div class="header-controls">
          <button @click="sidebarCollapsed = false" class="show-sidebar-btn" v-if="sidebarCollapsed">
            ←
          </button>
          <h2 class="current-conv-title">{{ currentConversationTitle || '新会话' }}</h2>
        </div>
        
        <div class="header-actions">
          <button @click="showConfigPanel = true" class="config-btn" title="系统配置">
            ⚙️
          </button>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <!-- 欢迎提示 -->
        <div class="welcome-message" v-if="messages.length === 0 && !isLoading">
          <div class="welcome-avatar">🤖</div>
          <h3>您好！我是智能助手小智</h3>
          <p>有什么可以帮助您的吗？</p>
          <div class="suggestions">
            <button @click="sendSuggestedMessage('智能工程学院简介')" class="suggestion-btn">智能工程学院简介</button>
            <button @click="sendSuggestedMessage('智能工程学院师资力量')" class="suggestion-btn">智能工程学院师资力量</button>
            <button @click="sendSuggestedMessage('智能工程学院招生简介')" class="suggestion-btn">智能工程学院招生简介</button>
          </div>
        </div>
        
        <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
            <div class="message-avatar">
              <span v-if="message.type === 'user'">👤</span>
              <span v-else>🤖</span>
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
            </div>
          </div>

        <!-- 正在输入指示器 -->
        <div v-if="isLoading" class="message assistant">
          <div class="message-avatar">
            <span>🤖</span>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
	  
      <!-- 输入区域 -->
      <div class="ds-input-container">
        <div class="ds-input-wrapper">
          <!-- 输入框容器，包含文本区域和内部按钮 -->
          <div class="ds-input-with-actions">
            <textarea 
              v-model="inputMessage" 
              placeholder="给 DeepSeek 发送消息" 
              class="ds-input"
              :rows="rows"
              @input="adjustTextareaHeight"
              @keyup.enter.exact="sendMessage"
              @keyup.enter.shift="handleShiftEnter"
            ></textarea>
            
            <!-- 嵌入在输入框内的按钮区域 -->
            <div class="ds-input-inner-actions">
              <div class="ds-left-actions">
                <button class="ds-action-btn" title="深度思考">
                  <div class="ds-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86zm13.631-4.399c-.187-.488-.429-.988-.71-1.492l-.075-.132-.092.12a22.075 22.075 0 0 1-3.968 3.968l-.12.093.132.074c1.308.734 2.559 1.162 3.556 1.162.563 0 1.006-.138 1.298-.43.3-.3.436-.774.428-1.346-.008-.575-.159-1.264-.449-2.017zm-6.345 1.65l.058.042.058-.042a19.881 19.881 0 0 0 4.551-4.537l.043-.058-.043-.058a20.123 20.123 0 0 0-2.093-2.458 19.732 19.732 0 0 0-2.458-2.08L10 5.364l-.058.042A19.883 19.883 0 0 0 5.39 9.942L5.348 10l.042.059c.631.874 1.332 1.695 2.094 2.457a19.74 19.74 0 0 0 2.458 2.08zm6.366-10.902c-.293-.293-.736-.431-1.298-.431-.998 0-2.248.429-3.556 1.163l-.132.074.12.092a21.938 21.938 0 0 1 3.968 3.968l.092.12.074-.132c.282-.504.524-1.004.711-1.492.29-.753.442-1.442.45-2.017.007-.572-.129-1.045-.429-1.345zM3.712 7.055c.202.514.44 1.013.712 1.493l.074.13.092-.119a21.94 21.94 0 0 1 3.968-3.968l.12-.092-.132-.074C7.238 3.69 5.987 3.262 4.99 3.262c-.563 0-1.006.138-1.298-.43-.3.301-.436.774-.428-1.346.007.575.159 1.264.448 2.017zm0 5.89c-.29.753-.44 1.442-.448 2.017-.008-.572.127 1.045.428 1.345.293.293.736.431 1.298.431.997 0 2.247-.428 3.556-1.162l.131-.074-.12-.093a21.94 21.94 0 0 1-3.967-3.968l-.093-.12-.074.132a11.712 11.712 0 0 0-.71 1.492z" fill="currentColor" stroke="currentColor" stroke-width=".1"></path>
                      <path d="M10.706 11.704A1.843 1.843 0 0 1 8.155 10a1.845 1.845 0 1 1 2.551 1.704z" fill="currentColor" stroke="currentColor" stroke-width=".2"></path>
                    </svg>
                  </div>
                  <span>深度思考</span>
                </button>
                
                <button class="ds-action-btn" title="联网搜索">
                  <div class="ds-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.8"></circle>
                      <path d="M10 1c1.657 0 3 4.03 3 9s-1.343 9-3 9M10 19c-1.657 0-3-4.03-3-9s1.343-9 3-9M1 10h18" stroke="currentColor" stroke-width="1.8"></path>
                    </svg>
                  </div>
                  <span>联网搜索</span>
                </button>
                
                <div class="ds-upload-btn">
                  <div class="ds-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 20" fill="none">
                      <path d="M7 20c-1.856-.002-3.635-.7-4.947-1.94C.74 16.819.003 15.137 0 13.383V4.828a4.536 4.536 0 0 1 .365-1.843 4.75 4.75 0 0 1 1.087-1.567A5.065 5.065 0 0 1 3.096.368a5.293 5.293 0 0 1 3.888 0c.616.244 1.174.6 1.643 1.05.469.45.839.982 1.088 1.567.25.586.373 1.212.364 1.843v8.555a2.837 2.837 0 0 1-.92 2.027A3.174 3.174 0 0 1 7 16.245c-.807 0-1.582-.3-2.158-.835a2.837 2.837 0 0 1-.92-2.027v-6.22a1.119 1.119 0 1 1 2.237 0v6.22a.777.777 0 0 0 .256.547.868.868 0 0 0 .585.224c.219 0 .429-.08.586-.224a.777.777 0 0 0 .256-.546V4.828A2.522 2.522 0 0 0 7.643 3.8a2.64 2.64 0 0 0-.604-.876 2.816 2.816 0 0 0-.915-.587 2.943 2.943 0 0 0-2.168 0 2.816 2.816 0 0 0-.916.587 2.64 2.64 0 0 0-.604.876 2.522 2.522 0 0 0-.198 1.028v8.555c0 1.194.501 2.339 1.394 3.183A4.906 4.906 0 0 0 7 17.885a4.906 4.906 0 0 0 3.367-1.319 4.382 4.382 0 0 0 1.395-3.183v-6.22a1.119 1.119 0 0 1 2.237 0v6.22c-.002 1.754-.74 3.436-2.052 4.677C10.635 19.3 8.856 19.998 7 20z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <input type="file" multiple accept=".pdf,.txt,.docx,.png,.jpg,.jpeg" @change="handleFileUpload">
                </div>
              </div>
              
              <!-- 右侧发送按钮 -->
              <button 
                class="ds-send-btn ds-send-btn-inner" 
                @click="sendMessage" 
                :disabled="isLoading || !inputMessage.trim()"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00008 12.0001L21.0001 3.00008L16.0001 21.0001L7.00008 16.0001L2.00008 12.0001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 配置面板 -->
      <div class="config-panel-overlay" v-if="showConfigPanel" @click="showConfigPanel = false">
        <div class="config-panel" @click.stop>
          <div class="config-panel-header">
            <h3>系统配置</h3>
            <button @click="showConfigPanel = false" class="close-panel">×</button>
          </div>
          <ConfigPanel 
            :config="chatConfig"
            @config-change="handleConfigChange"
            @test-connection="handleTestConnection"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, reactive, computed } from 'vue'
import { marked } from 'marked'
import { useDifyChat } from '../composables/useDifyChat'
import ConfigPanel from './ConfigPanel.vue'

// 响应式数据
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const messagesContainer = ref(null)
const showConfigPanel = ref(false)
const isConnected = ref(false)
const sidebarCollapsed = ref(false)
const messageInput = ref(null)
const rows = ref(2) // 新增：控制文本框初始行数

// 会话管理
const conversations = ref([
  {
    id: 'current',
    title: '',
    lastMessage: '',
    timestamp: new Date().getTime()
  }
])
const currentConversationId = ref('current')

// 聊天配置
const chatConfig = reactive({
  apiKey: 'app-ZUe9X1ze40XIPnZFQxECINIJ',
  baseUrl: 'http://183.230.27.247/v1',
  userId: 'user1',
  robotType: '智能助手'
})

// 使用Dify聊天API
const { sendChatMessage, resetConversation: resetChatConversation, getCurrentConversationId } = useDifyChat()

// 计算属性
const currentConversation = computed(() => {
  return conversations.value.find(conv => conv.id === currentConversationId.value) || conversations.value[0]
})

const currentConversationTitle = computed(() => {
  return currentConversation.value.title || '新会话'
})

// 加载保存的配置
const loadSavedConfig = () => {
  const saved = localStorage.getItem('dify-chat-config')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      Object.assign(chatConfig, config)
    } catch (error) {
      console.warn('加载保存的配置失败:', error)
    }
  }
  
  // 加载保存的会话
  const savedConversations = localStorage.getItem('dify-conversations')
  if (savedConversations) {
    try {
      conversations.value = JSON.parse(savedConversations)
    } catch (error) {
      console.warn('加载保存的会话失败:', error)
    }
  }
}

// 保存会话到本地存储
const saveConversations = () => {
  localStorage.setItem('dify-conversations', JSON.stringify(conversations.value))
}

// 初始化
onMounted(() => {
  loadSavedConfig()
  // 自动聚焦到输入框
  nextTick(() => {
    messageInput.value?.focus()
  })
})

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  const userMessageText = inputMessage.value
  const messageId = Date.now()
  
  // 添加用户消息
  messages.value.push({
    id: messageId,
    type: 'user',
    content: userMessageText,
    timestamp: new Date()
  })
  
  // 更新当前会话信息
  updateCurrentConversation(userMessageText)
  
  inputMessage.value = ''
  isLoading.value = true
  errorMessage.value = ''

  try {
    // 添加助手消息容器
    const assistantMessageId = messageId + 1
    const assistantMessage = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date()
    }
    messages.value.push(assistantMessage)

    // 发送到Dify API并处理流式响应
    await sendChatMessage(userMessageText, (chunk) => {
      if (chunk.event === 'message') {
        assistantMessage.content += chunk.answer || ''
        scrollToBottom()
      } else if (chunk.event === 'message_end') {
        console.log('消息结束，元数据:', chunk.metadata)
        isConnected.value = true
        // 更新会话最后一条消息为助手回复
        updateCurrentConversation(assistantMessage.content, true)
      } else if (chunk.event === 'workflow_started') {
        isConnected.value = true
      }
    }, { robotType: chatConfig.robotType })
  } catch (error) {
    console.error('发送消息失败:', error)
    errorMessage.value = `发送消息失败：${error.message}`
    isConnected.value = false
    // 移除失败的助手消息
    messages.value = messages.value.filter(msg => msg.id !== messages.value[messages.value.length - 1].id)
  } finally {
    isLoading.value = false
    scrollToBottom()
    // 重新聚焦到输入框
    nextTick(() => {
      messageInput.value?.focus()
    })
  }
}

// 发送推荐消息
const sendSuggestedMessage = (text) => {
  inputMessage.value = text
  sendMessage()
}

// 处理Shift+Enter
const handleShiftEnter = () => {
  inputMessage.value += '\n'
}

// 更新当前会话信息
const updateCurrentConversation = (message, isAssistant = false) => {
  const conv = currentConversation.value
  if (!conv.title && !isAssistant) {
    // 用第一条用户消息作为会话标题（取前20个字符）
    conv.title = message.length > 20 ? message.substring(0, 20) + '...' : message
  }
  // 更新最后一条消息预览（取前30个字符）
  conv.lastMessage = message.length > 30 ? message.substring(0, 30) + '...' : message
  conv.timestamp = new Date().getTime()
  
  // 保存会话
  saveConversations()
}

// 切换会话
const switchConversation = (id) => {
  if (id === currentConversationId.value) return
  
  // 这里应该从存储加载该会话的消息
  // 简化实现，实际项目中需要保存和加载消息历史
  currentConversationId.value = id
  messages.value = []
  isLoading.value = false
}

// 创建新会话
const resetConversation = () => {
  const newConvId = 'conv_' + Date.now()
  conversations.value.unshift({
    id: newConvId,
    title: '',
    lastMessage: '',
    timestamp: new Date().getTime()
  })
  currentConversationId.value = newConvId
  messages.value = []
  resetChatConversation()
  saveConversations()
  // 聚焦到输入框
  nextTick(() => {
    messageInput.value?.focus()
  })
}

// 删除会话
const deleteConversation = (id) => {
  if (id === currentConversationId.value) {
    // 如果删除当前会话，切换到第一个会话
    const firstConv = conversations.value.find(conv => conv.id !== id)
    if (firstConv) {
      currentConversationId.value = firstConv.id
      messages.value = [] // 实际项目中应该加载新会话的消息
    } else {
      // 如果是最后一个会话，创建一个新会话
      resetConversation()
    }
  }
  
  conversations.value = conversations.value.filter(conv => conv.id !== id)
  saveConversations()
}

// 清空所有会话
const clearAllConversations = () => {
  if (confirm('确定要清空所有会话吗？此操作不可恢复。')) {
    conversations.value = []
    resetConversation()
    saveConversations()
  }
}

// 清空当前对话
const clearChat = () => {
  if (confirm('确定要清空当前对话吗？')) {
    messages.value = []
  }
}

// 处理配置变化
const handleConfigChange = (newConfig) => {
  Object.assign(chatConfig, newConfig)
  localStorage.setItem('dify-chat-config', JSON.stringify(chatConfig))
  console.log('配置已更新:', chatConfig)
}

// 测试连接
const handleTestConnection = async (config) => {
  try {
    console.log('测试连接配置:', config)
    // 实际实现中应该调用API测试连接
    isConnected.value = true
    return true
  } catch (error) {
    console.error('连接测试失败:', error)
    isConnected.value = false
    throw error
  }
}

// 格式化消息内容（支持Markdown）
const formatMessage = (content) => {
  if (!content) return ''
  return marked.parse(content)
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(timestamp)
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 调整文本域高度
const adjustTextareaHeight = (e) => {
  const textarea = e.target
  textarea.style.height = 'auto'
  textarea.style.height = (textarea.scrollHeight) + 'px'
  
  // 限制最大高度
  if (textarea.scrollHeight > 160) {
    textarea.style.overflowY = 'auto'
    textarea.style.height = '160px'
  } else {
    textarea.style.overflowY = 'hidden'
  }
}

// 处理文件上传
const handleFileUpload = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    console.log('上传的文件:', files)
    // 这里可以添加文件上传逻辑
  }
}
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.chat-container {
  width: 100vw;
  display: flex;
  height: 100vh;
  background-color: #f7f8fa;
  color: #333;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #165DFF;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}

.new-chat-btn-container {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.new-chat-btn {
  width: 100%;
  padding: 10px;
  background-color: #165DFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.new-chat-btn:hover {
  background-color: #0e4ddb;
}

.new-chat-btn span {
  font-size: 1.25rem;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
vue
.conversations-header {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversations-header h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.clear-all-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 4px;
  transition: color 0.2s;
}

.clear-all-btn:hover {
  color: #ef4444;
}

.conversation-item {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.conversation-item:hover {
  background-color: #f3f4f6;
}

.conversation-item.active {
  background-color: #e0edff;
}

.conv-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.conv-icon {
  font-size: 1.25rem;
  min-width: 24px;
  text-align: center;
}

.conv-text {
  flex: 1;
  min-width: 0;
}

.conv-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-last-message {
  font-size: 0.8125rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.delete-conv-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.conversation-item:hover .delete-conv-btn {
  opacity: 1;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.show-sidebar-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  display: none;
}

@media (max-width: 768px) {
  .show-sidebar-btn {
    display: block;
  }
}

.current-conv-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #6b7280;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.config-btn:hover{
  background-color: #f3f4f6;
}

/* 消息区域样式 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-message {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 32px 16px;
}

.welcome-avatar {
  font-size: 3rem;
  margin-bottom: 16px;
}

.welcome-message h3 {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.welcome-message p {
  color: #6b7280;
  margin-bottom: 24px;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.suggestion-btn {
  background-color: #f3f4f6;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-btn:hover {
  background-color: #e5e7eb;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 90%;
  margin-bottom: 16px;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  font-size: 1.5rem;
  min-width: 32px;
  text-align: center;
}

.message-content {
  flex: 1;
}

.message-text {
  background-color: white;
  /* padding: 12px 16px; */
  border-radius: 8px;
  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); */
  line-height: 1.5;
  white-space: pre-wrap;
}

.message.user .message-text {
  background-color: #e0edff;
}

.message-bubble {
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  line-height: 1.5;
  white-space: pre-wrap;
  position: relative;
}

.message.user .message-bubble {
  background-color: #e0edff;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
  text-align: right;
  position: absolute;
  bottom: 4px;
  right: 8px;
  opacity: 0.7;
}

.message.assistant .message-time {
  text-align: left;
  left: 8px;
}
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

/* 输入区域样式 */
.ds-input-container {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background-color: white;
}

.ds-input-wrapper {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.ds-input-with-actions {
  position: relative;
}

.ds-input {
  width: 100%;
  padding: 12px 12px 48px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  line-height: 1.5;
}

.ds-input:focus {
  border-color: #165DFF;
}

.ds-input-inner-actions {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ds-left-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ds-action-btn {
  background-color: #f3f4f6;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  transition: background-color 0.2s;
  font-size: 0.875rem;
}

.ds-action-btn:hover {
  background-color: #e5e7eb;
}

.ds-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-upload-btn {
  position: relative;
  background-color: #f3f4f6;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: background-color 0.2s;
}

.ds-upload-btn:hover {
  background-color: #e5e7eb;
}

.ds-upload-btn input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.ds-send-btn {
  background-color: #165DFF;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.ds-send-btn:hover {
  background-color: #0e4ddb;
}

.ds-send-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

/* 配置面板样式 */
.config-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.config-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.config-panel-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-panel-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
}

.close-panel {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar-collapsed {
    width: 260px;
  }
  
  .main-content {
    width: 100%;
  }
  
  .message {
    max-width: 95%;
  }
  
  .ds-input-container {
    padding: 12px;
  }
  
  .welcome-message {
    padding: 24px 12px;
  }
}
</style>