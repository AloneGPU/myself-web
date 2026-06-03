
// 前端 API 客户端工具
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 通用请求函数
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// 图片 API
export const imagesAPI = {
  // 搜索风景图片
  async search(query = 'landscape', page = 1, limit = 12) {
    const params = new URLSearchParams({ query, page, limit });
    return await apiRequest(`/images/search?${params}`);
  },

  // 获取随机风景图片
  async random() {
    return await apiRequest('/images/random');
  },
};

// 音乐 API
export const musicAPI = {
  async search(query = 'nature', page = 1, limit = 12) {
    const params = new URLSearchParams({ query, page, limit });
    return await apiRequest(`/music/search?${params}`);
  },
};

// 视频 API
export const videosAPI = {
  async search(query = 'landscape', page = 1, limit = 12) {
    const params = new URLSearchParams({ query, page, limit });
    return await apiRequest(`/videos/search?${params}`);
  },
};

// 健康检查
export const healthAPI = {
  async check() {
    return await apiRequest('/health');
  },
};

export default {
  images: imagesAPI,
  music: musicAPI,
  videos: videosAPI,
  health: healthAPI,
};
