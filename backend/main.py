from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import tempfile
from wordcloud_service import WordCloudService

app = FastAPI(title="WordCloud API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service
wordcloud_service = WordCloudService()

class TextInput(BaseModel):
    text: str
    language: str = "english"

class URLInput(BaseModel):
    url: str
    language: str = "english"

@app.get("/")
async def root():
    return {"message": "WordCloud API is running"}

@app.post("/generate/text")
async def generate_from_text(input_data: TextInput):
    try:
        # Generate wordcloud data
        wordcloud_data = wordcloud_service.generate_from_text(
            input_data.text,
            input_data.language
        )
        return {"success": True, "data": wordcloud_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate/url")
async def generate_from_url(input_data: URLInput):
    try:
        # Generate wordcloud data
        wordcloud_data = wordcloud_service.generate_from_url(
            input_data.url,
            input_data.language
        )
        return {"success": True, "data": wordcloud_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate/text/image")
async def generate_image_from_text(input_data: TextInput):
    try:
        # Generate wordcloud image
        image_path = wordcloud_service.generate_image_from_text(
            input_data.text,
            input_data.language
        )
        return FileResponse(
            path=image_path,
            media_type="image/png",
            filename="wordcloud.png"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate/url/image")
async def generate_image_from_url(input_data: URLInput):
    try:
        # Generate wordcloud image
        image_path = wordcloud_service.generate_image_from_url(
            input_data.url,
            input_data.language
        )
        return FileResponse(
            path=image_path,
            media_type="image/png",
            filename="wordcloud.png"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)