<template>
	<view class="chat-container">
		<!-- 侧边栏 -->
		<view class="sidebar" :class="{ 
        'sidebar-collapsed': sidebarCollapsed, 
        'open': isSidebarOpen  // 控制移动端显示
      }">
			<view class="sidebar-header">
				<text class="logo">{{ webAppSite.title }}</text>
				<view @click="isSidebarOpen = false" class="toggle-btn mobile-close-btn">
				</view>
			</view>

			<view class="new-chat-btn-container" v-if="!sidebarCollapsed">
				<view @click="resetConversations" class="new-chat-btn">
					<image class="menu-chat" src="/static/new_chat.png" mode="widthFix" />
					<text>新会话</text>
				</view>
			</view>

			<view class="conversations-list" v-if="!sidebarCollapsed">
				<view v-for="conv in conversations" :key="conv.id" class="conversation-item"
					:class="{ active: conv.id === currentConversationId }" @click="switchConversation(conv.id)">
					<view class="conv-preview">
						<view class="conv-icon" v-if="false">
							<image class="menu-chat" src="/static/new_chat.png" mode="widthFix" />
						</view>
						<view class="conv-text">
							<text class="conv-title">{{ conv.name || '无标题会话' }}</text>
							<text class="conv-last-message">{{ conv.introduction || '点击继续聊天' }}</text>
						</view>
					</view>
					<view @click.stop="deleteConversationHandle(conv.id)" class="delete-conv-btn">×</view>
				</view>
			</view>
		</view>

		<!-- 主内容区 -->
		<view class="main-content" @click="handleMainContentClick"
			:style="{width: isSidebarOpen ? 'calc(100% - 15px * 2 - 260px)' : 'calc(100% - 15px * 2)'}">
			<!-- 标题栏 -->
			<view class="chat-header">
				<view class="header-controls">
					<view @click.stop="isSidebarOpen = !isSidebarOpen" class="current-conv-title">
						<image class="menu-icon"
							:src="!isSidebarOpen ? '/static/left_menu_default.png' : '/static/left_menu_select.png'" 
							mode="widthFix" />
					</view>
				</view>

				<view class="header-actions" v-if="false">
					<view @click.stop="showConfigPanel = true" class="config-btn">
						<image class="menu-icon-right" src="/static/right_menu_config.png" mode="widthFix" />
					</view>
				</view>
			</view>

			<!-- 消息区域 -->
			<view class="chat-messages" ref="messagesContainer">
				<!-- 欢迎提示 -->
				<view class="welcome-message" v-if="messages.length === 0 && !isLoading">
					<view class="welcome-avatar">
						<image class="welcome-logo"
							:src="webAppSite.icon_url ? chatConfig.url + webAppSite.icon_url : '/static/yhhy.png'" 
							mode="widthFix" />
					</view>
					<text class="welcome-title">我是{{webAppSite.title}}，很高兴见到你！</text>
					<text class="welcome-desc">有什么可以帮助您的吗？</text>
				</view>

				<view v-for="(message, index) in messages" :key="message.id" class="message" :class="message.type">
					<view class="message-avatar" v-if="message.type !== 'user'">
						<image class="welcome-logo"
							:src="webAppSite.icon_url ? chatConfig.url + webAppSite.icon_url: '/static/yhhy.png'" 
							mode="widthFix" />
					</view>
					<view class="message-content-chat">
						<view class="message-content"
							v-if="message.type !== 'user' && isLoading && index == messages.length - 1">
							<!-- 思考提示 -->
							<view v-if="message && message.isStreaming && message.showTips !== undefined && message.showTips"
								class="tips-indicator">
								深度思考中
							</view>
							<view class="typing-indicator">
								<text></text>
								<text></text>
								<text></text>
							</view>
						</view>
						<view class="message-bubble">
							<view v-if="message.type !== 'user'" class="message-text no-background"
								v-html="formatMessage(message.content)"></view>
							<view v-else class="message-text" v-html="formatMessage(message.content)"></view>
						</view>
						<view v-if="!isLoading" class="message-time"
							@click.stop="copyToClipboard(message.content, $event.target)" title="复制消息">
							<image class="message-copy" src="/static/copy.png" mode="widthFix" />
						</view>
					</view>
				</view>

				<!-- 正在输入指示器 -->
				<view v-if="isLoading && false" class="message assistant">
					<view class="message-avatar">
						<image class="welcome-logo"
							:src="webAppSite.icon_url ? chatConfig.url + webAppSite.icon_url: '/static/yhhy.png'" 
							mode="widthFix" />
					</view>
					<view class="message-content">
						<view v-if="message && message.isStreaming && message.showTips !== undefined && message.showTips"
							class="tips-indicator">
							深度思考中
						</view>
						<view class="typing-indicator">
							<text></text>
							<text></text>
							<text></text>
						</view>
					</view>
				</view>
			</view>

			<!-- 输入区域 -->
			<view class="ds-input-container">
				<view class="ds-input-wrapper"
					:style="{width: isSidebarOpen ? 'calc(100% - 15px * 2 - 260px)' : 'calc(100% - 15px * 2)'}">
					<!-- 输入框容器 -->
					<view class="ds-input-with-actions">
						<textarea v-model="inputMessage" :placeholder="'给 '+ webAppSite.title +' 发送消息'" class="ds-input"
							:rows="rows" @input="adjustTextareaHeight" @keyup.enter.exact="sendMessage"
							@keyup.enter.shift="handleShiftEnter"></textarea>

						<!-- 输入框内按钮区域 -->
						<view class="ds-input-inner-actions">
							<view class="ds-left-actions" v-if="false">
								<view class="ds-action-btn" title="深度思考">
									<view class="ds-icon">
										<image class="file-icon" src="/static/deep_think.png" mode="widthFix" />
									</view>
									<text>深度思考</text>
								</view>

								<view class="ds-action-btn" title="联网搜索">
									<view class="ds-icon">
										<image class="file-icon" src="/static/online_search.png" mode="widthFix" />
									</view>
									<text>联网搜索</text>
								</view>
							</view>

							<!-- 预览区域 -->
							<view class="preview-area" v-if="imageUrl">
								<image :src="imageUrl" mode="aspectFill"></image>
								<text class="uploading-text" v-if="isLoading">上传中...</text>
							</view>

							<view class="upload-send-con">
								<!-- 文件发送按钮 -->
								<view class="ds-upload-btn" v-if="false">
									<view class="ds-icon" @click="selectImage">
										<image class="file-icon" src="/static/file_icon.png" mode="widthFix" />
									</view>
								</view>

								<!-- 发送按钮 -->
								<view class="ds-send-btn ds-send-btn-inner" @click="sendMessage"
									:disabled="isLoading || !inputMessage.trim()">
									<image class="send-icon"
										:src="(isLoading || !inputMessage.trim()) ? '/static/send_disable.png' : '/static/send_default.png'" 
										mode="widthFix" />
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="footer-tip" v-if="false">{{ webAppSite.custom_disclaimer }}</view>
			</view>
			<!-- 配置面板 -->
			<ConfigPanel :config="chatConfig" :modelValue="showConfigPanel" @config-change="handleConfigChange"
				@test-connection="handleTestConnection" />
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		nextTick,
		onMounted,
		reactive,
		computed
	} from 'vue'
	import {
		marked
	} from 'marked'

	import ConfigPanel from '../components/ConfigPanel.vue'

	import {
		useDifyChat,
		setDifyEnvironment
	} from '../utils/difyApi.js'

	// 使用聊天功能
	const {
		conversationId,
		isConnected,
		getWebAppSite,
		sendChatMessage,
		getConversationList,
		getConversationHistory,
		deleteConversation,
		stopResponse,
		fileUpload,
		resetConversation
	} = useDifyChat()


	// 响应式数据
	const messages = ref([])
	const inputMessage = ref('')
	const isLoading = ref(false)
	const errorMessage = ref('')
	const messagesContainer = ref(null)
	const showConfigPanel = ref(false)
	const sidebarCollapsed = ref(false)
	const messageInput = ref(null)
	const rows = ref(2) // 新增：控制文本框初始行数
	// 新增：控制移动端侧边栏显示/隐藏
	const isSidebarOpen = ref(false);

	// 会话管理
	const conversations = ref([])
	const conversationsHistory = ref([])
	const currentConversationId = ref('current')

	const webAppSite = ref(null)
	const fileInputRef = ref(null)
	const imageUrl = ref('') // 图片预览地址
	const uploadFileId = ref('')

	// 聊天配置
	const chatConfig = reactive({
		url: 'http://ai.yuhwyuan.com',
		apiKey: 'app-FkDM0qopxHtZx4hrovISYbwh',
		baseUrl: 'http://ai.yuhwyuan.com/v1',
		userId: 'user1',
		robotType: '智能助手'
	})

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
	}

	// 在 onMounted 中进行异步调用
	onMounted(async () => {
		await getSite()
		await getConversationLists(true);
		loadSavedConfig()
		// 自动聚焦到输入框
		nextTick(() => {
			messageInput.value?.focus()
		})
	});


	// 获取应用 WebApp 设置
	const getSite = async () => {
		isLoading.value = true;
		try {
			const result = await getWebAppSite();
			// 将结果赋值给响应式变量（result 即为接口返回的 data 字段）
			webAppSite.value = result
		} catch (error) {
			console.error('onMounted 异步调用失败:', error);
		} finally {
			isLoading.value = false;
		}
	}

	// 获取会话列表
	const getConversationLists = async (loadDefault) => {
		isLoading.value = true;
		try {
			const result = await getConversationList(1, 20);
			// 将结果赋值给响应式变量（result 即为接口返回的 data 字段）
			conversations.value = result.data
			console.log('组件挂载后获取到的历史数据:', conversations.value);
			if (conversations.value.length > 0 && loadDefault) {
				getConversationHistoryList(conversations.value[0].id)
			}
		} catch (error) {
			console.error('onMounted 异步调用失败:', error);
		} finally {
			isLoading.value = false;
		}
	}

	// 获取会话历史消息
	const getConversationHistoryList = async (id) => {
		if (!id) {
			return
		}
		isLoading.value = true;
		try {
			const result = await getConversationHistory(1, 20, id);
			// 将结果赋值给响应式变量（result 即为接口返回的 data 字段）
			conversationsHistory.value = result.data
			if (conversationsHistory.value.length > 0) {
				conversationsHistory.value.forEach(item => {
					const assistantMessage1 = {
						id: item.id,
						type: 'user',
						content: item.query, // 最终显示内容
						pendingContent: '', // 待处理的流式内容
						typingInterval: null, // 打字效果定时器
						timestamp: new Date()
					};
					messages.value.push(assistantMessage1);

					const assistantMessage2 = {
						id: item.id,
						type: 'assistant',
						content: item.answer, // 最终显示内容
						pendingContent: '', // 待处理的流式内容
						typingInterval: null, // 打字效果定时器
						timestamp: new Date()
					};
					messages.value.push(assistantMessage2);
				})
				scrollToBottom();
			}
			// console.log('组件挂载后获取到的历史数据:', result);
		} catch (error) {
			console.error('onMounted 异步调用失败:', error);
		} finally {
			isLoading.value = false;
			isSidebarOpen.value = false;
		}
	}

	// 发送消息
	const sendMessage = async () => {
		if (!inputMessage.value.trim() || isLoading.value) return;

		const userMessageText = inputMessage.value;
		const messageId = Date.now();

		// 添加用户消息
		messages.value.push({
			id: messageId,
			type: 'user',
			content: userMessageText,
			timestamp: new Date()
		});

		inputMessage.value = '';
		isLoading.value = true;
		errorMessage.value = '';
		scrollToBottom();

		// 创建助手消息容器（带打字效果相关属性）
		const assistantMessageId = messageId + 1;
		const assistantMessage = {
			id: assistantMessageId,
			type: 'assistant',
			content: '', // 最终显示内容
			pendingContent: '', // 待处理的流式内容
			typingInterval: null, // 打字效果定时器
			isStreaming: true,
			showTips: false, // 控制提示文本的显示
			timestamp: new Date()
		};

		// 立即添加助手消息到DOM
		messages.value.push(assistantMessage);

		// 设置3秒后显示提示文本
		const tipsTimer = setTimeout(() => {
			// 检查消息是否仍然存在且处于流式状态
			const msgIndex = messages.value.findIndex(m => m.id === assistantMessageId);
			if (msgIndex !== -1 && messages.value[msgIndex].isStreaming) {
				messages.value[msgIndex].showTips = true;
			}
		}, 3000);

		// 处理流式响应的函数
		const handleStreamChunk = (chunk) => {
			console.log(chunk);

			if (chunk.event === 'message') {
				// 确保消息对象存在且未被修改
				const msgIndex = messages.value.findIndex(m => m.id === assistantMessageId);
				if (msgIndex === -1) return;
				isLoading.value = false;
				const currentMessage = messages.value[msgIndex];

				// 如果收到第一个字符，清除提示文本定时器
				if (currentMessage.pendingContent === '' && !currentMessage.showTips) {
					clearTimeout(tipsTimer);
				}

				// 将新内容添加到待处理队列
				currentMessage.pendingContent += chunk.answer || '';

				if (!currentMessage.typingInterval) {
					// 如果没有正在运行的定时器，启动打字效果
					startTypingEffect(currentMessage);
				}
			} else if (chunk.event === 'message_end') {
				console.log('消息结束，元数据:', chunk.metadata);

				// 确保消息对象存在
				const msgIndex = messages.value.findIndex(m => m.id === assistantMessageId);
				if (msgIndex !== -1) {
					messages.value[msgIndex].isStreaming = false;
					messages.value[msgIndex].showTips = false; // 隐藏提示文本
				}

				isConnected.value = true;
			} else if (chunk.event === 'workflow_started') {
				isConnected.value = true;
			}
		};

		try {
			// 发送请求并处理流式响应
			await sendChatMessage(userMessageText, handleStreamChunk, {
				robotType: chatConfig.robotType,
				files: {
					"type": "image",
					"transfer_method": "local_file",
					"url": uploadFileId.value
				}
			});
		} catch (error) {
			console.error('发送消息失败:', error);
			errorMessage.value = `发送消息失败：${error.message}`;

			// 确保错误处理时消息对象存在
			const msgIndex = messages.value.findIndex(m => m.id === assistantMessageId);
			if (msgIndex !== -1) {
				messages.value[msgIndex].content = '抱歉，发送消息失败，请重试';
				messages.value[msgIndex].isStreaming = false;
				messages.value[msgIndex].showTips = false;
			}

			isConnected.value = false;
		} finally {
			isLoading.value = false;
			// 确保清除定时器
			clearTimeout(tipsTimer);
			await getConversationLists(false);

			// 重新聚焦到输入框
			nextTick(() => {
				messageInput.value?.focus();
			});
		}
	};

	// 启动打字效果
	const startTypingEffect = (message) => {
		// 清除可能存在的旧定时器
		if (message.typingInterval) {
			clearInterval(message.typingInterval);
		}

		// 打字速度控制（毫秒/字符），可以根据需要调整
		const typingSpeed = 30;

		// 创建新的定时器
		message.typingInterval = setInterval(() => {
			if (message.pendingContent.length > 0) {
				// 每次取一个字符添加到显示内容
				message.content += message.pendingContent.charAt(0);
				// 从待处理内容中移除已显示的字符
				message.pendingContent = message.pendingContent.slice(1);
				// 滚动到底部
				scrollToBottom();
			} else {
				// 没有更多内容时清除定时器
				clearInterval(message.typingInterval);
				message.typingInterval = null;
			}
		}, typingSpeed);
	};

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
		if (!conv && !isAssistant) {
			// 用第一条用户消息作为会话标题（取前20个字符）
			conv.title = message.length > 20 ? message.substring(0, 20) + '...' : message
		}
		// 更新最后一条消息预览（取前30个字符）
		conv.lastMessage = message.length > 30 ? message.substring(0, 30) + '...' : message
		conv.timestamp = new Date().getTime()
	}

	// 切换会话
	const switchConversation = (id) => {
		if (id === currentConversationId.value) return

		// 这里应该从存储加载该会话的消息
		// 简化实现，实际项目中需要保存和加载消息历史
		currentConversationId.value = id
		messages.value = []
		isLoading.value = false
		console.log(id)
		getConversationHistoryList(id);
	}

	// 创建新会话
	const resetConversations = () => {
		const newConvId = 'conv_' + Date.now()
		currentConversationId.value = newConvId
		messages.value = []
		// 聚焦到输入框
		nextTick(() => {
			messageInput.value?.focus()
		})
		isSidebarOpen.value = false;
		resetConversation()
	}

	// 删除会话
	const deleteConversationHandle = (id) => {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这个会话吗？此操作不可撤销。',
			confirmText: '删除',
			confirmColor: '#FF4500',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					// 用户点击删除
					if (id === currentConversationId.value) {
						// 如果删除当前会话，切换到第一个会话
						const firstConv = conversations.value.find(conv => conv.id !== id)
						if (firstConv) {
							currentConversationId.value = firstConv.id
							messages.value = [] // 实际项目中应该加载新会话的消息
						}
					}
					deleteConversation(id)
					conversations.value = conversations.value.filter(conv => conv.id !== id)
					console.log(conversations.value)
					if (conversations && conversations.value.length < 1) {
						resetConversations()
					}
				} else if (res.cancel) {
					// 用户点击取消，不执行任何操作
				}
			}
		})
	}

	// 清空所有会话
	const clearAllConversations = () => {
		if (confirm('确定要清空所有会话吗？此操作不可恢复。')) {
			conversations.value = []
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

const scrollToBottom = () => {
  nextTick(() => {
    if (!messagesContainer.value) return

    /* #ifdef H5 */
    // H5平台：直接操作DOM
    const el = messagesContainer.value.$el
    el.scrollTop = el.scrollHeight
    /* #endif */

    /* #ifdef MP-WEIXIN */
    // 微信小程序：用Uniapp API
    const query = uni.createSelectorQuery().in(getCurrentInstance())
    query.select('.chat-messages')
      .scrollOffset()
      .exec(res => {
        if (res[0]) {
          uni.pageScrollTo({
            scrollTop: res[0].scrollHeight,
            duration: 0
          })
        }
      })
    /* #endif */
  })
}

	/**
	 * 调整文本域高度（兼容多种触发场景，增加容错处理）
	 */
	const adjustTextareaHeight = (e) => {
		// 容错处理：确保事件对象和目标元素存在
		if (!e || !e.target) {
			console.warn('调整文本域高度失败：未获取到有效元素');
			return;
		}

		const textarea = e.target;

		// 额外校验：确保目标是 textarea 元素（防止绑定到其他元素）
		if (textarea.tagName !== 'TEXTAREA') {
			console.warn('调整文本域高度失败：目标元素不是 textarea');
			return;
		}

		// 重置高度以计算真实滚动高度
		textarea.style.height = 'auto';
		// 设置高度为内容滚动高度（+2px 避免边框导致的滚动条闪烁）
		textarea.style.height = `${textarea.scrollHeight + 2}px`;

		// 限制最大高度
		const maxHeight = 160; // 最大高度常量，便于维护
		if (textarea.scrollHeight > maxHeight) {
			textarea.style.height = `${maxHeight}px`;
			textarea.style.overflowY = 'auto';
		} else {
			textarea.style.overflowY = 'hidden';
		}
	};

	// 选择图片
	const selectImage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				console.log('选择图片成功', res)
				imageUrl.value = res.tempFilePaths[0]
				handleFileUpload(res.tempFilePaths[0])
			},
			fail: (err) => {
				console.error('选择图片失败', err)
				uni.showToast({
					title: '选择图片失败',
					icon: 'none'
				})
			}
		})
	}


	// 处理文件上传
	const handleFileUpload = (blobData) => {
		const file = new File([blobData], new Date().getTime() + ".jpg", {
			type: "image/jpeg"
		})
		console.log('转换后的 File 对象：', file);
		isLoading.value = true;
		try {
			const result = fileUpload(file).then((result) => {
					// result 是 Promise 解析后的对象
					console.log(result)
					console.log(result.id)
					if (result) {
						uploadFileId.value = result.id
					}
				})
				.catch((error) => {
					console.error('上传失败:', error);
				});
		} catch (error) {
			console.error('onMounted 异步调用失败:', error);
		} finally {
			isLoading.value = false;
		}
	}

	// 点击主内容区关闭侧边栏（仅移动端）
	const handleMainContentClick = () => {
		if (window.innerWidth <= 768 && isSidebarOpen.value) {
			isSidebarOpen.value = false;
		}
	};

	// 复制文本到剪贴板（uni-app版本）
	const copyToClipboard = async (text) => {
		try {
			// 复制文本到剪贴板
			await uni.setClipboardData({
				data: text,
				success: () => {
					// 使用uni-app的提示框显示成功信息
					uni.showToast({
						title: '复制成功',
						icon: 'success',
						duration: 500
					});
				}
			});
		} catch (err) {
			console.error('复制失败:', err);
			// 使用uni-app的提示框显示失败信息
			uni.showToast({
				title: '复制失败，请手动复制',
				icon: 'none',
				duration: 500
			});
		}
	};
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
		background-color: #ffffff;
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
		transition: transform 0.3s ease;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		transform: translateX(-100%);
		z-index: 100;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.sidebar-collapsed {
		width: 60px;
	}

	.sidebar-header {
		padding: 16px;
		height: 65px;
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
		background-color: #dbeafe;
		color: #4d6bfe;
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

	/* 	.new-chat-btn:hover {
		background-color: #0e4ddb;
	} */

	.new-chat-btn text {
		font-size: 1.25rem;
	}

	.conversations-list {
		flex: 1;
		overflow-y: auto;
		padding: 8px 0;
	}

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
	  /* 关键：设置为Flex容器，子元素垂直排列 */
	  display: flex;
	  flex-direction: column; /* 垂直方向排列（标题在上，消息在下） */
	}
	
	.conv-title {
	  font-size: 0.9375rem;
	  font-weight: 500;
	  color: #333;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  /* 标题靠左（默认值，可省略） */
	  align-self: flex-start;
	}
	
	.conv-last-message {
	  font-size: 0.8125rem;
	  color: #6b7280;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  margin-top: 2px;
	  /* 关键：让最后一条消息靠右对齐 */
	  align-self: flex-first; /* 仅自身靠右 */
	}

	.delete-conv-btn {
		background: none;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		font-size: 1rem;
		padding: 4px;
		opacity: 1;
		/* transition: opacity 0.2s; */
	}

	/* 	.conversation-item:hover .delete-conv-btn {
		opacity: 1;
	} */

	/* 主内容区样式 */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: transform 0.3s ease;
	}

	.sidebar.open~.main-content {
		transform: translateX(260px);
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

	.config-btn:hover {
		background-color: #f3f4f6;
	}

	.menu-chat {
		width: 30px;
		height: 30px;
	}

	.menu-icon {
		width: 25px;
		height: 25px;
	}

	.menu-icon-right {
		width: 28px;
		height: 25px;
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
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
		padding: 32px 16px;
	}

	.footer-tip {
		font-size: 12px;
		color: #a8a8a8;
		line-height: 14px;
		margin-top: 10px;
		width: 100%;
		text-align: center;
	}

	.welcome-avatar {
		width: 100px;
		margin: calc((100% - 100px) / 2);
		font-size: 3rem;
		margin-bottom: 16px;

		image {
			width: 100px;
			height: 100px;
		}
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

		image {
			width: 32px;
			height: 32px;
		}
	}

	.message-content-chat {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	/* 处理 pre 标签（代码块容器） */
	.message-text pre {
		margin: 0;
		padding: 12px;
		background-color: #f5f5f5;
		/* 代码块背景色 */
		border-radius: 4px;
		overflow-x: auto;
		/* 关键：添加水平滚动 */
		white-space: pre;
		/* 保留代码格式 */
		line-height: 1.5;
		font-family: monospace;
		/* 使用等宽字体 */
		max-height: 400px;
		/* 可选：限制最大高度，添加垂直滚动 */
		overflow-y: auto;
	}

	/* 处理 code 标签（代码内容） */
	.message-text pre code {
		font-size: 14px;
		color: #333;
		/* 代码颜色 */
		/* 可以添加语法高亮相关样式 */
	}

	.message-content {
		height: 40px;
		line-height: 40px;
		align-items: center;
		flex: 1;
		display: flex;
		/* flex-direction: column; */
		justify-content: flex-start;
	}

	.message-text {
		background-color: #eff6ff;
		padding: 12px 16px;
		border-radius: 8px;
		line-height: 20px;
		overflow: hidden;
	}

	.no-background {
		padding: 0;
		background-color: transparent;
	}

	/* 在消息区域样式中添加 */
	.message-text,
	.message-text * {
		user-select: text !important;
		-webkit-user-select: text !important;
	}

	.message.user .message-text {}

	.message-bubble {

		max-width: 100%;
		background-color: white;
		border-radius: 8px;
		/* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); */
		position: relative;
	}

	.message.user .message-bubble {}

	.message-time {
		font-size: 0.75rem;
		color: #9ca3af;
		margin-top: 4px;
		text-align: right;
		opacity: 0.7;
	}

	.message-copy {
		cursor: pointer;
		opacity: 0.7;
		transition: all 0.2s;
		width: 16px;
		height: 16px;
	}

	.message-copy:hover {
		opacity: 1;
		transform: scale(1.1);
	}

	.message:hover .message-copy {
		display: inline-block;
	}

	.message.assistant .message-time {
		text-align: left;
		left: 8px;
	}

	.tips-indicator {
		font-size: 12px;
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		padding: 16px 12px;
	}

	.typing-indicator text {
		width: 6px;
		height: 6px;
		background-color: #9ca3af;
		border-radius: 50%;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-indicator text:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-indicator text:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes typing {

		0%,
		60%,
		100% {
			transform: translateY(0);
		}

		30% {
			transform: translateY(-4px);
		}
	}

	/* 输入区域样式 */
	.ds-input-container {
		padding: 16px;
		/* border-top: 1px solid #e5e7eb; */
		background-color: transparent;
	}

	.ds-input-wrapper {
		/* max-width: calc(100% - 15px * 2); */
		margin: 0 auto;
		position: relative;
	}

	.ds-input-with-actions {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: rgb(243 244 246);
		box-shadow: 0px 0px 0px .5px #dce0e9;
		border-radius: 24px;
	}

	.ds-input {
		width: 100%;
		padding: 12px 12px 48px 12px;
		/* border: 1px solid #e5e7eb; */
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
		width: calc(100% - 20px * 2);
		margin: 0 auto;
		position: absolute;
		right: 20px;
		bottom: 8px;
		display: flex;
		justify-content: space-between;
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
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;

		.file-icon {
			width: 22px;
			height: 22px;
		}
	}

	.upload-send-con {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.ds-upload-btn {
		border: none;
		/* padding: 6px; */
		border-radius: 6px;
		cursor: pointer;
		color: #6b7280;
		transition: background-color 0.2s;
	}

	.ds-upload-btn:hover {}

	.ds-send-btn {
		/* margin-left: auto; */
		width: 30px;
		height: 30px;
		/* 		background-color: #d7dee8;
		color: white;
		border: none;
		border-radius: 20px; */
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;

		.send-icon {
			width: 30px;
			height: 30px;
		}
	}

	.ds-send-btn:hover {
		/* background-color: #0e4ddb; */
	}

	.ds-send-btn:disabled {
		background-color: #d7dee8;
		cursor: not-allowed;
	}

	.preview-area {
		width: 50px;
		height: 50px;
		margin: 0 auto;
		border: 1px solid #eee;
		border-radius: 8px;
		position: relative;
	}

	.preview-area image {
		width: 100%;
		height: 100%;
		border-radius: 8px;
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

	/* 移动端侧边栏样式 */
	@media (max-width: 768px) {
		.sidebar {
			/* 确保侧边栏默认隐藏在屏幕外 */
			transform: translateX(-100%);
			z-index: 100;
			/* 提高层级避免被遮挡 */
		}

		.sidebar.open {
			/* 显示时滑入屏幕 */
			transform: translateX(0);
		}

		/* 确保主内容区在侧边栏显示时不被遮挡 */
		.main-content {
			width: 100%;
			transition: transform 0.3s ease;
		}

		.sidebar.open~.main-content {
			transform: translateX(260px);
			/* 主内容区右移，避免被侧边栏遮挡 */
		}

		.sidebar-collapsed {
			width: 260px;
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

		.footer-tip {
			font-size: 12px;
			color: #a8a8a8;
			line-height: 14px;
			margin-top: 10px;
			width: 100%;
			text-align: center;
		}
	}
</style>