import { ref } from 'vue'

// Dify API配置
const API_BASE_URL = 'http://localhost/v1'
const API_KEY = 'app-orlLU9Qb0tU7wcShLvpPA9qI' // 从app.md获取的API KEY

// const API_BASE_URL = 'http://183.230.27.247/v1'
// const API_KEY = 'app-ZUe9X1ze40XIPnZFQxECINIJ' // 从app.md获取的API KEY

export function useDifyChat() {
  const conversationId = ref('')
  const isConnected = ref(false)
  const controller = ref(null)

  /**
   * 发送聊天消息到Dify API
   * @param {string} query - 用户输入的查询
   * @param {function} onMessage - 处理流式消息的回调函数
   * @param {object} options - 可选配置
   */
  const sendChatMessage = async (query, onMessage, options = {}) => {
    controller.value = new AbortController()
    
    try {
      const requestBody = {
        query,
        response_mode: 'streaming',
        conversation_id: conversationId.value,
        user: options.user || 'user1',
        inputs: options.inputs || {},
        files: options.files || [],
        auto_generate_name: options.auto_generate_name !== false
      }

      console.log('发送请求到Dify API:', requestBody)

      const response = await fetch(`${API_BASE_URL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.value.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      isConnected.value = true

      // 处理流式响应
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          console.log('流式响应结束')
          break
        }

        // 解码数据块
        const chunk = decoder.decode(value, { stream: true })
        
        // 处理多个数据行
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.trim() === '') continue
          
          // 解析Server-Sent Events格式
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6) // 移除 "data: " 前缀
            try {
              
              // 跳过非JSON数据（如ping事件）
              if (jsonStr.trim() === '' || jsonStr.includes('[DONE]')) {
                continue
              }

              const data = JSON.parse(jsonStr)
              // console.log('收到数据块:', data)

              // 更新conversation_id
              if (data.conversation_id && !conversationId.value) {
                conversationId.value = data.conversation_id
                console.log('设置conversation_id:', conversationId.value)
              }

              // 调用消息处理回调
              if (onMessage && typeof onMessage === 'function') {
                onMessage(data)
              }

              // 处理不同类型的事件
              switch (data.event) {
                case 'workflow_started':
                  console.log('工作流开始:', data.data)
                  break
                
                case 'node_started':
                  console.log('节点开始执行:', data.data.title)
                  break
                
                case 'node_finished':
                  console.log('节点执行完成:', data.data.title, data.data.status)
                  break
                
                case 'workflow_finished':
                  console.log('工作流完成:', data.data.status)
                  break
                
                case 'message':
                  // 流式文本消息
                  break
                
                case 'message_end':
                  console.log('消息结束，使用情况:', data.metadata?.usage)
                  break
                
                case 'error':
                  console.error('收到错误事件:', data)
                  throw new Error(data.message || '未知错误')
                
                default:
                  console.log('未处理的事件类型:', data.event)
              }

            } catch (parseError) {
              console.warn('解析数据块失败:', parseError, '原始数据:', jsonStr)
            }
          }
        }
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求被取消')
      } else {
        console.error('发送聊天消息失败:', error)
        throw error
      }
    } finally {
      isConnected.value = false
    }
  }

  /**
   * 上传文件到Dify
   * @param {File} file - 要上传的文件
   * @param {string} purpose - 文件用途 (assistant, user)
   * @returns {Promise<Object>} - 包含文件信息的响应
   */
  const uploadFile = async (file, purpose = 'user') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('purpose', purpose)

      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`文件上传失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('上传文件失败:', error)
      throw error
    }
  }

  /**
   * 停止当前流式响应
   */
  const stopResponse = () => {
    if (controller.value) {
      controller.value.abort()
      isConnected.value = false
      console.log('已停止响应')
    }
  }

  /**
   * 发送消息反馈(点赞/踩)
   * @param {string} messageId - 消息ID
   * @param {string} feedbackType - 反馈类型 (upvote/downvote)
   * @returns {Promise<Object>} - 反馈结果
   */
  const sendMessageFeedback = async (messageId, feedbackType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ type: feedbackType })
      })

      if (!response.ok) {
        throw new Error(`发送反馈失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('发送消息反馈失败:', error)
      throw error
    }
  }

  /**
   * 获取下一轮建议问题列表
   * @returns {Promise<Array>} - 建议问题列表
   */
  const getSuggestedQuestions = async () => {
    if (!conversationId.value) {
      throw new Error('没有活动的会话')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId.value}/suggested-questions`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error(`获取建议问题失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取建议问题失败:', error)
      throw error
    }
  }

  /**
   * 获取会话历史消息
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @returns {Promise<Object>} - 会话历史消息
   */
  const getConversationHistory = async (page = 1, pageSize = 20) => {
    if (!conversationId.value) {
      throw new Error('没有活动的会话')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId.value}/messages?page=${page}&page_size=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error(`获取会话历史失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取会话历史失败:', error)
      throw error
    }
  }

  /**
   * 获取会话列表
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @returns {Promise<Object>} - 会话列表
   */
  const getConversationList = async (page = 1, pageSize = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations?page=${page}&page_size=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error(`获取会话列表失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取会话列表失败:', error)
      throw error
    }
  }

  /**
   * 删除会话
   * @param {string} id - 会话ID
   * @returns {Promise<void>}
   */
  const deleteConversation = async (id = conversationId.value) => {
    if (!id) {
      throw new Error('没有指定会话ID')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error(`删除会话失败: ${response.status}`)
      }

      if (id === conversationId.value) {
        resetConversation()
      }

      console.log('会话已删除')
    } catch (error) {
      console.error('删除会话失败:', error)
      throw error
    }
  }

  /**
   * 重命名会话
   * @param {string} name - 新会话名称
   * @param {string} id - 会话ID
   * @returns {Promise<Object>} - 更新后的会话信息
   */
  const renameConversation = async (name, id = conversationId.value) => {
    if (!id) {
      throw new Error('没有指定会话ID')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ name })
      })

      if (!response.ok) {
        throw new Error(`重命名会话失败: ${response.status}`)
      }

      console.log('会话已重命名为:', name)
      return await response.json()
    } catch (error) {
      console.error('重命名会话失败:', error)
      throw error
    }
  }

  /**
   * 语音转文字
   * @param {File} audioFile - 音频文件
   * @param {string} language - 语言代码 (如: zh-CN, en-US)
   * @returns {Promise<string>} - 转换后的文本
   */
  const speechToText = async (audioFile, language = 'zh-CN') => {
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('language', language)

      const response = await fetch(`${API_BASE_URL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`语音转文字失败: ${response.status}`)
      }

      const result = await response.json()
      return result.text
    } catch (error) {
      console.error('语音转文字失败:', error)
      throw error
    }
  }

  /**
   * 文字转语音
   * @param {string} text - 要转换的文本
   * @param {string} voice - 语音类型
   * @returns {Promise<Blob>} - 语音音频Blob
   */
  const textToSpeech = async (text, voice = 'female') => {
    try {
      const response = await fetch(`${API_BASE_URL}/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          text,
          voice
        })
      })

      if (!response.ok) {
        throw new Error(`文字转语音失败: ${response.status}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('文字转语音失败:', error)
      throw error
    }
  }

  /**
   * 重置会话
   */
  const resetConversation = () => {
    conversationId.value = ''
    isConnected.value = false
    controller.value = null
    console.log('会话已重置')
  }

  /**
   * 获取当前会话ID
   */
  const getCurrentConversationId = () => {
    return conversationId.value
  }

  return {
    sendChatMessage,
    uploadFile,
    stopResponse,
    sendMessageFeedback,
    getSuggestedQuestions,
    getConversationHistory,
    getConversationList,
    deleteConversation,
    renameConversation,
    speechToText,
    textToSpeech,
    resetConversation,
    getCurrentConversationId,
    conversationId,
    isConnected
  }
}  