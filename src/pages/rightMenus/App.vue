<template>
    <div class="rightMenus" :style="{'--bg-color': bgColor, '--color': textColor}">
        <div class="menu">
            <div class="menu-item no-cursor">
                <label for="textColor">文字颜色</label>
                <input :title="textColor" type="color" id="textColor" v-model="textColor" @change="toSetAppearance">
            </div>
            <div class="menu-item no-cursor">
                <label for="bgColor">背景色</label>
                <input :title="bgColor" type="color" id="bgColor" v-model="bgColor" @change="toSetAppearance">
            </div>
            <div class="menu-item" @click="toggleLock">
                <span v-if="!isLocked">锁定</span>
                <span v-else>解除锁定</span>
            </div>
            <div class="menu-item" @click="toggleSetTop">
                <span v-if="!isAllwaysOnTop">置顶</span>
                <span v-else>移除置顶</span>
            </div>
            <div
                v-if="isAutoLaunchSupported"
                class="menu-item"
                @click="doSetAutoLaunch"
            >
                <span v-if="!isAutoLaunch">设置开机自启动</span>
                <span v-else>移除开机自启动</span>
            </div>
            <div
                v-if="isAppUpdatePending"
                class="menu-item"
                @click="doQuitAndInstall"
            >
            版本更新
            </div>
            <div class="menu-item" @click="quitApp">
                退出程序
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPlatform, isUpdatePending,  quitApp, getAppearance, setAppearance } from '@/utils/app';
import { 
    setWinLocked, 
    getWinLocked, 
    setAlwaysOnTop, 
    getAlwaysOnTop,
} from '@/utils/window';
import { setAutoLaunch, getAutoLaunch } from '@/utils/autoLaunch';
import { setNotification } from '@/utils/notification';
import { onUpdatePending } from '@/utils/event'

const isLocked = ref(false);
const isAllwaysOnTop = ref(false);
const isAutoLaunch = ref(false);
const isAutoLaunchSupported = ref(false);
const isAppUpdatePending = ref(false);
const bgColor = ref('#fff');
const textColor = ref('#000');

getAppearance().then(({success, appearance}) => {
    if (success) {
        bgColor.value = appearance.bgColor;
        textColor.value = appearance.textColor;
    }
})
// 设置外观
function toSetAppearance() {
    setAppearance({ bgColor: bgColor.value, textColor: textColor.value });
}

// 切换锁定
function toggleLock() {
  isLocked.value = !isLocked.value;
  setWinLocked(isLocked.value);
}

// 切换置顶
function toggleSetTop() {
  isAllwaysOnTop.value = !isAllwaysOnTop.value;
  setAlwaysOnTop(isAllwaysOnTop.value);
}


// 立即重启以完成版本更新（仅在有待安装更新时显示菜单项）
function doQuitAndInstall() {
  window.electronApi.app.quitAndInstall();
}

// 获取开机自启动状态
function doGetAutoLaunch() {
    getAutoLaunch().then((res) => {
        if (res.success) {
            isAutoLaunch.value = !!res.isAutoLaunch;
        }
    });
}

// 设置开机自启动
function doSetAutoLaunch() {
    const autoLaunch = !isAutoLaunch.value;
    setAutoLaunch(autoLaunch).then((res) => {
        const body = res.success
            ? (autoLaunch ? '设置开机自启动成功' : '移除开机自启动成功')
            : (res.message || '设置开机自启动失败');
        setNotification({ title: '提示', body });
    })
    .catch((err: unknown) => {
        setNotification({
            title: '提示',
            body: (err instanceof Error ? err.message : String(err)) || '设置开机自启动失败',
        });
    })
    .finally(() => {
        doGetAutoLaunch();
    });
}

onMounted(async () => {
    // 根据平台控制开机自启菜单（Windows / macOS / Linux 支持）
    try {
        const { success, platform } = await getPlatform();
        if (success) {
            isAutoLaunchSupported.value = ['win32', 'darwin', 'linux'].includes(platform);
        }
    } catch {
        isAutoLaunchSupported.value = false;
    }
    getWinLocked().then((res) => {
        if (res.success) isLocked.value = res.isLocked;
    });
    getAlwaysOnTop().then((res) => {
        if (res.success) isAllwaysOnTop.value = res.isTop;
    });
    if (isAutoLaunchSupported.value) {
        doGetAutoLaunch();
    }
    // 是否有已下载待安装的更新（显示「版本更新」菜单项）
    isUpdatePending().then((pending) => {
        isAppUpdatePending.value = !!pending;
    });
    onUpdatePending(() => {
        isAppUpdatePending.value = true;
    });
})
</script>

<style scoped lang="scss">
.rightMenus {
    --test: #f2c0c0;
    position: absolute;
    width:100%;
    display: flex;
    justify-items: center;
    align-items: center;
    height: 100%;
    background-color: var(--bg-color);
    color: var(--color);
    .menu {
        width:100%;
        height: 100%;
        overflow-y: auto;
        padding: 8px 0;
        border-radius: 4px;
        font-size: 0.8em;
        .menu-item {
            padding: 4px 6px;
            cursor: pointer;
            &:hover {
                background-color: color-mix(in srgb, var(--bg-color), #aaa 20%);
            }
            label,input:hover {
                cursor: pointer;
            }
        }
        .no-cursor {
            cursor: default;
        }
    }
}
</style>
