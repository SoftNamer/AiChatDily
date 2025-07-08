#!/bin/bash

# Dify Vue3 智能客服系统部署脚本

echo "🚀 开始部署 Dify Vue3 智能客服系统..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node -v)
echo "当前 Node.js 版本: $node_version"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于 dist/ 目录"
    
    # 显示构建文件大小
    echo "📊 构建文件信息:"
    du -sh dist/*
    
    echo "🎉 部署完成！"
    echo "💡 您可以将 dist/ 目录部署到任何静态文件服务器"
    echo "🌐 或者运行 'npm run preview' 预览构建结果"
else
    echo "❌ 构建失败！请检查错误信息"
    exit 1
fi 