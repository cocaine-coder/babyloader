<template>
  <div class="gizmo-viewport">
    <svg :width="size" :height="size">
      <g :transform="`translate(${halfSize}, ${halfSize})`">
        <template v-for="axis in axises">
          <line
            v-if="axis.direction > 0"
            :stroke="colors[axis.axisType]"
            stroke-width="2"
            :x2="axis.translate.x"
            :y2="axis.translate.y"
          ></line>
          <g
            cursor="pointer"
            :transform="`translate(${axis.translate.x}, ${axis.translate.y})`"
          >
            <circle
              :fill="axis.direction < 0 ? '#ccc' : colors[axis.axisType]"
              :stroke="colors[axis.axisType]"
              stroke-width="2"
              r="10"
              cx="0"
              cy="0"
              pointer-events="all"
              @click="handleAxisClick(axis.axisType, axis.direction)"
            ></circle>
            <text
              font-size="10"
              font-weight="bold"
              text-anchor="middle"
              alignment-baseline="central"
            >
              {{ (axis.direction > 0 ? "" : "-") + axis.axisType }}
            </text>
          </g>
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { ArcRotateCamera } from "@babylonjs/core";
import { useAxisCameraSync, type TAxisTransform } from "../hooks/useAxisCameraSync";

const props = defineProps<{
  camera: ArcRotateCamera;
}>();

const size = 140;
const halfSize = size / 2;
const axisSize = 40;
const colors: Record<TAxisTransform["axisType"], string> = {
  X: "#f44",
  Y: "#4f4",
  Z: "#77f",
};

const { axises, handleAxisClick } = useAxisCameraSync(props.camera, axisSize);
</script>

<style scoped>
.gizmo-viewport {
  pointer-events: none;
  position: absolute;
  right: 0;
}
</style>
