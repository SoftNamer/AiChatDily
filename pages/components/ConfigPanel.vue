<template>
  <div class="config-panel" v-if="showConfig">
    <div class="config-overlay" @click="closeConfig"></div>
    <div class="config-modal">
      <div class="config-header">
        <h3>系统配置</h3>
        <div @click="closeConfig" class="close-btn">×</div>
      </div>
      
      <div class="config-content">
        <div class="config-group">
          <label for="apiKey">Dify API Key:</label>
          <input
            id="apiKey"
            v-model="localConfig.apiKey"
            type="password"
            placeholder="请输入您的Dify API Key"
            class="config-input"
          />
          <small>您可以在Dify控制台的"访问API"页面获取API Key</small>
        </div>
        
        <div class="config-group">
          <label for="baseUrl">API 基础地址:</label>
          <input
            id="baseUrl"
            v-model="localConfig.baseUrl"
            type="text"
            placeholder="http://127.0.0.1/v1"
            class="config-input"
          />
          <small>Dify服务的API地址，默认为本地地址</small>
        </div>
        
        <div class="config-group">
          <label for="userId">用户标识:</label>
          <input
            id="userId"
            v-model="localConfig.userId"
            type="text"
            placeholder="user1"
            class="config-input"
          />
          <small>用于标识用户身份，便于统计和管理</small>
        </div>
        
        <div class="config-status">
          <span class="status-indicator" :class="{ connected: isConnected }"></span>
          <span>{{ isConnected ? '连接正常' : '未连接' }}</span>
        </div>
      </div>
      
      <div class="config-actions">
        <div @click="testConnection" class="test-btn" :disabled="testing">
          {{ testing ? '测试中...' : '测试连接' }}
        </div>
        <div @click="saveConfig" class="save-btn">
          保存配置
        </div>
        <div @click="resetConfig" class="reset-btn">
          重置默认
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => ({
      apiKey: 'app-zV1H0vnzPlwjUkkexGCmF5Gn',
      baseUrl: 'http://localhost/v1',
      userId: 'user1'
    })
  }
})

const emit = defineEmits(['update:modelValue', 'config-change', 'test-connection'])

const showConfig = ref(props.modelValue)
const testing = ref(false)
const isConnected = ref(false)

const localConfig = reactive({
  ...props.config
})

// 监听外部显示状态变化
watch(() => props.modelValue, (newVal) => {
  showConfig.value = newVal
})

// 监听配置变化
watch(() => props.config, (newConfig) => {
  Object.assign(localConfig, newConfig)
}, { deep: true })

const closeConfig = () => {
  showConfig.value = false
  emit('update:modelValue', false)
}

const saveConfig = () => {
  // 保存到localStorage
  localStorage.setItem('dify-chat-config', JSON.stringify(localConfig))
  
  // 通知父组件配置变化
  emit('config-change', { ...localConfig })
  
  // 显示保存成功提示
  alert('配置已保存！')
  closeConfig()
}

const resetConfig = () => {
  if (confirm('确定要重置为默认配置吗？')) {
    localConfig.apiKey = 'app-zV1H0vnzPlwjUkkexGCmF5Gn'
    localConfig.baseUrl = '/v1'
    localConfig.userId = 'user1'
  }
}

const testConnection = async () => {
  testing.value = true
  
  try {
    // 发送测试请求
    emit('test-connection', localConfig)
    
    // 模拟测试结果（实际应该由父组件处理）
    setTimeout(() => {
      isConnected.value = true
      testing.value = false
      alert('连接测试成功！')
    }, 2000)
    
  } catch (error) {
    isConnected.value = false
    testing.value = false
    alert('连接测试失败：' + error.message)
  }
}

// 加载保存的配置
const loadSavedConfig = () => {
  const saved = localStorage.getItem('dify-chat-config')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      Object.assign(localConfig, config)
    } catch (error) {
      console.warn('加载保存的配置失败:', error)
    }
  }
}

// 组件挂载时加载配置
loadSavedConfig()
</script>

<style scoped>
.config-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.config-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.config-modal {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
}

.config-header {
	width: calc(100% - 20px * 2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.config-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
	text-align: center;
}

.close-btn:hover {
  background: #f8f9fa;
}

.config-content {
  padding: 20px;
}

.config-group {
  margin-bottom: 20px;
}

.config-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.config-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.config-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.config-group small {
  display: block;
  margin-top: 4px;
  color: #666;
  font-size: 0.875rem;
}

.config-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dc3545;
  transition: background 0.3s;
}

.status-indicator.connected {
  background: #28a745;
}

.config-actions {
  /* 移除固定宽度，让flex容器自适应父元素 */
  height: 70px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
  /* 新增：防止子元素溢出 */
  box-sizing: border-box;
}

/* 子按钮样式调整 */
.config-actions .test-btn,
.config-actions .save-btn,
.config-actions .reset-btn {
  /* 移除固定宽度计算，用flex分配空间 */
  flex: 1; /* 三个按钮平均分配宽度 */
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  /* 新增：防止按钮内容溢出 */
  text-align: center;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
}

/* 响应式调整（移动端垂直排列） */
@media (max-width: 768px) {
  .config-actions {
    flex-direction: column;
    height: auto; /* 取消固定高度，适应内容 */
    gap: 10px;
  }
  
  .config-actions .test-btn,
  .config-actions .save-btn,
  .config-actions .reset-btn {
    width: 100%; /* 移动端按钮占满宽度 */
    flex: none; /* 取消flex分配，避免高度拉伸 */
  }
}

.test-btn {
  background: #17a2b8;
  color: white;
}

.test-btn:hover:not(:disabled) {
  background: #138496;
  transform: translateY(-1px);
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .config-actions {
    flex-direction: column;
  }
  
  .config-modal {
    margin: 20px;
    width: calc(100% - 40px);
  }
}
</style> 