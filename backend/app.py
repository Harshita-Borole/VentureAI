from flask import Flask, request, jsonify
from flask_cors import CORS

import json
import traceback
from datetime import datetime

from graph.workflow import graph
from memory.chroma_store import save_startup_memory
from agents.chat_agent import chat_agent

# =====================================================
# APP SETUP
# =====================================================

app = Flask(__name__)
CORS(app)

# =====================================================
# MEMORY STORAGE
# =====================================================

latest_startup_report = None
chat_history = []
MAX_CHAT_MEMORY = 15

# =====================================================
# CLEAN SOURCES
# =====================================================

def clean_sources(sources):

    cleaned = []
    seen = set()

    if not isinstance(sources, list):
        return cleaned

    for item in sources:

        url = None
        title = None

        if isinstance(item, dict):
            url = item.get("url", "")
            title = item.get("title", "Source")

        elif isinstance(item, str):
            url = item

        if not url:
            continue

        url = str(url).strip()

        if not url.startswith("http"):
            continue

        if url in seen:
            continue

        seen.add(url)

        domain = url.replace("https://", "").replace("http://", "").split("/")[0]

        cleaned.append({
            "title": title or domain,
            "url": url
        })

    return cleaned

# =====================================================
# HOME
# =====================================================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "🚀 AI Multi-Agent Startup Simulator Running"
    })

# =====================================================
# HEALTH
# =====================================================

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    })

# =====================================================
# GENERATE STARTUP
# =====================================================

@app.route("/generate-startup", methods=["POST"])
def generate_startup():
    print("========== GENERATE STARTUP CALLED ==========")

    global latest_startup_report, chat_history

    try:
        chat_history = []

        data = request.get_json()

        print("REQUEST DATA:")
        print(data)
        if not data:
            return jsonify({"success": False, "error": "No data received"})

        idea = data.get("idea", "").strip()

        if not idea:
            return jsonify({"success": False, "error": "Idea required"})

        initial_state = {
            "idea": idea,
            "research": {},
            "finance": {},
            "developer": {},
            "marketing": {},
            "critic": {},
            "final_report": {},
            "pitch_deck": {},
            "executive_summary": {},
            "swot": {},
            "tam_sam_som": {}
        }

        print("========== STARTING GRAPH ==========")

        try:
            result = graph.invoke(initial_state)

            print("========== GRAPH FINISHED ==========")
            print(result)

        except Exception as e:
            print("========== GRAPH ERROR ==========")

            import traceback
            traceback.print_exc()

            print("ERROR TYPE:", type(e))
            print("ERROR MESSAGE:", str(e))

            return jsonify({
                "success": False,
                "error": str(e)
            })
        
                




        report = result.get("final_report", {})
        research = result.get("research", {})
        finance = result.get("finance", {})
        developer = result.get("developer", {})
        marketing = result.get("marketing", {})
        pitch_deck = result.get("pitch_deck", {})
        executive_summary = result.get("executive_summary", {})
        swot = result.get("swot", {}) 
        tam_sam_som = result.get("tam_sam_som", {}) 

        research["sources"] = clean_sources(research.get("sources", []))

        latest_startup_report = {
            "idea": idea,
            "report": report,
            "research": research,
            "finance": finance,
            "developer": developer,
            "marketing": marketing,
            "pitch_deck": pitch_deck,
            "executive_summary": executive_summary,
            "swot": swot,
            "tam_sam_som": tam_sam_som,
            "timestamp": str(datetime.now())
        }

        # SAVE MEMORY
        save_startup_memory(
            idea=idea,
            report=json.dumps(latest_startup_report, ensure_ascii=False)
        )

        return jsonify({
            "success": True,
            "report": report,
            "research": research,
            "finance": finance,
            "developer": developer,
            "marketing": marketing,
            "pitch_deck": pitch_deck,
            "executive_summary": executive_summary,
            "swot": swot,
            "tam_sam_som": tam_sam_som
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)})

# =====================================================
# CHAT WITH MEMORY FIXED
# =====================================================

@app.route("/chat", methods=["POST"])
def chat():

    global latest_startup_report, chat_history

    try:
        data = request.get_json()
        print("REQUEST DATA:")
        print(data)

        if not data:
            return jsonify({"success": False, "error": "No data"})

        question = data.get("question", "").strip()

        if not question:
            return jsonify({"success": False, "error": "Question required"})

        if not latest_startup_report:
            return jsonify({"success": False, "error": "Generate startup first"})

        context = {
            "startup": latest_startup_report,
            "chat_history": chat_history[-10:]
        }

        answer = chat_agent(question, context, chat_history)

        if hasattr(answer, "content"):
            answer = answer.content

        chat_history.append({
            "question": question,
            "answer": answer
        })

        if len(chat_history) > MAX_CHAT_MEMORY:
            chat_history = chat_history[-MAX_CHAT_MEMORY:]

        return jsonify({
            "success": True,
            "answer": answer,
            "memory_size": len(chat_history)
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)})

# =====================================================
# CHAT HISTORY
# =====================================================

@app.route("/chat-history")
def get_chat_history():
    return jsonify({
        "success": True,
        "history": chat_history
    })

# =====================================================
# CLEAR CHAT
# =====================================================

@app.route("/clear-chat", methods=["POST"])
def clear_chat():
    global chat_history
    chat_history = []

    return jsonify({
        "success": True,
        "message": "Chat cleared"
    })

# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
     app.run(
    debug=True,
    use_reloader=False
)