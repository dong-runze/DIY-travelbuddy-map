<script setup lang="ts">
import { ref, computed } from 'vue'
import { store } from '../stores/landmarkStore'
import { CATEGORY_INFO } from '../types/landmark'
import { X, Clock, MapPin, Languages, Edit, Trash2, Expand } from 'lucide-vue-next'

const isZh = ref(false)
const isImageExpanded = ref(false)

const landmark = computed(() => store.selectedLandmark)
const categoryInfo = computed(() => landmark.value ? CATEGORY_INFO[landmark.value.category] : null)

function toggleLanguage() {
  isZh.value = !isZh.value
}

function closePanel() {
  store.closeDetailPanel()
}

function editLandmark() {
  if (landmark.value) {
    store.openEditorModal(landmark.value)
  }
}

function deleteLandmark() {
  if (landmark.value && confirm('Are you sure you want to delete this landmark?')) {
    store.deleteLandmark(landmark.value.id)
  }
}

function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.isDetailPanelOpen" class="absolute top-0 right-0 bottom-0 w-96 z-[1000] flex flex-col">
      <div class="m-4 ml-0 h-full bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-300">
        <div v-if="landmark" class="flex flex-col h-full">
          <div class="relative">
            <img
              :src="landmark.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'"
              :alt="landmark.name"
              class="w-full h-48 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            
            <button
              v-if="landmark.imageUrl"
              @click="isImageExpanded = true"
              class="absolute bottom-3 right-3 p-2 bg-slate-900/70 hover:bg-slate-900/90 rounded-lg text-white transition-colors"
            >
              <Expand class="w-4 h-4" />
            </button>
            
            <button
              @click="closePanel"
              class="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-slate-900/90 rounded-lg text-white transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
            
            <div 
              v-if="categoryInfo"
              class="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium text-white"
              :style="{ backgroundColor: categoryInfo.color }"
            >
              {{ categoryInfo.name }}
            </div>
          </div>
          
          <div class="p-5 flex-1 overflow-y-auto">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-xl font-bold text-white">
                  {{ isZh ? landmark.nameZh : landmark.name }}
                </h2>
                <button
                  @click="toggleLanguage"
                  class="mt-1 flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <Languages class="w-3.5 h-3.5" />
                  {{ isZh ? 'Switch to English' : '切换到中文' }}
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="p-3 bg-slate-800/50 rounded-xl">
                <div class="flex items-center gap-2 text-slate-400 mb-1">
                  <Clock class="w-4 h-4" />
                  <span class="text-xs font-medium">Opening Hours</span>
                </div>
                <p class="text-white text-sm">{{ landmark.openingHours || 'N/A' }}</p>
              </div>
              <div class="p-3 bg-slate-800/50 rounded-xl">
                <div class="flex items-center gap-2 text-slate-400 mb-1">
                  <MapPin class="w-4 h-4" />
                  <span class="text-xs font-medium">Coordinates</span>
                </div>
                <p class="text-white text-xs">{{ formatCoords(landmark.lat, landmark.lng) }}</p>
              </div>
            </div>
            
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-slate-300 mb-2">Introduction</h3>
              <p class="text-slate-400 text-sm leading-relaxed">
                {{ isZh ? (landmark.introductionZh || landmark.introduction || 'No introduction available') : (landmark.introduction || 'No introduction available') }}
              </p>
            </div>
            
            <div v-if="landmark.features && landmark.features.length > 0">
              <h3 class="text-sm font-semibold text-slate-300 mb-3">Features & Facilities</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="feature in landmark.features"
                  :key="feature"
                  class="px-3 py-1.5 bg-slate-800/70 border border-slate-700/50 rounded-full text-xs text-slate-300"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-slate-700/50">
            <div class="flex gap-2">
              <button
                @click="editLandmark"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <Edit class="w-4 h-4" />
                Edit
              </button>
              <button
                @click="deleteLandmark"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-colors"
              >
                <Trash2 class="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div
      v-if="isImageExpanded && landmark?.imageUrl"
      class="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-8"
      @click="isImageExpanded = false"
    >
      <button
        @click="isImageExpanded = false"
        class="absolute top-4 right-4 p-2 bg-slate-800/70 hover:bg-slate-800/90 rounded-lg text-white transition-colors"
      >
        <X class="w-6 h-6" />
      </button>
      <img
        :src="landmark.imageUrl"
        :alt="landmark.name"
        class="max-w-full max-h-full object-contain rounded-lg"
        @click.stop
      />
    </div>
  </Teleport>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
