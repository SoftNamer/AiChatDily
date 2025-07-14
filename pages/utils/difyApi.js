import {
	ref,
	reactive,
	toRefs
} from 'vue'


/**
 * Dify API 配置
 */
const DIFY_CONFIG = {
	// 默认使用正式环境
	environments: {
		local: {
			baseUrl: 'http://localhost/v1',
			apiKey: 'app-orlLU9Qb0tU7wcShLvpPA9qI'
		},
		test: {
			baseUrl: 'http://183.230.27.247/v1',
			apiKey: 'app-ZUe9X1ze40XIPnZFQxECINIJ'
		},
		production: {
			baseUrl: 'http://ai.yuhwyuan.com/v1',
			apiKey: 'app-d2uMe8sjDNr1UrPKWMJk6pph'
		}
	},
	currentEnv: 'production'
}

/**
 * 设置API环境
 * @param {string} env - 环境名称: 'local', 'test', 'production'
 */
export function setDifyEnvironment(env) {
	if (DIFY_CONFIG.environments[env]) {
		DIFY_CONFIG.currentEnv = env
		console.log(`Dify API环境已设置为: ${env}`)
	} else {
		console.warn(`无效的环境名称: ${env}，使用默认环境: production`)
	}
}

/**
 * 获取当前API配置
 */
function getApiConfig() {
	return DIFY_CONFIG.environments[DIFY_CONFIG.currentEnv]
}

/**
 * 创建API请求实例
 */
