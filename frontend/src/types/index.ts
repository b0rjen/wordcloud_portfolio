export interface WordCloudData {
  word_frequencies: Record<string, number>;
  total_words: number;
  unique_words: number;
  top_words: Record<string, number>;
}

export interface WordCloudResponse {
  success: boolean;
  data: WordCloudData;
}

export interface WordCloudError {
  detail: string;
}

export interface TextInput {
  text: string;
  language: string;
}

export interface URLInput {
  url: string;
  language: string;
}