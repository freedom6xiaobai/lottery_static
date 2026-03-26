<template>
  <div id="app">
    <!-- 如果未登录，显示登录页面 -->
    <LoginView v-if="!authStore.isAuthenticated" />

    <!-- 如果已登录，显示主界面 -->
    <div v-else class="main-layout">
      <!-- 头部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <h3>RBAC 管理系统</h3>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="authStore.user?.avatar">
                {{ authStore.user?.username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <span class="username">{{ authStore.user?.username }}</span>
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主体内容区域 -->
      <el-container class="main-container">
        <!-- 侧边菜单 -->
        <el-aside width="200px" class="sidebar">
          <el-menu
            :default-active="$route.path"
            class="sidebar-menu"
            router
            unique-opened
          >
            <el-menu-item index="/">
              <el-icon><HomeFilled /></el-icon>
              <span>首页</span>
            </el-menu-item>

            <!-- 动态菜单 -->
            <template v-for="menu in authStore.menus" :key="menu.id">
              <el-sub-menu
                v-if="menu.children && menu.children.length > 0"
                :index="menu.path"
              >
                <template #title>
                  <el-icon v-if="menu.icon">
                    <component :is="menu.icon" />
                  </el-icon>
                  <span>{{ menu.name }}</span>
                </template>
                <el-menu-item
                  v-for="child in menu.children"
                  :key="child.id"
                  :index="child.path"
                >
                  <el-icon v-if="child.icon">
                    <component :is="child.icon" />
                  </el-icon>
                  <span>{{ child.name }}</span>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item v-else :index="menu.path">
                <el-icon v-if="menu.icon">
                  <component :is="menu.icon" />
                </el-icon>
                <span>{{ menu.name }}</span>
              </el-menu-item>
            </template>

            <!-- 静态菜单项（如果动态菜单为空） -->
            <template v-if="authStore.menus.length === 0">
              <el-menu-item index="/users" v-if="authStore.hasPermission('user:list')">
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </el-menu-item>
              <el-menu-item index="/roles" v-if="authStore.hasPermission('role:list')">
                <el-icon><Star /></el-icon>
                <span>角色管理</span>
              </el-menu-item>
              <el-menu-item index="/menus" v-if="authStore.hasPermission('menu:list')">
                <el-icon><Menu /></el-icon>
                <span>菜单管理</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>

        <!-- 主要内容区域 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import LoginView from './views/Login.vue'
import {
  HomeFilled,
  User,
  Star,
  Menu,
  ArrowDown
} from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    LoginView,
    HomeFilled,
    User,
    Star,
    Menu,
    ArrowDown
  },
  setup() {
    const authStore = useAuthStore()

    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          // TODO: 实现个人资料页面
          console.log('个人资料')
          break
        case 'settings':
          // TODO: 实现设置页面
          console.log('设置')
          break
        case 'logout':
          authStore.logout()
          break
      }
    }

    onMounted(() => {
      // 初始化认证状态
      authStore.initializeAuth()
    })

    return {
      authStore,
      handleCommand
    }
  }
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主布局 */
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部导航栏 */
.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h3 {
  color: #409EFF;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #303133;
}

/* 主体容器 */
.main-container {
  flex: 1;
  display: flex;
}

/* 侧边栏 */
.sidebar {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

/* 主要内容区域 */
.main-content {
  background-color: #f5f5f5;
  padding: 0;
  overflow-y: auto;
}

/* Element Plus 自定义样式 */
.el-menu-item.is-active {
  background-color: #ecf5ff !important;
  color: #409EFF !important;
}

.el-menu-item:hover {
  background-color: #ecf5ff !important;
}

.el-sub-menu__title:hover {
  background-color: #ecf5ff !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 10px;
  }

  .header-left h3 {
    font-size: 16px;
  }

  .sidebar {
    width: 160px !important;
  }

  .main-content {
    padding: 10px;
  }
}
</style>
