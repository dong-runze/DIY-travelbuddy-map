<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { store } from '../stores/landmarkStore'
import type { Landmark, LandmarkCategory } from '../types/landmark'
import { CATEGORY_INFO } from '../types/landmark'
import { X, MapPin, GraduationCap, UtensilsCrossed, Heart, Save } from 'lucide-vue-next'

const name = ref('')
const nameZh = ref('')
const category = ref<LandmarkCategory>('landmark')
const imageUrl = ref('')
const openingHours = ref('')
const introduction = ref('')
const introductionZh = ref('')
const featuresInput = ref('')

const isEditing = computed(() => !!store.editingLandmark?.id?.toString().startsWith('temp-') === false)

const isValid = computed(() => {
  return name.value.trim() !== '' && nameZh.value.trim() !== ''
})

const categories: { id: LandmarkCategory; label: string; icon: any; color: string }[] = [
  { id: 'landmark', label: 'Landmark', icon: MapPin, color: '#f97316' },
  { id: 'school', label: 'School', icon: GraduationCap, color: '#3b82f6' },
  { id: 'dining', label: 'Dining', icon: UtensilsCrossed, color: '#22c55e' },
  { id: 'special', label: 'Special Spot', icon: Heart, color: '#ec4899' }
]

onMounted(() => {
  if (store.editingLandmark) {
    const data = JSON.parse(JSON.stringify(store.editingLandmark))
    name.value = data.name || ''
    nameZh.value = data.nameZh || ''
    category.value = data.category || 'landmark'
    imageUrl.value = data.imageUrl || ''
    openingHours.value = data.openingHours || ''
    introduction.value = data.introduction || ''
    introductionZh.value = data.introductionZh || ''
    featuresInput.value = data.features?.join(', ') || ''
  }
  
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function closeModal() {
  store.closeEditorModal()
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && store.isEditorModalOpen) {
    e.preventDefault()
    closeModal()
  }
}

function normalizeUrl(url: string): string {
  if (!url) return url
  const trimmed = url.trim()
  if (trimmed && !/^https?:\/\//i.test(trimmed)) {
    return 'https://' + trimmed
  }
  return trimmed
}

function saveLandmark() {
  if (!isValid.value || !store.editingLandmark) return
  
  const features = featuresInput.value
    .split(',')
    .map(f => f.trim())
    .filter(f => f !== '')
  
  const normalizedImage = normalizeUrl(imageUrl.value)
  
  const landmarkData: Omit<Landmark, 'lat' | 'lng'> = {
    id: isEditing.value ? store.editingLandmark.id : `user-${Date.now()}`,
    name: name.value.trim(),
    nameZh: nameZh.value.trim(),
    category: category.value,
    imageUrl: normalizedImage || undefined,
    openingHours: openingHours.value.trim() || undefined,
    introduction: introduction.value.trim() || undefined,
    introductionZh: introductionZh.value.trim() || undefined,
    features: features.length > 0 ? features : undefined,
    isUserCreated: true
  }
  
  if (isEditing.value) {
    store.updateLandmarkPreserveCoords(store.editingLandmark.id, landmarkData)
  } else {
    store.addLandmark({ ...landmarkData, lat: store.editingLandmark.lat, lng: store.editingLandmark.lng })
  }
  
  store.closeEditorModal()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.isEditorModalOpen" class="fixed inset-0 z-[1500] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      
      <div class="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between p-5 border-b border-slate-700/50">
          <h2 class="text-lg font-bold text-white">
            {{ isEditing ? 'Edit Landmark' : 'Add New Landmark' }}
          </h2>
          <button
            @click="closeModal"
            class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Name (English)</label>
              <input
                v-model="name"
                type="text"
                placeholder="e.g., The Wave"
                class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">名称 (中文)</label>
              <input
                v-model="nameZh"
                type="text"
                placeholder="e.g., THE WAVE 蜂巢"
                class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="category = cat.id"
                class="flex flex-col items-center gap-1 p-3 rounded-xl border transition-all"
                :class="category === cat.id 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'"
              >
                <component 
                  :is="cat.icon" 
                  class="w-5 h-5"
                  :style="{ color: category === cat.id ? cat.color : '#94a3b8' }"
                />
                <span 
                  class="text-xs font-medium"
                  :class="category === cat.id ? 'text-white' : 'text-slate-400'"
                >
                  {{ cat.label }}
                </span>
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Image URL</label>
            <input
              v-model="imageUrl"
              type="text"
              placeholder="https://... (Right-click image -> Copy image address)"
              class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
            <p class="text-xs text-slate-500 mt-1">💡 Tip: Please right-click an online image and select "Copy image address". Direct image file pasting is not supported.</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Opening Hours</label>
            <input
              v-model="openingHours"
              type="text"
              placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM"
              class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Introduction (English)</label>
            <textarea
              v-model="introduction"
              rows="2"
              placeholder="Describe this place..."
              class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">简介 (中文)</label>
            <textarea
              v-model="introductionZh"
              rows="2"
              placeholder="描述这个地点..."
              class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Features (comma separated)</label>
            <input
              v-model="featuresInput"
              type="text"
              placeholder="e.g., WiFi, Parking, Air Conditioning"
              class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
        </div>
        
        <div class="p-5 border-t border-slate-700/50">
          <div class="flex gap-3">
            <button
              @click="closeModal"
              class="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveLandmark"
              :disabled="!isValid"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Save class="w-4 h-4" />
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
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
