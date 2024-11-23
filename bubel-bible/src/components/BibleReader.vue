<script setup>
import { ref, onMounted } from 'vue'

const translations = ref([])
const selectedTranslation = ref('')
const books = ref([])
const selectedBook = ref('')
const chapters = ref([])
const selectedChapter = ref('')
const verseContent = ref('')
const loading = ref(false)

const API_KEY = import.meta.env.VITE_BIBLE_API_KEY
const headers = {
  'api-key': API_KEY
}

// Fetch available Bible translations
const fetchTranslations = async () => {
  try {
    const response = await fetch('https://api.scripture.api.bible/v1/bibles', {
      headers
    })
    const data = await response.json()
    translations.value = data.data
  } catch (error) {
    console.error('Error fetching translations:', error)
  }
}

// Fetch books for selected translation
const fetchBooks = async () => {
  if (!selectedTranslation.value) return
  try {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${selectedTranslation.value}/books`,
      { headers }
    )
    const data = await response.json()
    books.value = data.data
    selectedBook.value = ''
    chapters.value = []
    selectedChapter.value = ''
    verseContent.value = ''
  } catch (error) {
    console.error('Error fetching books:', error)
  }
}

// Fetch chapters for selected book
const fetchChapters = async () => {
  if (!selectedBook.value) return
  try {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${selectedTranslation.value}/books/${selectedBook.value}/chapters`,
      { headers }
    )
    const data = await response.json()
    chapters.value = data.data.slice(1) // Remove the introduction chapter
    selectedChapter.value = ''
    verseContent.value = ''
  } catch (error) {
    console.error('Error fetching chapters:', error)
  }
}

// Fetch chapter content
const fetchChapterContent = async () => {
  if (!selectedChapter.value) return
  loading.value = true
  try {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${selectedTranslation.value}/chapters/${selectedChapter.value}`,
      { headers }
    )
    const data = await response.json()
    verseContent.value = data.data.content
    loading.value = false
  } catch (error) {
    console.error('Error fetching chapter content:', error)
    loading.value = false
  }
}

// Watch for changes in selections
watch(selectedTranslation, fetchBooks)
watch(selectedBook, fetchChapters)
watch(selectedChapter, fetchChapterContent)

onMounted(fetchTranslations)
</script>

<template>
  <div class="bible-reader">
    <h1>Bible Reader</h1>
    
    <div class="controls">
      <!-- Translation Selection -->
      <div class="control-group">
        <label for="translation">Translation:</label>
        <select id="translation" v-model="selectedTranslation">
          <option value="">Select Translation</option>
          <option v-for="translation in translations" :key="translation.id" :value="translation.id">
            {{ translation.name }}
          </option>
        </select>
      </div>

      <!-- Book Selection -->
      <div class="control-group">
        <label for="book">Book:</label>
        <select id="book" v-model="selectedBook" :disabled="!selectedTranslation">
          <option value="">Select Book</option>
          <option v-for="book in books" :key="book.id" :value="book.id">
            {{ book.name }}
          </option>
        </select>
      </div>

      <!-- Chapter Selection -->
      <div class="control-group">
        <label for="chapter">Chapter:</label>
        <select id="chapter" v-model="selectedChapter" :disabled="!selectedBook">
          <option value="">Select Chapter</option>
          <option v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
            {{ chapter.number }}
          </option>
        </select>
      </div>
    </div>

    <!-- Content Display -->
    <div class="content">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="verseContent" v-html="verseContent" class="verse-content"></div>
      <div v-else class="placeholder">
        Select a translation, book, and chapter to start reading
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

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 500;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 200px;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 20px;
}

.placeholder {
  text-align: center;
  color: #666;
  padding: 40px 20px;
}

.verse-content {
  line-height: 1.6;
}

/* Style the verse numbers */
.verse-content sup {
  color: #666;
  margin-right: 4px;
  font-weight: 500;
}
</style>