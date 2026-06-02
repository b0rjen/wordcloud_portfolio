import re
from io import BytesIO
from collections import Counter
from typing import List, Dict, Any
import requests
from bs4 import BeautifulSoup
from wordcloud import WordCloud
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

class WordCloudService:
    def __init__(self):
        self.download_nltk_data()

    def download_nltk_data(self):
        """Download required NLTK data if not already present"""
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

        try:
            nltk.data.find('tokenizers/punkt_tab')
        except LookupError:
            try:
                nltk.download('punkt_tab')
            except Exception:
                pass

        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')

    def get_stopwords(self, language: str = "english") -> set:
        """Get stopwords for the specified language"""
        try:
            stop_words = set(stopwords.words(language))
            # Add common web stopwords
            web_stopwords = {
                'www', 'com', 'org', 'html', 'http', 'https', 'get', 'post',
                'said', 'say', 'says', 'also', 'would', 'could', 'should',
                'one', 'two', 'first', 'last', 'new', 'old', 'good', 'bad',
                'big', 'small', 'right', 'left', 'way', 'well', 'like',
                'just', 'may', 'might', 'much', 'many', 'use', 'used',
                'using', 'make', 'made', 'making', 'take', 'taken', 'taking'
            }
            stop_words.update(web_stopwords)
            return stop_words
        except:
            # Fallback to basic English stopwords
            return {
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
                'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be',
                'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
                'will', 'would', 'could', 'should', 'may', 'might', 'must',
                'shall', 'can', 'this', 'that', 'these', 'those', 'i', 'you',
                'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
                'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
            }

    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        # Remove special characters but keep spaces and letters
        text = re.sub(r'[^a-zA-ZÀ-ÿ\s]', ' ', text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_text_from_url(self, url: str) -> str:
        """Extract text content from a URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style", "nav", "header", "footer"]):
                script.decompose()

            # Get text from specific elements that usually contain main content
            content_selectors = [
                'article', 'main', '.content', '#content', '.post', '.entry',
                'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
            ]

            text_parts = []
            for selector in content_selectors:
                elements = soup.select(selector)
                for element in elements:
                    text_parts.append(element.get_text())

            # If no specific content found, get all text
            if not text_parts:
                text_parts = [soup.get_text()]

            return ' '.join(text_parts)

        except Exception as e:
            raise Exception(f"Error extracting text from URL: {str(e)}")

    def process_text(self, text: str, language: str = "english") -> List[str]:
        """Process text and return filtered words"""
        # Clean text
        cleaned_text = self.clean_text(text)

        # Tokenize
        try:
            words = word_tokenize(cleaned_text.lower())
        except:
            # Fallback tokenization
            words = cleaned_text.lower().split()

        # Get stopwords
        stop_words = self.get_stopwords(language)

        # Filter words
        filtered_words = [
            word for word in words
            if len(word) > 2 and word.isalpha() and word not in stop_words
        ]

        return filtered_words

    def generate_word_frequencies(self, words: List[str]) -> Dict[str, int]:
        """Generate word frequency dictionary"""
        return dict(Counter(words))

    def generate_from_text(self, text: str, language: str = "english") -> Dict[str, Any]:
        """Generate wordcloud data from text"""
        if not text.strip():
            raise ValueError("Text cannot be empty")

        words = self.process_text(text, language)
        if not words:
            raise ValueError("No valid words found after processing")

        frequencies = self.generate_word_frequencies(words)

        return {
            "word_frequencies": frequencies,
            "total_words": len(words),
            "unique_words": len(frequencies),
            "top_words": dict(Counter(frequencies).most_common(20))
        }

    def generate_from_url(self, url: str, language: str = "english") -> Dict[str, Any]:
        """Generate wordcloud data from URL"""
        text = self.extract_text_from_url(url)
        return self.generate_from_text(text, language)

    def create_wordcloud_image(self, word_frequencies: Dict[str, int]) -> WordCloud:
        """Create WordCloud object from word frequencies"""
        wordcloud = WordCloud(
            width=800,
            height=400,
            background_color='white',
            max_words=100,
            colormap='viridis',
            random_state=42,
            relative_scaling=0.5,
            min_font_size=10
        ).generate_from_frequencies(word_frequencies)

        return wordcloud

    def _wordcloud_to_png_bytes(self, wordcloud: WordCloud) -> bytes:
        image = wordcloud.to_image()
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return buffer.getvalue()

    def generate_image_from_text(self, text: str, language: str = "english") -> bytes:
        """Generate wordcloud image from text and return PNG bytes"""
        data = self.generate_from_text(text, language)
        wordcloud = self.create_wordcloud_image(data["word_frequencies"])

        return self._wordcloud_to_png_bytes(wordcloud)

    def generate_image_from_url(self, url: str, language: str = "english") -> bytes:
        """Generate wordcloud image from URL and return PNG bytes"""
        data = self.generate_from_url(url, language)
        wordcloud = self.create_wordcloud_image(data["word_frequencies"])

        return self._wordcloud_to_png_bytes(wordcloud)
