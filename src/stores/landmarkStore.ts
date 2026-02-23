import { reactive, watch } from 'vue'
import type { Landmark, LandmarkCategory } from '../types/landmark'
import { DEFAULT_LANDMARKS } from '../types/landmark'

const ALL_CATEGORIES: LandmarkCategory[] = ['landmark', 'school', 'dining', 'special']
const STORAGE_KEY = 'ntu-campus-landmarks'

function loadFromStorage(): Landmark[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e)
  }
  return [...DEFAULT_LANDMARKS]
}

function saveToStorage(landmarks: Landmark[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(landmarks))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const store = reactive({
  landmarks: loadFromStorage() as Landmark[],
  selectedLandmark: null as Landmark | null,
  isDetailPanelOpen: false,
  isEditorModalOpen: false,
  editingLandmark: null as Landmark | null,
  activeCategories: [...ALL_CATEGORIES] as LandmarkCategory[],
  searchQuery: '',

  setLandmarks(landmarks: Landmark[]) {
    this.landmarks = [...landmarks]
    saveToStorage(this.landmarks)
  },

  addLandmark(landmark: Landmark) {
    this.landmarks = [...this.landmarks, landmark]
    saveToStorage(this.landmarks)
  },

  cloneLandmark(landmark: Landmark, offsetLat: number = 0.0002, offsetLng: number = 0.0002): Landmark {
    const cloned: Landmark = {
      ...landmark,
      id: `clone-${Date.now()}`,
      lat: landmark.lat + offsetLat,
      lng: landmark.lng + offsetLng,
      isUserCreated: true
    }
    this.landmarks = [...this.landmarks, cloned]
    saveToStorage(this.landmarks)
    return cloned
  },

  updateLandmark(id: string, updates: Partial<Landmark>) {
    const existing = this.landmarks.find(l => l.id === id)
    if (existing) {
      const merged = { ...existing, ...updates }
      this.landmarks = this.landmarks.map(l => 
        l.id === id ? merged : l
      )
      if (this.selectedLandmark?.id === id) {
        this.selectedLandmark = merged
      }
      saveToStorage(this.landmarks)
    }
  },

  updateLandmarkPreserveCoords(id: string, updates: Omit<Landmark, 'lat' | 'lng'>) {
    const existing = this.landmarks.find(l => l.id === id)
    if (existing) {
      const merged = { ...existing, ...updates }
      this.landmarks = this.landmarks.map(l => 
        l.id === id ? merged : l
      )
      if (this.selectedLandmark?.id === id) {
        this.selectedLandmark = merged
      }
      saveToStorage(this.landmarks)
    }
  },

  updateLandmarkSilent(id: string, lat: number, lng: number) {
    const landmark = this.landmarks.find(l => l.id === id)
    if (landmark && (landmark.lat !== lat || landmark.lng !== lng)) {
      this.landmarks = this.landmarks.map(l => 
        l.id === id ? { ...l, lat, lng } : l
      )
      if (this.selectedLandmark?.id === id) {
        this.selectedLandmark = { ...this.selectedLandmark, lat, lng }
      }
      saveToStorage(this.landmarks)
    }
  },

  deleteLandmark(id: string) {
    this.landmarks = this.landmarks.filter(l => l.id !== id)
    if (this.selectedLandmark?.id === id) {
      this.selectedLandmark = null
      this.isDetailPanelOpen = false
    }
    saveToStorage(this.landmarks)
  },

  selectLandmark(landmark: Landmark | null) {
    this.selectedLandmark = landmark
    this.isDetailPanelOpen = landmark !== null
  },

  openDetailPanel() {
    this.isDetailPanelOpen = true
  },

  closeDetailPanel() {
    this.isDetailPanelOpen = false
  },

  openEditorModal(landmark?: Landmark) {
    this.isEditorModalOpen = true
    this.editingLandmark = landmark || null
  },

  closeEditorModal() {
    this.isEditorModalOpen = false
    this.editingLandmark = null
  },

  toggleCategory(category: LandmarkCategory) {
    if (this.activeCategories.includes(category)) {
      this.activeCategories = this.activeCategories.filter(c => c !== category)
    } else {
      this.activeCategories = [...this.activeCategories, category]
    }
  },

  setSearchQuery(query: string) {
    this.searchQuery = query
  },

  isCategoryActive(category: LandmarkCategory): boolean {
    return this.activeCategories.includes(category)
  },

  getFilteredLandmarks(): Landmark[] {
    return this.landmarks.filter((landmark) => {
      const isActive = this.activeCategories.includes(landmark.category)
      const matchesSearch = this.searchQuery === '' ||
        landmark.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        landmark.nameZh.includes(this.searchQuery)
      return isActive && matchesSearch
    })
  }
})
