<script setup lang="ts">
import { ref, computed } from 'vue'
import { store } from '../stores/landmarkStore'
import type { Landmark, LandmarkCategory } from '../types/landmark'
import { CATEGORY_INFO } from '../types/landmark'
import { Search, MapPin, GraduationCap, UtensilsCrossed, Heart, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'focus-landmark', landmark: Landmark): void
  (e: 'toggle'): void
}>()

const searchInput = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const categories: LandmarkCategory[] = ['landmark', 'school', 'dining', 'special']

const iconMap = {
  landmark: MapPin,
  school: GraduationCap,
  dining: UtensilsCrossed,
  special: Heart
}

const filteredLandmarks = computed(() => {
  return store.landmarks.filter((landmark) => {
    const isActive = store.activeCategories.includes(landmark.category)
    const matchesSearch = store.searchQuery === '' ||
      landmark.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
      landmark.nameZh.includes(store.searchQuery)
    return isActive && matchesSearch
  })
})

function handleSearch(event: Event) {
  const value = (event.target as HTMLInputElement).value
  searchInput.value = value
  store.setSearchQuery(value)
}

function toggleCategory(category: LandmarkCategory) {
  store.toggleCategory(category)
}

function selectLandmark(landmark: Landmark) {
  store.selectLandmark(landmark)
  emit('focus-landmark', landmark)
}

function exportMap() {
  const data = JSON.stringify(store.landmarks, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-ntu-map.json'
  a.click()
  URL.revokeObjectURL(url)
}

function triggerImport() {
  fileInputRef.value?.click()
}

function importMap(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      
      if (!Array.isArray(data)) {
        alert('Invalid format: Expected an array of landmarks')
        return
      }
      
      const validated = data.filter((item: Partial<Landmark>) => {
        return item.id && item.name && item.lat && item.lng && item.category
      })
      
      if (validated.length === 0) {
        alert('No valid landmarks found in the file')
        return
      }
      
      const sanitized = validated.map((item: any) => ({
        ...item,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng)
      }))
      
      store.setLandmarks(sanitized)
      alert(`Successfully imported ${sanitized.length} landmarks!`)
    } catch (error) {
      alert('Failed to parse JSON file. Please check the format.')
    }
  }
  reader.readAsText(file)
  
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}
</script>

<template>
  <div 
    class="absolute top-0 left-0 bottom-0 z-[1000] flex flex-col transition-transform duration-300 ease-in-out"
    :class="isCollapsed ? '-translate-x-full' : 'translate-x-0'"
    style="width: 20rem;"
  >
    <button
      @click="$emit('toggle')"
      class="absolute -right-10 top-1/2 -translate-y-1/2 z-[1001] bg-slate-800/80 backdrop-blur-md shadow-lg rounded-r-lg p-2 hover:bg-slate-700/80 transition-all duration-300 focus:ring-2 focus:ring-slate-400 focus:outline-none"
      aria-label="Toggle sidebar"
    >
      <ChevronLeft v-if="!isCollapsed" class="w-4 h-4 text-slate-200" />
      <ChevronRight v-else class="w-4 h-4 text-slate-200" />
    </button>
    
    <div class="m-4 mr-0 h-full bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
      <div class="p-5 border-b border-slate-700/50">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <MapPin class="w-6 h-6 text-orange-500" />
          NTU DIY Map Editor
        </h1>
        <p class="text-slate-400 text-sm mt-1">Customize your NTU campus experience</p>
      </div>
      
      <div class="p-4 border-b border-slate-700/50">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            :value="searchInput"
            @input="handleSearch"
            placeholder="Search landmarks..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>
      </div>
      
      <div class="p-4 border-b border-slate-700/50">
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="store.toggleCategory(cat)"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            :class="store.isCategoryActive(cat) 
              ? `${CATEGORY_INFO[cat].bgColor} text-white` 
              : 'bg-slate-800/40 text-slate-500 opacity-50 saturate-50 hover:bg-slate-700/50'"
          >
            <component :is="iconMap[cat]" class="w-4 h-4" />
            {{ CATEGORY_INFO[cat].name }}
          </button>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4">
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {{ filteredLandmarks.length }} Places
        </h3>
        <div class="space-y-2">
          <button
            v-for="landmark in filteredLandmarks"
            :key="landmark.id"
            @click="selectLandmark(landmark)"
            class="w-full p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50 transition-all text-left group"
            :class="{ 'border-orange-500/50 bg-orange-500/10': store.selectedLandmark?.id === landmark.id }"
          >
            <div class="flex items-start gap-3">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: CATEGORY_INFO[landmark.category].color }"
              >
                <component :is="iconMap[landmark.category]" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium text-sm truncate">{{ landmark.name }}</p>
                <p class="text-slate-400 text-xs truncate">{{ landmark.nameZh }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <div class="p-4 border-t border-slate-700/50">
        <div class="flex gap-2">
          <button
            @click="exportMap"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Download class="w-4 h-4" />
            Export
          </button>
          <button
            @click="triggerImport"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Upload class="w-4 h-4" />
            Import
          </button>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept=".json"
          class="hidden"
          @change="importMap"
        />
      </div>
    </div>
  </div>
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
