<template>
  <view class="modal-mask" :class="{ 'visible': props.visible }">
    <view class="modal-container">
      <view class="modal-header">
        <text class="modal-title">确认删除</text>
        <button @click="cancel" class="close-btn">
          <i class="fa fa-times"></i>
        </button>
      </view>
      <view class="modal-content">
        <text class="modal-message">确定要删除这个会话吗？此操作不可撤销。</text>
      </view>
      <view class="modal-footer">
        <button @click="cancel" class="cancel-btn">取消</button>
        <button @click="confirm" class="confirm-btn">
          <i class="fa fa-trash mr-1"></i> 删除
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emits('confirm')
}

const cancel = () => {
  emits('cancel')
}
</script>

<style scoped>
/* 遮罩层样式 */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.modal-mask.visible {
  opacity: 1;
  pointer-events: auto;
}

/* 弹窗容器样式 */
.modal-container {
  width: 90%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
  transition: all 0.3s ease;
  opacity: 0;
}

.modal-mask.visible .modal-container {
  transform: scale(1);
  opacity: 1;
}

/* 弹窗头部样式 */
.modal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
}

.close-btn:hover {
  color: #666;
}

/* 弹窗内容样式 */
.modal-content {
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.modal-message {
  line-height: 1.5;
}

/* 弹窗底部样式 */
.modal-footer {
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
	width: 60px;
	height: 30px;
	line-height: 30px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  border: 1px solid #ddd;
  background-color: #fff;
  color: #666;
}

.cancel-btn:hover {
  background-color: #f8f8f8;
}

.confirm-btn {
  border: none;
  background-color: #f56c6c;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #f78989;
}

/* 图标间距 */
.mr-1 {
  margin-right: 4px;
}
</style>