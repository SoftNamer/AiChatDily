export default {
  server: {
    port: 5173, // 使用非特权端口（如 5173）
    strictPort: true, // 端口被占用时直接退出，不自动尝试其他端口
    proxy: {
	  '/v1': {
		target: 'http://localhost',
		changeOrigin: true,
		rewrite: (path) => {
		  const newPath = path.replace(/^\/v1/, '/v1');
		  c(`请求路径转换: ${path} -> ${newPath}`);
		  return newPath;
		},
		configure: (proxy, options) => {
		  proxy.on('proxyReq', (proxyReq, req, res) => {
			console.log(`转发请求到: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
		  });
		  proxy.on('proxyRes', (proxyRes, req, res) => {
			console.log(`收到响应状态码: ${proxyRes.statusCode}`);
		  });
		}
	  }
	}
  }
}