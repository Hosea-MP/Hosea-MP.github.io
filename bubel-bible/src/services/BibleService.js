// src/services/BibleService.js
const API_BASE_URL = 'https://api.scripture.api.bible/v1'
const API_KEY = import.meta.env.VITE_BIBLE_API_KEY

const headers = {
  'api-key': API_KEY
}

export default {
  async getTranslations() {
    const response = await fetch(`${API_BASE_URL}/bibles`, { headers })
    const data = await response.json()
    return data.data
  },

  async getBooks(bibleId) {
    const response = await fetch(`${API_BASE_URL}/bibles/${bibleId}/books`, { headers })
    const data = await response.json()
    return data.data
  },

  async getChapters(bibleId, bookId) {
    const response = await fetch(
      `${API_BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`,
      { headers }
    )
    const data = await response.json()
    return data.data
  },

  async getChapterContent(bibleId, chapterId) {
    const response = await fetch(
      `${API_BASE_URL}/bibles/${bibleId}/chapters/${chapterId}`,
      { headers }
    )
    const data = await response.json()
    return data.data
  }
}