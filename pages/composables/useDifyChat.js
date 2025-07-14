import { ref } from 'vue'

// Dify API配置
// 本地Ollama
// const API_BASE_URL = 'http://localhost/v1'
// const API_KEY = 'app-orlLU9Qb0tU7wcShLvpPA9qI' // 从app.md获取的API KEY

// const API_BASE_URL = 'http://183.230.27.247/v1'
// const API_KEY = 'app-ZUe9X1ze40XIPnZFQxECINIJ' // 从app.md获取的API KEY

// 正式通义千问
const API_BASE_URL = 'http://ai.yuhwyuan.com/v1'
const API_KEY = 'app-d2uMe8sjDNr1UrPKWMJk6pph'


export function useDifyChat() {
  const conversationId = ref('')
  conversationId.value = JSON.parse(localStorage.getItem('yy_conversation_id'))
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
        user: options.user || 'abc-123',
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
				localStorage.setItem('yy_conversation_id', JSON.stringify(conversationId.value))
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

      // 请求参数（拼接在 URL 上，GET 方法）
        const params = {
          user: 'abc-123',
          last_id: '',
          limit: pageSize
        };
      
        // 请求头（包含 Authorization）
        const header = {
          'Authorization': `Bearer ${API_KEY}`, // 替换为你的实际 api_key
          'Content-Type': 'application/json' // GET 方法可省略，但建议带上
        };
      
        // 发起 GET 请求
        uni.request({
          url: `${API_BASE_URL}/conversations`,
          method: 'GET',
          data: params, // GET 方法中，data 会自动拼接到 URL 上（?user=xxx&last_id=...）
          header: header,
          success: (res) => {
            // 请求成功回调
            console.log('接口返回数据：', res.data);
            // 处理返回结果（如更新页面数据）
            // this.conversations = res.data.data;
			return res.data
          },
          fail: (err) => {
            // 请求失败回调（如网络错误、跨域未解决等）
            console.error('请求失败：', err);
            uni.showToast({
              title: '请求失败，请稍后重试',
              icon: 'none'
            });
          },
          complete: () => {
            // 无论成功失败都会执行（如关闭加载动画）
            // uni.hideLoading();
          }
        });
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
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json' // 添加Content-Type头
        },
        body: JSON.stringify({ user: "abc-123" }) // 添加user参数
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
   * 重置会话
   */
  const resetConversation = () => {
    conversationId.value = ''
	localStorage.removeItem('yy_conversation_id')
    isConnected.value = false
    controller.value = null
    console.log('会话已重置')
  }

  /**
   * 获取当前会话ID
   */
  const getCurrentConversationId = () => {
	conversationId.value = JSON.parse(localStorage.getItem('yy_conversation_id'))
    return conversationId.value
  }

  return {
    sendChatMessage,
    stopResponse,
    getConversationHistory,
    getConversationList,
    deleteConversation,
    resetConversation,
    getCurrentConversationId,
    conversationId,
    isConnected
  }
}  