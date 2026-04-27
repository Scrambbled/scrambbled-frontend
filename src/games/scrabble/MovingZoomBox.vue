<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';

const moveZoomBoxRef = useTemplateRef("move-zoom-box")

interface Pos{ x: number, y: number }
const pEvent2Pos = (e: PointerEvent) => ({x: e.clientX, y: e.clientY} as Pos)

const pointerState = {
    basePos: null as (null | Pos),
    currentPos: ref<null | Pos>(null),
    endPos: null,

    isDown: false,

    currentZoom: ref(1),
}

const endPointerAction = (e: PointerEvent) => {
    pointerState.isDown = false
}

const pointerDown = (e: PointerEvent) => {
    pointerState.isDown = true
    pointerState.basePos = pEvent2Pos(e)
}

const pointerUp = (e: PointerEvent) => {
    console.log("pointer up");
    endPointerAction(e)
}

const pointerCancel = (e: PointerEvent) => {
    console.log("pointer cancelled");
    // endPointerAction(e)
}

const pointerLeave = (e: PointerEvent) => {
    console.log("pointer left");
    endPointerAction(e)
}

const pointerOut = (e: PointerEvent) => {
    // Skip function if pointers is out of anything else than zoom-move-box
    if(moveZoomBoxRef.value === null || e.target !== moveZoomBoxRef.value){
        return
    }

    endPointerAction(e)
}

const pointerMove = (e: PointerEvent) => {
    moveTo(pEvent2Pos(e))
}

const moveTo = (pos: Pos) => {
    // console.log("Pre move: ", pointerState);
    
    if(!pointerState.isDown || pointerState.basePos === null || moveZoomBoxRef.value === null){
        return
    }

    const basePos = pointerState.basePos
    // Calculate movement relative to basePos
    let relativeMove = {x: pos.x - basePos.x, y: pos.y - basePos.y} as Pos
    // Set new base pos
    pointerState.basePos = pos

    console.log("Moving by: ", relativeMove);
    

    if(pointerState.currentPos.value === null){
        // As ref was checked for null before, it can be cast
        const element = moveZoomBoxRef.value as unknown as HTMLDivElement
        const boundingBox = element.getBoundingClientRect()

        // Set position to center of the screen
        pointerState.currentPos.value = {
            x: boundingBox.x + boundingBox.width / 2,
            y: boundingBox.y + boundingBox.height / 2,
        }
    }


    const currentPos = pointerState.currentPos.value
    pointerState.currentPos.value = {x: currentPos.x + relativeMove.x, y: currentPos.y + relativeMove.y}
}

const onWheel = (e: WheelEvent) => {
    const multiplier = 0.001;

    zoom(e.deltaY * multiplier)
}

const zoom = (by: number) => {
    pointerState.currentZoom.value = Math.min(2, Math.max(0.5, pointerState.currentZoom.value + by))
}

const cssVars = ref({
    "--x": "50%",
    "--y": "50%",
    "--zoom": 1,
})

watch(pointerState.currentPos, () => {
    cssVars.value['--x'] = pointerState.currentPos.value !== null ? `${pointerState.currentPos.value.x}px` : '50%'
    cssVars.value['--y'] = pointerState.currentPos.value !== null ? `${pointerState.currentPos.value.y}px` : '50%'
})

watch(pointerState.currentZoom, () => {
    cssVars.value['--zoom'] = pointerState.currentZoom.value
})

</script>

<template>
    <div class="move-zoom-box" ref="move-zoom-box"
        @pointerdown="pointerDown"
        @pointercancel="pointerCancel"
        @pointerup="pointerUp"
        @pointerleave="pointerLeave"
        @pointerout="pointerOut"
        @pointermove="pointerMove"
        @wheel="onWheel"

        :style="cssVars"
    >
        <div class="move-zoom-box__frame">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.move-zoom-box{
    --x: 50%;
    --y: 50%;
    --zoom: 1;

    touch-action: pan-x pan-y pinch-zoom;
    // touch-action: manipulation;
    // touch-action: none;

    position: relative;

    cursor: move;

    width: 100%;
    height: 100%;

    overflow: hidden;

    &__frame{
        position: absolute;
        top: var(--y);
        left: var(--x);
        transform: translate(-50%, -50%) scale(var(--zoom));

        transform-origin: center center;
    }
}

</style>