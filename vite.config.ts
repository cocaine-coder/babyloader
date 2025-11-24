import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { analyzer } from "vite-bundle-analyzer";
import importToCDN from 'vite-plugin-cdn-import'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), analyzer({}),
  importToCDN({
    modules: [
      {
        name: '@babylonjs/core',
        var: 'BABYLON',
        path: 'https://cdn.babylonjs.com/babylon.js'
      }, {
        name: '@babylonjs/loaders',
        var: 'BABYLON',
        path: 'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js'
      }, {
        name: '@babylonjs/materials',
        var: 'BABYLON',
        path: 'https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
      }, {
        name: '@babylonjs/serializers',
        var: 'BABYLON',
        path: 'https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js'
      }, {
        name: '@babylonjs/gui',
        var: 'BABYLON',
        path: 'https://cdn.babylonjs.com/gui/babylon.gui.min.js'
      }, {
        name: '@babylonjs/inspector',
        var: 'BABYLON',
        path: 'https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js'
      }
    ]
  })],
  base: "./"
})
