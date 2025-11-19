<template>
  <div class="gizmo-viewport">
    <svg :width="size" :height="size">
      <g :transform="`translate(${halfSize}, ${halfSize})`">
        <template v-for="circle in circles">
          <line
            v-if="circle.direction > 0"
            :stroke="colors[circle.axisType]"
            :x2="circle.translate.x"
            :y2="circle.translate.y"
          ></line>
          <g
            cursor="pointer"
            :transform="`translate(${circle.translate.x}, ${circle.translate.y})`"
          >
            <circle
              :fill="circle.direction < 0 ? '#555' : colors[circle.axisType]"
              :stroke="colors[circle.axisType]"
              stroke-width="2"
              r="10"
              cx="0"
              cy="0"
              pointer-events="all"
              @click="handleCircleClick(circle.axisType, circle.direction)"
            ></circle>
            <text
              v-if="circle.direction > 0"
              font-size="10"
              font-weight="bold"
              text-anchor="middle"
              alignment-baseline="central"
            >
              {{ circle.axisType }}
            </text>
          </g>
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import emitter from "../eventbus";

type TAxis = {
  axisType: "X" | "Y" | "Z";
  direction: -1 | 1;
  translate: { x: number; y: number };
};

const size = 140;
const halfSize = size / 2;
const axisSize = 40;
const colors: Record<TAxis["axisType"], string> = {
  X: "#f44",
  Y: "#4f4",
  Z: "#77f",
};

const circles = shallowRef<TAxis[]>();

emitter.on("camera_change", (e) => {
  const x_x = axisSize * Math.sin(-e.alpha);
  const z_x = axisSize * Math.sin(e.alpha + Math.PI / 2);
  const y_x = 0;

  const x_y = axisSize * Math.cos(e.beta) * Math.cos(-e.alpha);
  const z_y = -axisSize * Math.cos(e.beta) * Math.cos(e.alpha + Math.PI / 2);
  const y_y = -axisSize * Math.sin(e.beta);

  const result = new Array<TAxis>();

  const x0: TAxis = {
    axisType: "X",
    direction: 1,
    translate: {
      x: x_x,
      y: x_y,
    },
  };
  const x1: TAxis = {
    axisType: "X",
    direction: -1,
    translate: {
      x: -x_x,
      y: -x_y,
    },
  };
  const y0: TAxis = {
    axisType: "Y",
    direction: 1,
    translate: {
      x: y_x,
      y: y_y,
    },
  };
  const y1: TAxis = {
    axisType: "Y",
    direction: -1,
    translate: {
      x: -y_x,
      y: -y_y,
    },
  };
  const z0: TAxis = {
    axisType: "Z",
    direction: 1,
    translate: {
      x: z_x,
      y: z_y,
    },
  };
  const z1: TAxis = {
    axisType: "Z",
    direction: -1,
    translate: {
      x: -z_x,
      y: -z_y,
    },
  };

  result.push(e.beta < Math.PI / 2 ? y1 : y0);
  const sinAlpha = Math.sin(e.alpha);
  const cosAlpha = Math.cos(e.alpha);

  const otherY = result[0] === y0 ? y1 : y0;

  if (cosAlpha >= Math.cos(Math.PI / 4)) {
    // X 在最前面
    result.push(x1);
    result.push(z1);
    result.push(z0);
    result.push(x0);
  } else if (cosAlpha <= -Math.cos(Math.PI / 4)) {
    // 负X 在最前面
    result.push(x0);
    result.push(z0);
    result.push(z1);
    result.push(x1);
  } else if (sinAlpha >= Math.cos(Math.PI / 4)) {
    // Z 在最前面
    result.push(z1);
    result.push(x1);
    result.push(x0);
    result.push(z0);
  } else {
    // 负Z 在最前面
    result.push(z0);
    result.push(x0);
    result.push(x1);
    result.push(z1);
  }

  if (Math.abs(e.beta - Math.PI / 2) >= (Math.PI * 2) / 5) result.push(otherY);
  else result.splice(result.length - 1, 0, otherY);

  circles.value = result;
});

function handleCircleClick(type: TAxis["axisType"], direction: -1 | 1) {
  let alpha = 0;
  let beta = 0;

  switch (type) {
    case "X":
      beta = Math.PI / 2;
      alpha = direction > 0 ? 0 : Math.PI;

      break;
    case "Z":
      beta = Math.PI / 2;
      alpha = direction > 0 ? Math.PI / 2 : -Math.PI / 2;
      break;
    case "Y":
      alpha = 0;
      beta = direction > 0 ? 0 : Math.PI;
      break;
  }

  emitter.emit("update_camera", { alpha, beta });
}
</script>

<style scoped>
.gizmo-viewport {
  pointer-events: none;
}
</style>
