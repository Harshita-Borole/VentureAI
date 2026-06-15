from langchain_google_genai import ChatGoogleGenerativeAI
from tavily import TavilyClient
from dotenv import load_dotenv
import os 

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-lite-latest",
    google_api_key=GEMINI_API_KEY,
    temperature=0.7,
    max_output_tokens=8192
)

tavily_client = TavilyClient(api_key=TAVILY_API_KEY)

print("LLM + Tavily Ready")