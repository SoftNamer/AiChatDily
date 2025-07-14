<template>
	<div class="chat-container">
		<!-- 侧边栏 -->
		<div class="sidebar" :class="{ 
        'sidebar-collapsed': sidebarCollapsed, 
        'open': isSidebarOpen  // 新增：控制移动端显示
      }">
			<div class="sidebar-header">
				<h1 class="logo">{{ webAppSite.title }}</h1>
				<div @click="isSidebarOpen = false" class="toggle-btn mobile-close-btn">
				</div>
			</div>

			<div class="new-chat-btn-container" v-if="!sidebarCollapsed">
				<div @click="resetConversation" class="new-chat-btn">
					<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M9.10999 27C8.92999 27 8.76001 26.96 8.60001 26.9C8.43001 26.83 8.29 26.74 8.16 26.61C8.03 26.49 7.94 26.3499 7.87 26.1899C7.79999 26.0299 7.76001 25.8599 7.76001 25.6899L7.73001 23.04C7.34001 22.98 6.95001 22.8799 6.57001 22.7599C6.19001 22.6299 5.83001 22.48 5.48001 22.29C5.13001 22.1 4.79999 21.88 4.48999 21.63C4.17999 21.39 3.89 21.1199 3.63 20.82C3.37 20.52 3.13999 20.21 2.92999 19.87C2.72999 19.53 2.56001 19.18 2.42001 18.82C2.28001 18.45 2.17001 18.07 2.10001 17.69C2.03001 17.3 2 16.92 2 16.53V9.46995C2 9.03995 2.04 8.61995 2.12 8.19995C2.21 7.77995 2.34 7.36995 2.5 6.96995C2.67 6.57995 2.88 6.19995 3.12 5.84995C3.36 5.48995 3.64001 5.15995 3.95001 4.85995C4.26001 4.55995 4.59999 4.28995 4.95999 4.04995C5.32999 3.80995 5.70999 3.60995 6.10999 3.44995C6.51999 3.27995 6.94 3.15995 7.37 3.07995C7.79999 2.98995 8.23001 2.94995 8.67001 2.94995H13.3C13.46 2.94995 13.61 2.97995 13.76 3.03995C13.9 3.09995 14.03 3.17995 14.14 3.28995C14.25 3.39995 14.33 3.51995 14.39 3.65995C14.45 3.79995 14.48 3.94995 14.48 4.09995C14.48 4.25995 14.45 4.39995 14.39 4.54995C14.33 4.68995 14.25 4.80995 14.14 4.91995C14.03 5.02995 13.9 5.10995 13.76 5.16995C13.61 5.22995 13.46 5.25995 13.3 5.25995H8.67001C8.38001 5.25995 8.09999 5.27995 7.82999 5.33995C7.54999 5.38995 7.27999 5.46995 7.01999 5.57995C6.75999 5.67995 6.50999 5.80995 6.26999 5.96995C6.03999 6.11995 5.82 6.29995 5.62 6.48995C5.42 6.68995 5.23999 6.89995 5.07999 7.12995C4.92999 7.35995 4.78999 7.59995 4.67999 7.85995C4.57999 8.10995 4.49 8.37995 4.44 8.64995C4.38 8.91995 4.35999 9.18995 4.35999 9.46995V16.53C4.35999 16.81 4.38 17.08 4.44 17.36C4.5 17.63 4.58 17.9 4.69 18.16C4.8 18.42 4.93 18.67 5.09 18.9C5.25 19.13 5.43001 19.3499 5.64001 19.5499C5.84001 19.75 6.05999 19.92 6.29999 20.08C6.53999 20.24 6.79 20.37 7.06 20.47C7.32 20.58 7.6 20.66 7.88 20.72C8.16001 20.77 8.44001 20.7999 8.73001 20.7999C8.91001 20.7999 9.08 20.83 9.25 20.9C9.41 20.97 9.55999 21.0599 9.67999 21.18C9.80999 21.3099 9.91001 21.45 9.98001 21.61C10.05 21.77 10.08 21.94 10.09 22.11L10.1 23.74L13.08 21.61C13.84 21.07 14.69 20.7999 15.63 20.7999H19.32C19.61 20.7999 19.89 20.77 20.16 20.72C20.44 20.67 20.71 20.59 20.97 20.4799C21.23 20.3699 21.48 20.24 21.72 20.09C21.95 19.94 22.17 19.76 22.37 19.57C22.57 19.3699 22.75 19.16 22.91 18.93C23.07 18.7 23.2 18.46 23.31 18.2C23.41 17.95 23.5 17.68 23.55 17.41C23.61 17.14 23.63 16.87 23.63 16.59V12.94C23.63 12.79 23.66 12.64 23.72 12.5C23.78 12.36 23.87 12.23 23.98 12.13C24.09 12.02 24.22 11.93 24.36 11.88C24.51 11.82 24.66 11.79 24.82 11.79C24.97 11.79 25.12 11.82 25.27 11.88C25.41 11.93 25.54 12.02 25.65 12.13C25.76 12.23 25.85 12.36 25.91 12.5C25.97 12.64 26 12.79 26 12.94V16.59C26 17.02 25.95 17.44 25.87 17.86C25.78 18.28 25.66 18.69 25.49 19.08C25.32 19.48 25.11 19.8499 24.87 20.2099C24.63 20.57 24.35 20.9 24.04 21.2C23.73 21.5 23.39 21.7699 23.03 22.0099C22.67 22.2499 22.28 22.45 21.88 22.61C21.47 22.77 21.06 22.9 20.63 22.9799C20.2 23.07 19.76 23.11 19.32 23.11H16.4C15.47 23.11 14.62 23.3799 13.86 23.9199L9.91 26.74C9.67 26.91 9.39999 27 9.10999 27Z"
							fill="currentColor"></path>
						<path
							d="M24.6805 5.14453H18.1874C17.5505 5.14453 17.0342 5.66086 17.0342 6.29778C17.0342 6.9347 17.5505 7.45102 18.1874 7.45102H24.6805C25.3175 7.45102 25.8338 6.9347 25.8338 6.29778C25.8338 5.66086 25.3175 5.14453 24.6805 5.14453Z"
							fill="currentColor"></path>
						<path
							d="M22.6137 3.1804C22.6137 2.52848 22.0852 2 21.4333 2C20.7814 2 20.2529 2.52848 20.2529 3.1804V9.4168C20.2529 10.0687 20.7814 10.5972 21.4333 10.5972C22.0852 10.5972 22.6137 10.0687 22.6137 9.4168V3.1804Z"
							fill="currentColor"></path>
					</svg>
					新会话
				</div>
			</div>

			<div class="conversations-list" v-if="!sidebarCollapsed">
				<!--        <div class="conversations-header">
          <h3>会话</h3>
          <div @click="clearAllConversations" class="clear-all-btn">清空全部</div>
        </div> -->
				<div v-for="conv in conversations" :key="conv.id" class="conversation-item"
					:class="{ active: conv.id === currentConversationId }" @click="switchConversation(conv.id)">
					<div class="conv-preview">
						<div class="conv-icon" v-if="false"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M9.10999 27C8.92999 27 8.76001 26.96 8.60001 26.9C8.43001 26.83 8.29 26.74 8.16 26.61C8.03 26.49 7.94 26.3499 7.87 26.1899C7.79999 26.0299 7.76001 25.8599 7.76001 25.6899L7.73001 23.04C7.34001 22.98 6.95001 22.8799 6.57001 22.7599C6.19001 22.6299 5.83001 22.48 5.48001 22.29C5.13001 22.1 4.79999 21.88 4.48999 21.63C4.17999 21.39 3.89 21.1199 3.63 20.82C3.37 20.52 3.13999 20.21 2.92999 19.87C2.72999 19.53 2.56001 19.18 2.42001 18.82C2.28001 18.45 2.17001 18.07 2.10001 17.69C2.03001 17.3 2 16.92 2 16.53V9.46995C2 9.03995 2.04 8.61995 2.12 8.19995C2.21 7.77995 2.34 7.36995 2.5 6.96995C2.67 6.57995 2.88 6.19995 3.12 5.84995C3.36 5.48995 3.64001 5.15995 3.95001 4.85995C4.26001 4.55995 4.59999 4.28995 4.95999 4.04995C5.32999 3.80995 5.70999 3.60995 6.10999 3.44995C6.51999 3.27995 6.94 3.15995 7.37 3.07995C7.79999 2.98995 8.23001 2.94995 8.67001 2.94995H13.3C13.46 2.94995 13.61 2.97995 13.76 3.03995C13.9 3.09995 14.03 3.17995 14.14 3.28995C14.25 3.39995 14.33 3.51995 14.39 3.65995C14.45 3.79995 14.48 3.94995 14.48 4.09995C14.48 4.25995 14.45 4.39995 14.39 4.54995C14.33 4.68995 14.25 4.80995 14.14 4.91995C14.03 5.02995 13.9 5.10995 13.76 5.16995C13.61 5.22995 13.46 5.25995 13.3 5.25995H8.67001C8.38001 5.25995 8.09999 5.27995 7.82999 5.33995C7.54999 5.38995 7.27999 5.46995 7.01999 5.57995C6.75999 5.67995 6.50999 5.80995 6.26999 5.96995C6.03999 6.11995 5.82 6.29995 5.62 6.48995C5.42 6.68995 5.23999 6.89995 5.07999 7.12995C4.92999 7.35995 4.78999 7.59995 4.67999 7.85995C4.57999 8.10995 4.49 8.37995 4.44 8.64995C4.38 8.91995 4.35999 9.18995 4.35999 9.46995V16.53C4.35999 16.81 4.38 17.08 4.44 17.36C4.5 17.63 4.58 17.9 4.69 18.16C4.8 18.42 4.93 18.67 5.09 18.9C5.25 19.13 5.43001 19.3499 5.64001 19.5499C5.84001 19.75 6.05999 19.92 6.29999 20.08C6.53999 20.24 6.79 20.37 7.06 20.47C7.32 20.58 7.6 20.66 7.88 20.72C8.16001 20.77 8.44001 20.7999 8.73001 20.7999C8.91001 20.7999 9.08 20.83 9.25 20.9C9.41 20.97 9.55999 21.0599 9.67999 21.18C9.80999 21.3099 9.91001 21.45 9.98001 21.61C10.05 21.77 10.08 21.94 10.09 22.11L10.1 23.74L13.08 21.61C13.84 21.07 14.69 20.7999 15.63 20.7999H19.32C19.61 20.7999 19.89 20.77 20.16 20.72C20.44 20.67 20.71 20.59 20.97 20.4799C21.23 20.3699 21.48 20.24 21.72 20.09C21.95 19.94 22.17 19.76 22.37 19.57C22.57 19.3699 22.75 19.16 22.91 18.93C23.07 18.7 23.2 18.46 23.31 18.2C23.41 17.95 23.5 17.68 23.55 17.41C23.61 17.14 23.63 16.87 23.63 16.59V12.94C23.63 12.79 23.66 12.64 23.72 12.5C23.78 12.36 23.87 12.23 23.98 12.13C24.09 12.02 24.22 11.93 24.36 11.88C24.51 11.82 24.66 11.79 24.82 11.79C24.97 11.79 25.12 11.82 25.27 11.88C25.41 11.93 25.54 12.02 25.65 12.13C25.76 12.23 25.85 12.36 25.91 12.5C25.97 12.64 26 12.79 26 12.94V16.59C26 17.02 25.95 17.44 25.87 17.86C25.78 18.28 25.66 18.69 25.49 19.08C25.32 19.48 25.11 19.8499 24.87 20.2099C24.63 20.57 24.35 20.9 24.04 21.2C23.73 21.5 23.39 21.7699 23.03 22.0099C22.67 22.2499 22.28 22.45 21.88 22.61C21.47 22.77 21.06 22.9 20.63 22.9799C20.2 23.07 19.76 23.11 19.32 23.11H16.4C15.47 23.11 14.62 23.3799 13.86 23.9199L9.91 26.74C9.67 26.91 9.39999 27 9.10999 27Z"
									fill="currentColor"></path>
								<path
									d="M24.6805 5.14453H18.1874C17.5505 5.14453 17.0342 5.66086 17.0342 6.29778C17.0342 6.9347 17.5505 7.45102 18.1874 7.45102H24.6805C25.3175 7.45102 25.8338 6.9347 25.8338 6.29778C25.8338 5.66086 25.3175 5.14453 24.6805 5.14453Z"
									fill="currentColor"></path>
								<path
									d="M22.6137 3.1804C22.6137 2.52848 22.0852 2 21.4333 2C20.7814 2 20.2529 2.52848 20.2529 3.1804V9.4168C20.2529 10.0687 20.7814 10.5972 21.4333 10.5972C22.0852 10.5972 22.6137 10.0687 22.6137 9.4168V3.1804Z"
									fill="currentColor"></path>
							</svg></div>
						<div class="conv-text">
							<p class="conv-title">{{ conv.name || '无标题会话' }}</p>
							<p class="conv-last-message">{{ conv.introduction || '点击继续聊天' }}</p>
						</div>
					</div>
					<div @click.stop="deleteConversationHandle(conv.id)" class="delete-conv-btn">×</div>
				</div>
			</div>
		</div>

		<!-- 主内容区 -->
		<div class="main-content" @click="handleMainContentClick" :style="{width: isSidebarOpen ? 'calc(100% - 15px * 2 - 260px)' : 'calc(100% - 15px * 2)'}">
			<!-- 标题栏 -->
			<div class="chat-header">
				<div class="header-controls">
					<div @click.stop="isSidebarOpen = !isSidebarOpen" class="current-conv-title">
						<svg v-if="!isSidebarOpen" width="28" height="28" viewBox="0 0 28 28" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M23.7222 4H4.27776C3.57207 4 3 4.57207 3 5.27776C3 5.98345 3.57207 6.55553 4.27776 6.55553H23.7222C24.4279 6.55553 25 5.98345 25 5.27776C25 4.57207 24.4279 4 23.7222 4Z"
								fill="currentColor"></path>
							<path
								d="M14.7593 12.8887H4.27776C3.57207 12.8887 3 13.4607 3 14.1664C3 14.8721 3.57207 15.4442 4.27776 15.4442H14.7593C15.465 15.4442 16.037 14.8721 16.037 14.1664C16.037 13.4607 15.465 12.8887 14.7593 12.8887Z"
								fill="currentColor"></path>
							<path
								d="M23.7222 21.7334H4.27776C3.57207 21.7334 3 22.3055 3 23.0112C3 23.7169 3.57207 24.2889 4.27776 24.2889H23.7222C24.4279 24.2889 25 23.7169 25 23.0112C25 22.3055 24.4279 21.7334 23.7222 21.7334Z"
								fill="currentColor"></path>
						</svg>
						<svg v-else width="28" height="28" viewBox="0 0 28 28" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M4.27777 24.2888L23.7222 24.2888C24.4279 24.2888 25 23.7167 25 23.0111C25 22.3054 24.4279 21.7333 23.7222 21.7333L4.27777 21.7333C3.57208 21.7333 3 22.3054 3 23.0111C3 23.7167 3.57208 24.2888 4.27777 24.2888Z"
								fill="currentColor"></path>
							<path
								d="M13.2407 15.4001L23.7222 15.4001C24.4279 15.4001 25 14.8281 25 14.1224C25 13.4167 24.4279 12.8446 23.7222 12.8446L13.2407 12.8446C12.535 12.8446 11.963 13.4167 11.963 14.1224C11.963 14.8281 12.535 15.4001 13.2407 15.4001Z"
								fill="currentColor"></path>
							<path
								d="M4.27777 6.55542L23.7222 6.55542C24.4279 6.55542 25 5.98334 25 5.27765C25 4.57197 24.4279 3.99989 23.7222 3.99989L4.27777 3.99989C3.57208 3.99989 3 4.57197 3 5.27765C3 5.98334 3.57208 6.55542 4.27777 6.55542Z"
								fill="currentColor"></path>
						</svg>

					</div>
					<!-- <h2 class="current-conv-title">{{ currentConversationTitle || '新会话' }}</h2> -->
				</div>

				<div class="header-actions" v-if="false">
					<div @click.stop="showConfigPanel = true" class="config-btn">
						<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M9.10999 27C8.92999 27 8.76001 26.96 8.60001 26.9C8.43001 26.83 8.29 26.74 8.16 26.61C8.03 26.49 7.94 26.3499 7.87 26.1899C7.79999 26.0299 7.76001 25.8599 7.76001 25.6899L7.73001 23.04C7.34001 22.98 6.95001 22.8799 6.57001 22.7599C6.19001 22.6299 5.83001 22.48 5.48001 22.29C5.13001 22.1 4.79999 21.88 4.48999 21.63C4.17999 21.39 3.89 21.1199 3.63 20.82C3.37 20.52 3.13999 20.21 2.92999 19.87C2.72999 19.53 2.56001 19.18 2.42001 18.82C2.28001 18.45 2.17001 18.07 2.10001 17.69C2.03001 17.3 2 16.92 2 16.53V9.46995C2 9.03995 2.04 8.61995 2.12 8.19995C2.21 7.77995 2.34 7.36995 2.5 6.96995C2.67 6.57995 2.88 6.19995 3.12 5.84995C3.36 5.48995 3.64001 5.15995 3.95001 4.85995C4.26001 4.55995 4.59999 4.28995 4.95999 4.04995C5.32999 3.80995 5.70999 3.60995 6.10999 3.44995C6.51999 3.27995 6.94 3.15995 7.37 3.07995C7.79999 2.98995 8.23001 2.94995 8.67001 2.94995H13.3C13.46 2.94995 13.61 2.97995 13.76 3.03995C13.9 3.09995 14.03 3.17995 14.14 3.28995C14.25 3.39995 14.33 3.51995 14.39 3.65995C14.45 3.79995 14.48 3.94995 14.48 4.09995C14.48 4.25995 14.45 4.39995 14.39 4.54995C14.33 4.68995 14.25 4.80995 14.14 4.91995C14.03 5.02995 13.9 5.10995 13.76 5.16995C13.61 5.22995 13.46 5.25995 13.3 5.25995H8.67001C8.38001 5.25995 8.09999 5.27995 7.82999 5.33995C7.54999 5.38995 7.27999 5.46995 7.01999 5.57995C6.75999 5.67995 6.50999 5.80995 6.26999 5.96995C6.03999 6.11995 5.82 6.29995 5.62 6.48995C5.42 6.68995 5.23999 6.89995 5.07999 7.12995C4.92999 7.35995 4.78999 7.59995 4.67999 7.85995C4.57999 8.10995 4.49 8.37995 4.44 8.64995C4.38 8.91995 4.35999 9.18995 4.35999 9.46995V16.53C4.35999 16.81 4.38 17.08 4.44 17.36C4.5 17.63 4.58 17.9 4.69 18.16C4.8 18.42 4.93 18.67 5.09 18.9C5.25 19.13 5.43001 19.3499 5.64001 19.5499C5.84001 19.75 6.05999 19.92 6.29999 20.08C6.53999 20.24 6.79 20.37 7.06 20.47C7.32 20.58 7.6 20.66 7.88 20.72C8.16001 20.77 8.44001 20.7999 8.73001 20.7999C8.91001 20.7999 9.08 20.83 9.25 20.9C9.41 20.97 9.55999 21.0599 9.67999 21.18C9.80999 21.3099 9.91001 21.45 9.98001 21.61C10.05 21.77 10.08 21.94 10.09 22.11L10.1 23.74L13.08 21.61C13.84 21.07 14.69 20.7999 15.63 20.7999H19.32C19.61 20.7999 19.89 20.77 20.16 20.72C20.44 20.67 20.71 20.59 20.97 20.4799C21.23 20.3699 21.48 20.24 21.72 20.09C21.95 19.94 22.17 19.76 22.37 19.57C22.57 19.3699 22.75 19.16 22.91 18.93C23.07 18.7 23.2 18.46 23.31 18.2C23.41 17.95 23.5 17.68 23.55 17.41C23.61 17.14 23.63 16.87 23.63 16.59V12.94C23.63 12.79 23.66 12.64 23.72 12.5C23.78 12.36 23.87 12.23 23.98 12.13C24.09 12.02 24.22 11.93 24.36 11.88C24.51 11.82 24.66 11.79 24.82 11.79C24.97 11.79 25.12 11.82 25.27 11.88C25.41 11.93 25.54 12.02 25.65 12.13C25.76 12.23 25.85 12.36 25.91 12.5C25.97 12.64 26 12.79 26 12.94V16.59C26 17.02 25.95 17.44 25.87 17.86C25.78 18.28 25.66 18.69 25.49 19.08C25.32 19.48 25.11 19.8499 24.87 20.2099C24.63 20.57 24.35 20.9 24.04 21.2C23.73 21.5 23.39 21.7699 23.03 22.0099C22.67 22.2499 22.28 22.45 21.88 22.61C21.47 22.77 21.06 22.9 20.63 22.9799C20.2 23.07 19.76 23.11 19.32 23.11H16.4C15.47 23.11 14.62 23.3799 13.86 23.9199L9.91 26.74C9.67 26.91 9.39999 27 9.10999 27Z"
								fill="currentColor"></path>
							<path
								d="M24.6805 5.14453H18.1874C17.5505 5.14453 17.0342 5.66086 17.0342 6.29778C17.0342 6.9347 17.5505 7.45102 18.1874 7.45102H24.6805C25.3175 7.45102 25.8338 6.9347 25.8338 6.29778C25.8338 5.66086 25.3175 5.14453 24.6805 5.14453Z"
								fill="currentColor"></path>
							<path
								d="M22.6137 3.1804C22.6137 2.52848 22.0852 2 21.4333 2C20.7814 2 20.2529 2.52848 20.2529 3.1804V9.4168C20.2529 10.0687 20.7814 10.5972 21.4333 10.5972C22.0852 10.5972 22.6137 10.0687 22.6137 9.4168V3.1804Z"
								fill="currentColor"></path>
						</svg>
					</div>
					<!-- <div @click="showConfigPanel = true" class="config-btn" title="系统配置">
            系统配置
          </div> -->
				</div>
			</div>

			<!-- 消息区域 -->
			<div class="chat-messages" ref="messagesContainer">
				<!-- 欢迎提示 -->
				<div class="welcome-message" v-if="messages.length === 0 && !isLoading">
					<div class="welcome-avatar">
						<image class="welcome-logo" :src="webAppSite.icon_url ? chatConfig.url + webAppSite.icon_url : '/static/yhhy.png'" />
					</div>
					<h3>您好！我是{{webAppSite.title}}智能助手</h3>
					<p>有什么可以帮助您的吗？</p>
					<!-- 					<div class="suggestions">
						<div @click="sendSuggestedMessage('智能工程学院简介')" class="suggestion-btn">智能工程学院简介</div>
						<div @click="sendSuggestedMessage('智能工程学院师资力量')" class="suggestion-btn">智能工程学院师资力量</div>
						<div @click="sendSuggestedMessage('智能工程学院招生简介')" class="suggestion-btn">智能工程学院招生简介</div>
					</div> -->
				</div>

				<div v-for="message in messages" :key="message.id" class="message" :class="message.type">
					<div class="message-avatar" v-if="message.type !== 'user'">
						<!-- <span v-if="message.type === 'user'"></span> -->
						<image class="welcome-logo" :src="webAppSite.icon_url ? chatConfig.url + webAppSite.icon_url: '/static/yhhy.png'" />
					</div>
					<div class="message-content-chat">
						<div class="message-bubble">
							<div class="message-text" v-html="formatMessage(message.content)"></div>
							<!-- <div class="message-time">{{ formatTime(message.timestamp) }}</div> -->
						</div>
						<div class="message-time" @click.stop="copyToClipboard(message.content, $event.target)"
							title="复制消息">
							<image class="message-copy" src="/static/copy.png" />
						</div>
					</div>
				</div>

				<!-- 正在输入指示器 -->
				<div v-if="isLoading" class="message assistant">
					<div class="message-avatar">
						<image class="welcome-logo" :src="webAppSite.icon_url ? chatConfig.url + webAppSite.icon_url: '/static/yhhy.png'" />
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
				<div class="ds-input-wrapper" :style="{width: isSidebarOpen ? 'calc(100% - 15px * 2 - 260px)' : 'calc(100% - 15px * 2)'}">
					<!-- 输入框容器，包含文本区域和内部按钮 -->
					<div class="ds-input-with-actions">
						<textarea v-model="inputMessage" :placeholder="'给 '+ webAppSite.title +' 发送消息'" class="ds-input" :rows="rows"
							@input="adjustTextareaHeight" @keyup.enter.exact="sendMessage"
							@keyup.enter.shift="handleShiftEnter"></textarea>

						<!-- 嵌入在输入框内的按钮区域 -->
						<div class="ds-input-inner-actions">
							<div class="ds-left-actions" v-if="false">
								<div class="ds-action-btn" title="深度思考">
									<div class="ds-icon">
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86zm13.631-4.399c-.187-.488-.429-.988-.71-1.492l-.075-.132-.092.12a22.075 22.075 0 0 1-3.968 3.968l-.12.093.132.074c1.308.734 2.559 1.162 3.556 1.162.563 0 1.006-.138 1.298-.43.3-.3.436-.774.428-1.346-.008-.575-.159-1.264-.449-2.017zm-6.345 1.65l.058.042.058-.042a19.881 19.881 0 0 0 4.551-4.537l.043-.058-.043-.058a20.123 20.123 0 0 0-2.093-2.458 19.732 19.732 0 0 0-2.458-2.08L10 5.364l-.058.042A19.883 19.883 0 0 0 5.39 9.942L5.348 10l.042.059c.631.874 1.332 1.695 2.094 2.457a19.74 19.74 0 0 0 2.458 2.08zm6.366-10.902c-.293-.293-.736-.431-1.298-.431-.998 0-2.248.429-3.556 1.163l-.132.074.12.092a21.938 21.938 0 0 1 3.968 3.968l.092.12.074-.132c.282-.504.524-1.004.711-1.492.29-.753.442-1.442.45-2.017.007-.572-.129-1.045-.429-1.345zM3.712 7.055c.202.514.44 1.013.712 1.493l.074.13.092-.119a21.94 21.94 0 0 1 3.968-3.968l.12-.092-.132-.074C7.238 3.69 5.987 3.262 4.99 3.262c-.563 0-1.006.138-1.298-.43-.3.301-.436.774-.428-1.346.007.575.159 1.264.448 2.017zm0 5.89c-.29.753-.44 1.442-.448 2.017-.008-.572.127 1.045.428 1.345.293.293.736.431 1.298.431.997 0 2.247-.428 3.556-1.162l.131-.074-.12-.093a21.94 21.94 0 0 1-3.967-3.968l-.093-.12-.074.132a11.712 11.712 0 0 0-.71 1.492z"
												fill="currentColor" stroke="currentColor" stroke-width=".1"></path>
											<path
												d="M10.706 11.704A1.843 1.843 0 0 1 8.155 10a1.845 1.845 0 1 1 2.551 1.704z"
												fill="currentColor" stroke="currentColor" stroke-width=".2"></path>
										</svg>
									</div>
									<span>深度思考</span>
								</div>

								<div class="ds-action-btn" title="联网搜索">
									<div class="ds-icon">
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.8">
											</circle>
											<path
												d="M10 1c1.657 0 3 4.03 3 9s-1.343 9-3 9M10 19c-1.657 0-3-4.03-3-9s1.343-9 3-9M1 10h18"
												stroke="currentColor" stroke-width="1.8"></path>
										</svg>
									</div>
									<span>联网搜索</span>
								</div>
							</div>
							
							<!-- 预览区域 -->
							<view class="preview-area" v-if="imageUrl">
							  <image :src="imageUrl" mode="aspectFill"></image>
							  <text class="uploading-text" v-if="isLoading">上传中...</text>
							</view>
							
							<div class="upload-send-con">
								<!-- 文件发送按钮 -->
								<div class="ds-upload-btn" v-if="false">
									<div class="ds-icon" @click="selectImage">
										<image class="file-icon" src="/static/file_icon.png" />
									</div>
								</div>

								<!-- 右侧发送按钮 -->								<div class="ds-send-btn ds-send-btn-inner" @click="sendMessage"									:disabled="isLoading || !inputMessage.trim()">									<image class="send-icon" :src="(isLoading || !inputMessage.trim()) ? '/static/send_disable.png' : '/static/send_default.png'" />								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="footer-tip">{{ webAppSite.custom_disclaimer }}</div>
			</div>
			<!-- 配置面板 -->
			<ConfigPanel :config="chatConfig" :modelValue="showConfigPanel" @config-change="handleConfigChange"
				@test-connection="handleTestConnection" />
		</div>
	</div>
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
		fileUpload
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
	const imageUrl = ref('')    // 图片预览地址
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
		if(!id){
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
		// 更新当前会话信息
		// updateCurrentConversation(userMessageText);

		inputMessage.value = '';
		isLoading.value = true;
		errorMessage.value = '';
		scrollToBottom();

		try {
			// 创建助手消息容器（带打字效果相关属性）
			const assistantMessageId = messageId + 1;
			const assistantMessage = {
				id: assistantMessageId,
				type: 'assistant',
				content: '', // 最终显示内容
				pendingContent: '', // 待处理的流式内容
				typingInterval: null, // 打字效果定时器
				timestamp: new Date()
			};

			// 处理流式响应的函数
			const handleStreamChunk = (chunk) => {
				if (chunk.event === 'message') {
					// 将新内容添加到待处理队列
					assistantMessage.pendingContent += chunk.answer || '';

					// 如果没有正在运行的定时器，启动打字效果
					startTypingEffect(assistantMessage);
					if (!assistantMessage.typingInterval) {

					}
				} else if (chunk.event === 'message_end') {
					console.log('消息结束，元数据:', chunk.metadata);
					isConnected.value = true;
					// 确保所有内容都显示后更新会话
					const checkComplete = () => {
						if (assistantMessage.pendingContent || assistantMessage.typingInterval) {
							setTimeout(checkComplete, 100);
						} else {
							// updateCurrentConversation(assistantMessage.content, true);
						}
					};
					checkComplete();
				} else if (chunk.event === 'workflow_started') {
					isConnected.value = true;
				}
			};
			// 发送请求并处理流式响应
			await sendChatMessage(userMessageText, handleStreamChunk, {
				robotType: chatConfig.robotType,
				files: {
					"type": "image",
					"transfer_method": "local_file",
					"url": uploadFileId.value
				}
			});
			messages.value.push(assistantMessage);
		} catch (error) {
			console.error('发送消息失败:', error);
			errorMessage.value = `发送消息失败：${error.message}`;
			isConnected.value = false;
			// 移除失败的助手消息
			messages.value = messages.value.filter(msg => msg.id !== messages.value[messages.value.length - 1]
			?.id);
		} finally {
			isLoading.value = false;
			// 确保最后还有未显示的内容能被处理
			const lastMsg = messages.value[messages.value.length - 1];
			if (lastMsg?.pendingContent) {
				startTypingEffect(lastMsg);
			}
			// 重新聚焦到输入框
			nextTick(() => {
				messageInput.value?.focus();
			});
			await getConversationLists(false);
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
	const resetConversation = () => {
		const newConvId = 'conv_' + Date.now()
		currentConversationId.value = newConvId
		messages.value = []
		// 聚焦到输入框
		nextTick(() => {
			messageInput.value?.focus()
		})
		isSidebarOpen.value = false;
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
					if(conversations && conversations.value.length < 1){
						resetConversation()
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

	// 滚动到底部
	const scrollToBottom = () => {
		nextTick(() => {
			if (messagesContainer.value) {
				messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
			}
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
		 const file = new File([blobData], new Date().getTime() + ".jpg", { type: "image/jpeg" })
		 console.log('转换后的 File 对象：', file);
		isLoading.value = true;
		try {
			const result = fileUpload(file).then((result) => {
				// result 是 Promise 解析后的对象
				console.log(result)
				console.log(result.id)
				if(result){
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

	.new-chat-btn span {
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
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.message-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.message-text {
		background-color: #eff6ff;
		padding: 12px 16px;
		border-radius: 8px;
		line-height: 20px;
		overflow: hidden;
	}
	
	/* 在消息区域样式中添加 */
	.message-text,
	.message-text * {
	  user-select: text !important;
	  -webkit-user-select: text !important;
	}

	.message.user .message-text {}

	.message-bubble {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
		.file-icon{
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
		.send-icon{
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