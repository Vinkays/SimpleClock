<template>
    <div class="rightMenus">
        <div class="menu">
        <div class="menu-item" @click="toggleLock">
            <span v-if="!isLocked">锁定</span>
            <span v-else>解除锁定</span>
        </div>
        <div class="menu-item" @click="toggleSetTop">
            <span v-if="!isAllwaysOnTop">置顶</span>
            <span v-else>移除置顶</span>
        </div>
        <div class="menu-item" @click="setAutoLaunch">
            <span v-if="!isAutoLaunch">设置开机自启动</span>
            <span v-else>移除开机自启动</span>
        </div>
        <div class="menu-item" @click="quitApp">
            退出程序
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const isLocked = ref(false);
const isAllwaysOnTop = ref(false);
const isAutoLaunch = ref(false);

// 切换锁定
function toggleLock() {
  isLocked.value = !isLocked.value;
  window.electronApi.setWinLocked(isLocked.value);
}

// 切换置顶
function toggleSetTop() {
  isAllwaysOnTop.value = !isAllwaysOnTop.value;
  window.electronApi.setAlwaysOnTop(isAllwaysOnTop.value);
}

// 退出程序
function quitApp() {
  window.electronApi.quitApp();
}

// 获取开机自启动状态
function getAutoLaunch() {
    window.electronApi.getAutoLaunch().then(({isAutoLaunch: autoLaunch})=>{
        isAutoLaunch.value = autoLaunch
    });
}

// 设置开机自启动
function setAutoLaunch() {
    const autoLaunch = !isAutoLaunch.value;
    window.electronApi.setAutoLaunch(autoLaunch).then(({success})=>{
        window.electronApi.setNotification({
            title: '提示',
            body: success ? autoLaunch ? '设置开机自启动成功' : '移除开机自启动成功' : '设置开机自启动失败'
        });
    })
    .catch((err: any)=>{        
        window.electronApi.setNotification({
            title: '提示',
            body: err?.message || '设置开机自启动失败'
        });
    })
    .finally(()=>{
        getAutoLaunch()
    });
}

onMounted(() => {
    window.electronApi.getWinLocked().then(({isLocked: locked})=>{
        isLocked.value = locked;
    });
    window.electronApi.getAlwaysOnTop().then(({isTop})=>{
        isAllwaysOnTop.value = isTop;
    });
    getAutoLaunch()
})
</script>

<style scoped lang="scss">
.rightMenus {
    position: absolute;
    width:100%;
    display: flex;
    justify-items: center;
    align-items: center;
    .menu {
        width:100%;
        background-color: #fff;
        border-radius: 4px;
        font-size: 0.8em;
        .menu-item {
        padding: 4px 6px;
        cursor: pointer;
        &:hover {
            background-color: #f5f5f5;
        }
        }
    }
}
</style>
