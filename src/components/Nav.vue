<template>
    <NCard size="small" style="border-radius: 0;">
        <div class="content">
            <div class="logo" style="line-height: 0;display: flex; align-items: center;gap: 10px;">
                <NIcon size="32" :color="themeVars.primaryColor">
                    <SvgLogo></SvgLogo>
                </NIcon>

                <span style="font-size:larger; font-weight: 600;">BabyLoader</span>
            </div>

            <div class="menu">

            </div>

            <div class="suffix">
                <NButton text @click="handleToggleDebugger">
                    <template #icon>
                        <NIcon>
                            <SvgDebug></SvgDebug>
                        </NIcon>
                    </template>
                </NButton>
            </div>
        </div>
    </NCard>
</template>

<script setup lang="ts">
import { NButton, NCard, NIcon, useThemeVars } from 'naive-ui';
import SvgLogo from './svg/SvgLogo.vue';
import SvgDebug from './svg/SvgDebug.vue';

import emitter from '../eventbus';

const themeVars = useThemeVars();

function handleToggleDebugger() {
    emitter.emit('toggle_debugger');
}
</script>

<style scoped>
.content {
    display: flex;
}

.menu {
    flex: 1;
}

.suffix {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>