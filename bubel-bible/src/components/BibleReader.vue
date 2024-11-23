<script setup>
import { ref, watch } from 'vue'
import BibleService from '../services/BibleService'

const translations = ref([])
const selectedTranslation = ref('')
const books = ref([])
const selectedBook = ref('')
const chapters = ref([])
const selectedChapter = ref('')
const content = ref('')
const loading = ref(false)
const error = ref(null)

// Load translations on component mount
async function loadTranslations() {
  try {
    loading.value = true
    translations.value = await BibleService.getTranslations()
  } catch (e) {
    error.value = 'Failed to load Bible translations'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Load books when translation is selected
async function loadBooks() {
  if (!selectedTranslation.value) return
  try {
    loading.value = true
    books.value = await BibleService.getBooks(selectedTranslation.value)
    selectedBook.value = ''
    chapters.value = []
    selectedChapter.value = ''
    content.value = ''
  } catch (e) {
    error.value = 'Failed to load books'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Load chapters when book is selected
async function loadChapters() {
  if (!selectedBook.value) return
  try {
    loading.value = true
    chapters.value = await BibleService.getChapters(selectedTranslation.value, selectedBook.value)
    chapters.value = chapters.value.slice(1) // Remove introduction chapter
    selectedChapter.value = ''
    content.value = ''
  } catch (e) {
    error.value = 'Failed to load chapters'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Load chapter content
async function loadContent() {
  if (!selectedChapter.value) return
  try {
    loading.value = true
    const data = await BibleService.getChapterContent(selectedTranslation.value, selectedChapter.value)
    content.value = data.content
  } catch (e) {
    error.value = 'Failed to load chapter content'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Watch for selection changes
watch(selectedTranslation, loadBooks)
watch(selectedBook, loadChapters)
watch(selectedChapter, loadContent)

// Initial load of translations
loadTranslations()
</script>

<template>
  <div class="bible-reader">
    <h1>Bible Reader</h1>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div class="controls">
      <!-- Translation selector -->
      <div class="select-group">
        <label for="translation">Translation:</label>
        <select 
          id="translation" 
          v-model="selectedTranslation"
          :disabled="loading"
        >
          <option value="">Select a translation</option>
          <option 
            v-for="translation in translations" 
            :key="translation.id" 
            :value="translation.id"
          >
            {{ translation.name }}
          </option>
        </select>
      </div>

      <!-- Book selector -->
      <div class="select-group">
        <label for="book">Book:</label>
        <select 
          id="book" 
          v-model="selectedBook"
          :disabled="loading || !selectedTranslation"
        >
          <option value="">Select a book</option>
          <option 
            v-for="book in books" 
            :key="book.id" 
            :value="book.id"
          >
            {{ book.name }}
          </option>
        </select>
      </div>

      <!-- Chapter selector -->
      <div class="select-group">
        <label for="chapter">Chapter:</label>
        <select 
          id="chapter" 
          v-model="selectedChapter"
          :disabled="loading || !selectedBook"
        >
          <option value="">Select a chapter</option>
          <option 
            v-for="chapter in chapters" 
            :key="chapter.id" 
            :value="chapter.id"
          >
            {{ chapter.number }}
          </option>
        </select>
      </div>
    </div>

    <!-- Content display -->
    <div class="content">
      <div v-if="loading" class="loading">
        Loading...
      </div>
      <div v-else-if="content" v-html="content" class="scripture"></div>
      <div v-else class="placeholder">
        Select a translation, book, and chapter to begin reading
      </div>
    </div>
  </div>
</template>

<style scoped>
.bible-reader {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.select-group {
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  color: #666;
}

.error {
  background-color: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.placeholder {
  text-align: center;
  color: #666;
}

.scripture {
  line-height: 1.6;
}

/* Style verse numbers */
.scripture sup {
  color: #666;
  font-size: 0.75em;
  margin-right: 0.25em;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }

  .select-group {
    width: 100%;
  }
}
</style>