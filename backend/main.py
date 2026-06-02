import os

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from wordcloud_service import WordCloudService

app = FastAPI(title="WordCloud API", version="1.0.0")

# Initialize service
wordcloud_service = WordCloudService()
STATIC_DIR = os.getenv("STATIC_DIR", "/app/static")
os.makedirs(STATIC_DIR, exist_ok=True)

class TextInput(BaseModel):
    text: str
    language: str = "english"

class URLInput(BaseModel):
    url: str
    language: str = "english"

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
        png_bytes = wordcloud_service.generate_image_from_text(
            input_data.text,
            input_data.language
        )
        return Response(content=png_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate/url/image")
async def generate_image_from_url(input_data: URLInput):
    try:
        # Generate wordcloud image
        png_bytes = wordcloud_service.generate_image_from_url(
            input_data.url,
            input_data.language
        )
        return Response(content=png_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