function createApiClient() {
	const config = getApiConfig()

	/**
	 * 发送HTTP请求
	 * @param {string} url - 请求URL
	 * @param {object} options - 请求选项
	 */
	async function request(url, options = {}) {
		try {
			const fullUrl = `${config.baseUrl}/${url}`
			const headers = {
				// 'Content-Type': 'application/json',
				'Authorization': `Bearer ${config.apiKey}`,
				...options.headers
			}
			console.log(`[Dify API] 请求: ${options.method || 'GET'} ${fullUrl}`)
			const response = await fetch(fullUrl, {
				...options,
				headers
			})
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorData.message || ''}`)
			}
			return response
		} catch (error) {
			console.error('[Dify API] 请求错误:', error)
			throw error
		}
	}

	return {
		get: (url, options) => request(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			...options
		}),
		post: (url, data, options) => request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			...options
		}),
		delete: (url, data, options) => request(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			...options
		}),
		upload: (url, formData, options) => request(url, {
		    method: 'POST',
		    body: formData,
		    // headers: {
		    //   'Content-Type': 'multipart/form-data'
		    // },
		    ...options
		})
	}
}

// 获取设备唯一标识（App平台）
function getDeviceId() {
  if (uni.getSystemInfoSync().platform === 'app') {
    // 需在真机或模拟器中运行
    return plus.device.uuid;
  }
  return getMixedId(); // 非App平台返回null
}

// 生成混合唯一标识
function getMixedId() {
  const { platform, model, system, version } = uni.getSystemInfoSync();
  const timeStamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 8);
  
  // 拼接设备信息和随机字符串
  return `${platform}_${model.replace(/\s/g, '_')}_${timeStamp}_${randomStr}`;
}

/**
 * 生成并存储浏览器唯一标识
 * @returns {string} 唯一标识
 */
function getBrowserUniqueId() {
  try {
    // 尝试读取已存储的 ID
    const storedId = uni.getStorageSync('browser_unique_id');
    if (storedId) return storedId;
    
    // 生成新的 UUID v4（基于时间戳和随机数）
    const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    // 存储到 localStorage
    uni.setStorageSync('browser_unique_id', newId);
    return newId;
  } catch (error) {
    // 处理 localStorage 不可用的情况（如隐私模式）
    console.warn('无法使用 localStorage，将生成临时 ID:', error);
    return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

/**
 * Dify聊天服务
 */
export function useDifyChat() {
	let uid = ""
	let conversationId = ""
	let browser_unique_id = localStorage.getItem('browser_unique_id')
	if(browser_unique_id){
		uid = browser_unique_id
	}else{
		uid = getBrowserUniqueId()
	}

	
	let yy_conversation_id = localStorage.getItem('yy_conversation_id')
	console.log(yy_conversation_id)
	if(yy_conversation_id){
		conversationId = yy_conversation_id
	}
	
	const state = reactive({
		conversationId: conversationId,
		userId: uid,
		isConnected: false,
		controller: null,
		error: null,
		loading: false
	})
	const api = createApiClient()

	/**
	 * 发送聊天消息到Dify API
	 * @param {string} query - 用户输入的查询
	 * @param {function} onMessage - 处理流式消息的回调函数
	 * @param {object} options - 可选配置
	 */
	const sendChatMessage = async (query, onMessage, options = {}) => {
		state.loading = true
		state.error = null
		state.controller = new AbortController()
		try {
			const requestBody = {
				query,
				response_mode: 'streaming',
				conversation_id: state.conversationId,
				user: options.user || state.userId,
				inputs: options.inputs || {},
				files: options.files || [],
				auto_generate_name: options.auto_generate_name !== false
			}
			const response = await api.post('chat-messages', requestBody, {
				signal: state.controller.signal
			})
			state.isConnected = true
			// 处理流式响应
			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			while (true) {
				const {
					done,
					value
				} = await reader.read()
				if (done) {
					console.log('[Dify API] 流式响应结束')
					break
				}
				// 解码数据块
				const chunk = decoder.decode(value, {
					stream: true
				})
				// 处理多个数据行
				const lines = chunk.split('\n')

				for (const line of lines) {
					if (line.trim() === '') continue

					// 解析Server-Sent Events格式
					if (line.startsWith('data: ')) {
						const jsonStr = line.substring(6) // 移除 "data: " 前缀

						// 跳过非JSON数据（如ping事件）
						if (jsonStr.trim() === '' || jsonStr.includes('[DONE]')) {
							continue
						}

						const data = JSON.parse(jsonStr)

						// 更新conversation_id
						if (data.conversation_id && !state.conversationId) {
							state.conversationId = data.conversation_id
							localStorage.setItem('yy_conversation_id', state.conversationId)
							console.log('[Dify API] 设置conversation_id:', state.conversationId)
						}

						// 调用消息处理回调
						if (onMessage && typeof onMessage === 'function') {
							onMessage(data)
						}
					}
				}
			}
		} catch (error) {
			state.error = error.message
			if (error.name !== 'AbortError') {
				throw error
			}
		} finally {
			state.isConnected = false
			state.loading = false
		}
	}

	/**
	 * 停止当前流式响应
	 */
	const stopResponse = async () => {
		if (state.controller) {
			state.controller.abort()
			state.isConnected = false
			console.log('[Dify API] 已停止响应')
			await stopConversation()
		}
	}

	/**
	 * 获取会话历史消息
	 * @param {number} page - 页码
	 * @param {number} pageSize - 每页数量
	 * @returns {Promise<Object>} - 会话历史消息
	 */
	const getConversationHistory = async (page = 1, pageSize = 20, id = state.conversationId) => {
		console.log(id)
		if (!id && !state.conversationId) {
			throw new Error('没有活动的会话')
		}
		state.loading = true
		state.error = null
		try {
			const response = await api.get('messages?user=' +
				`${state.userId}` +
				'&conversation_id=' + id +
				'&limit=' + pageSize
			)
			return await response.json()
		} catch (error) {
			state.error = error.message
			throw error
		} finally {
			state.loading = false
		}
	}

	/**
	 * 获取会话列表
	 * @param {number} page - 页码
	 * @param {number} pageSize - 每页数量
	 * @returns {Promise<Object>} - 会话列表
	 */
	const getConversationList = async (page = 1, pageSize = 20) => {
		state.loading = true
		state.error = null
		try {
			const response = await api.get('conversations?user=' +
				`${state.userId}` +
				'&limit=' + pageSize
			)
			return await response.json()
		} catch (error) {
			state.error = error.message
			throw error
		} finally {
			state.loading = false
		}
	}

	/**
	 * 删除会话
	 * @param {string} id - 会话ID
	 * @returns {Promise<void>}
	 */
	const deleteConversation = async (id = state.conversationId) => {
		console.log(id)
		if (!id) {
			throw new Error('没有指定会话ID')
		}
		state.loading = true
		state.error = null
		try {
			await api.delete('conversations/' +id, {
				user: `${state.userId}`,
			})
			console.log(id)
			console.log(state.conversationId)
			if (id === state.conversationId) {
				resetConversation()
			}
			console.log('[Dify API] 会话已删除')
		} catch (error) {
			state.error = error.message
			throw error
		} finally {
			state.loading = false
		}
	}
	
	/**
	 * 获取应用 WebApp 设置
	 * @returns {Promise<void>}
	 */
	const getWebAppSite = async () => {
		state.loading = true
		state.error = null
		try {
			const response = await api.get('site')
			return await response.json()
		} catch (error) {
			state.error = error.message
			throw error
		} finally {
			state.loading = false
		}
	}
	
	/**
	 * 上传文件
	 * @param {File} file 文件
	 * @returns {Promise<void>}
	 */
	const fileUpload = async (file) => {
		state.loading = true
		state.error = null
		try {
			// 创建 FormData 对象
			const formData = new FormData()
			formData.append('user', `${state.userId}`)  // 添加用户ID
			formData.append('file', file)         // 添加文件
			const response = await api.upload('files/upload', formData, {
			      // 可选：监听上传进度
			      onUploadProgress: (progressEvent) => {
			        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
			        console.log(`上传进度: ${percentCompleted}%`);
			      }
			    });
			return await response.json()
		} catch (error) {
			state.error = error.message
			throw error
		} finally {
			state.loading = false
		}
	}
	
	/**
	 * 停止响应
	 * @param {string} id - 会话ID
	 * @returns {Promise<void>}
	 */
	const stopConversation = async (id = state.conversationId) => {
		if (!id) {
			throw new Error('没有指定会话ID')
		}
		state.loading = true
		state.error = null
		try {
			await api.delete(`chat-messages/${state.conversationId}/stop`, {
				user: `${state.userId}`,
			})
			console.log(id)
			console.log(state.conversationId)
			if (id === state.conversationId) {
				resetConversation()
			}
			console.log('[Dify API] 会话已停止')
		} catch (error) {
			state.error = error.message
			throw error
		} finally {
			state.loading = false
		}
	}

	/**
	 * 重置会话
	 */
	const resetConversation = () => {
		state.conversationId = ''
		localStorage.removeItem('yy_conversation_id')
		state.isConnected = false
		state.controller = null
		console.log('[Dify API] 会话已重置')
	}

	/**
	 * 获取当前会话ID
	 */
	const getCurrentConversationId = () => {
		return state.conversationId
	}

	return {
		...toRefs(state),
		sendChatMessage,
		stopResponse,
		getWebAppSite,
		getConversationHistory,
		getConversationList,
		deleteConversation,
		resetConversation,
		getCurrentConversationId,
		setDifyEnvironment,
		fileUpload
	}
}