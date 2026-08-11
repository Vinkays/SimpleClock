<script setup lang="ts">
import { ref, onUnmounted, computed } from "vue";
import {
    removeWindow,
    beginMove,
    endMove,
    getWindowPosition,
    setWindowPosition,
    getWinSize,
    onWinLocked,
    addNewWindow
} from '@/utils/window';
import { setStoreWindowStates } from '@/utils/store';

// 时间显示逻辑
const hour = ref('00');
const minute = ref('00');
const second = ref('00');
const isLocked = ref(false);
const windowSize = ref({ width: window.innerWidth, height: window.innerHeight });
const baseWidth = 350
const baseHeight = 100
const interval = 1000;
let resizeTimer: NodeJS.Timeout | null = null;

const timerStyle = computed(() => {
  const scaleX = windowSize.value.width / baseWidth
  const scaleY = windowSize.value.height / baseHeight
  return {
    transform: `scale(${scaleX}, ${scaleY})`,
  }
});

function updateTime() {
  const date = new Date();
  hour.value = `${date.getHours()}`.padStart(2, "0");
  minute.value = `${date.getMinutes()}`.padStart(2, "0");
  second.value = `${date.getSeconds()}`.padStart(2, "0");
}

updateTime();
const timer = setInterval(updateTime, 1000);

let isTracking = false
let startX = 0
let startY = 0
let windowStartX = 0
let windowStartY = 0
const resizeEdgeThreshold = 4

function isResizeHit(event: MouseEvent) {
  const width = window.innerWidth
  const height = window.innerHeight
  return (
    event.clientX <= resizeEdgeThreshold ||
    event.clientX >= width - resizeEdgeThreshold ||
    event.clientY <= resizeEdgeThreshold ||
    event.clientY >= height - resizeEdgeThreshold
  )
}

async function onMouseDown(event: MouseEvent) {
  if (isLocked.value) return
  if (isResizeHit(event)) return
  removeWindow('rightMenus')
  try {
    await beginMove()
  } catch (e) {}
  isTracking = true
  startX = event.screenX
  startY = event.screenY
  const windowPos = await getWindowPosition()
  windowStartX = windowPos.x
  windowStartY = windowPos.y

  document.addEventListener('mousemove', onGlobalMouseMove)
  document.addEventListener('mouseup', onGlobalMouseUp, true)
  window.addEventListener('blur', onGlobalMouseUp)
  event.preventDefault()
}

function onWindowResize() {
  windowSize.value = { width: window.innerWidth, height: window.innerHeight }
  storeFinalWinPositionAndSize()
}

async function onGlobalMouseMove(event: MouseEvent) {
  if (!isTracking) return
  const deltaX = event.screenX - startX
  const deltaY = event.screenY - startY
  await setWindowPosition(
    Math.round(windowStartX + deltaX),
    Math.round(windowStartY + deltaY)
  )
}

function onGlobalMouseUp() {
  stopDragging()
}

function stopDragging() {
  if (!isTracking) return
  isTracking = false
  document.removeEventListener('mousemove', onGlobalMouseMove)
  document.removeEventListener('mouseup', onGlobalMouseUp, true)
  window.removeEventListener('blur', onGlobalMouseUp)
  try {
    endMove();
    storeFinalWinPositionAndSize()
  } catch (e) {}
}

function onRightMouseDown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  removeWindow('rightMenus')
  addNewWindow('rightMenus', { x: event.screenX, y: event.screenY })
}

// 窗口大小变化时，记录窗口最后大小和位置
function storeFinalWinPositionAndSize() {
  if(resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(async ()=>{
    const { size, success } = await getWinSize()
    const windowPos = await getWindowPosition()
    if (success) {
      setStoreWindowStates({
        windowSize: size,
        windowPosition: windowPos
      })
    }
  }, interval) // 延迟触发，确保窗口大小已更新
}
// 组件卸载时清理
onUnmounted(() => {
  clearInterval(timer)
  stopDragging()
  window.removeEventListener('resize', onWindowResize)
});

// 监听锁定状态
onWinLocked((locked: boolean) => {
  isLocked.value = locked;
});

window.addEventListener('resize', onWindowResize)

</script>

<template>
  <div class="timer-container" @mousedown.left="onMouseDown" @contextmenu.prevent="onRightMouseDown">
    <div
      :class="{timer: true, 'is-locked': isLocked}"
      :style="timerStyle"
    >
      <div>{{ hour }}</div>
      <div>:</div>
      <div>{{ minute }}</div>
      <div>:</div>
      <div>{{ second }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timer-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  user-select: none;
  // background-color: rgba(128, 128, 128, 0.062);
  white-space: nowrap;
  
  &:active {
    cursor: grabbing;
  }
}
.is-locked {
  &:active {
    cursor: not-allowed;
  }
}
</style>