<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";

// 时间显示逻辑
const hour = ref('00');
const minute = ref('00');
const second = ref('00');
const isLocked = ref(false);

// 窗口缩放逻辑
const defaultW = 350;
const defaultH = 100;
const scaleX = ref(1);
const scaleY = ref(1); 

function updateTime() {
  const date = new Date();
  hour.value = `${date.getHours()}`.padStart(2, "0");
  minute.value = `${date.getMinutes()}`.padStart(2, "0");
  second.value = `${date.getSeconds()}`.padStart(2, "0");
}

updateTime();
const timer = setInterval(updateTime, 1000);

// 窗口拖动逻辑
let startX = 0;
let startY = 0;
let isTracking = false;
let windowStartX = 0;
let windowStartY = 0;

async function onMouseDown(event: MouseEvent) {
  window.electronApi.removeWindow('rightMenus')
  startX = event.screenX; // 使用屏幕坐标
  startY = event.screenY;
  isTracking = true;
  
  // 获取窗口当前位置
  const windowPos = await window.electronApi.getWindowPosition();
  windowStartX = windowPos.x;
  windowStartY = windowPos.y;
  
  // 添加全局事件监听
  document.addEventListener('mousemove', onGlobalMouseMove);
  document.addEventListener('mouseup', onGlobalMouseUp);
  
  event.preventDefault();
}

let moveTimer: number | null = null;
async function onGlobalMouseMove(event: MouseEvent) {
  if (!isTracking) return;
  
  const currentX = event.screenX;
  const currentY = event.screenY;
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;
  
  // 计算新位置
  const newX = windowStartX + deltaX;
  const newY = windowStartY + deltaY;
  
  // 直接设置窗口位置
  await window.electronApi.setWindowPosition(newX, newY);
  moveTimer = setTimeout(async()=>{
    moveTimer && clearTimeout(moveTimer);
    const windowPos = await window.electronApi.getWindowPosition();
    window.electronApi.setStoreWindowStates({
      windowPosition: windowPos
    })
  }, 1000)
}

// 鼠标抬起事件处理逻辑
async function onGlobalMouseUp() {
  await stopDragging();
}

// 停止拖动逻辑
async function stopDragging() {
  if (isTracking) {
    isTracking = false;
    document.removeEventListener('mousemove', onGlobalMouseMove);
    document.removeEventListener('mouseup', onGlobalMouseUp);
  }
}

// 组件卸载时清理
onUnmounted(() => {
  clearInterval(timer);
  stopDragging();
});


function onRightMouseDown(event: MouseEvent) {
  event.preventDefault();
  window.electronApi?.addNewWindow('rightMenus', {x: event.screenX, y: event.screenY})
}
// 监听锁定状态
window.electronApi.onWinLocked((locked: boolean)=>{
  isLocked.value = locked;
})

onMounted(()=>{
  const w = window.innerWidth
  const h = window.innerHeight
  scaleX.value = w / defaultW
  scaleY.value = h / defaultH  
})
let resizeTimer: number | null = null;
window.addEventListener('resize', ()=>{
  const w = window.innerWidth
  const h = window.innerHeight
  scaleX.value = w / defaultW
  scaleY.value = h / defaultH
  resizeTimer = setTimeout(async()=>{
    resizeTimer && clearTimeout(resizeTimer);
    const { size, success } = await window.electronApi.getWinSize()
    const windowPos = await window.electronApi.getWindowPosition();
    if(success){
      window.electronApi.setStoreWindowStates({
        windowSize: size,
        windowPosition: windowPos
      })
    }
  }, 1000)
})

</script>

<template>
  <div 
    :class="{timer: true, 'is-locked': isLocked}" 
    :style="{transform: `scale(${scaleX},${scaleY})`}"
    @mousedown.left="onMouseDown"
    @mousedown.right="onRightMouseDown"
  >
    <div>{{ hour }}</div>
    <div>:</div>
    <div>{{ minute }}</div>
    <div>:</div>
    <div>{{ second }}</div>
  </div>
</template>

<style scoped lang="scss">
.timer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  user-select: none;
  background-color: rgba(128, 128, 128, 0.062);
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