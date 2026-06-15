import json

from config.llm_config import llm, tavily_client
from utils.parser import parse_llm_json
from memory.chroma_store import get_relevant_memory


def research_agent(state):

    parsed_idea = state.get("parsed_idea", {})
    idea = state.get("idea", "").strip()

    if not idea:
        return {
            "research": {
                "competitors": [],
                "market_trends": [],
                "market_gaps": [],
                "opportunities": [],
                "sources": []
            }
        }

    # ====================================
    # Better Search Query
    # ====================================

    startup_name = parsed_idea.get("startup_name", "")

    features = parsed_idea.get("features", [])

    target_audience = parsed_idea.get("target_audience", [])

    search_query = f"""
    Startup: {startup_name}

    Features:
    {' , '.join(features)}

    Audience:
    {' , '.join(target_audience)}
    """

    # ====================================
    # Tavily Search
    # ====================================

    try:

        tavily_results = tavily_client.search(
            query=search_query[:1000],
            search_depth="advanced",
            max_results=10
        )

    except Exception as e:

        print("Tavily Error:", e)

        tavily_results = {
            "results": []
        }

    # ====================================
    # Sources
    # ====================================

    sources = []

    for item in tavily_results.get("results", []):

        url = item.get("url")

        if url:

            sources.append({
                "title": item.get("title", "Source"),
                "url": url
            })

    # ====================================
    # Memory
    # ====================================

    try:

        memory = get_relevant_memory(
            search_query
        )

    except:

        memory = {}

    # ====================================
    # Prompt
    # ====================================

    prompt = f"""
You are an expert startup research analyst.

Analyze ALL startup details.

Return ONLY valid JSON.

JSON FORMAT:

{{
    "competitors":[
        {{
            "name":"",
            "type":"",
            "description":""
        }}
    ],
    "market_trends":[],
    "market_gaps":[],
    "opportunities":[],
    "feature_comparison": {{
        "features": [],
        "your_startup": {{
            "name": "",
            "features": {{}}
        }},
        "competitors": [
            {{
                "name": "",
                "features": {{}}
            }}
        ]
    }}
}}

IMPORTANT RULES:

1. Analyze EVERY feature separately.
2. Analyze target audience.
3. Analyze revenue model.
4. Analyze unique advantage.
5. Use search results.
6. Give at least 5 competitors.
7. Return ONLY JSON.

FEATURE COMPARISON RULES:

8. In "feature_comparison.features", list 5 to 8 key
   capabilities relevant to this product category
   (e.g. "AI Resume Review", "Mock Interviews",
   "Skill-Gap Analysis", "Pricing Model", "Mobile App").

9. In "feature_comparison.your_startup.features", for
   EACH feature listed above, give a short value
   (e.g. "Yes - Real-time", "No", "Freemium ₹499/mo",
   "Planned").

10. In "feature_comparison.competitors", include the
    SAME competitors listed in "competitors" above
    (use the same names). For each competitor, for
    EACH feature, give a short value: "Yes", "No",
    "Partial", "Unknown", or a brief description.

11. Keep all feature_comparison values SHORT
    (max 4-5 words) since they will be shown in a
    table.

PARSED STARTUP:

{json.dumps(parsed_idea, indent=2)}

SEARCH RESULTS:

{json.dumps(tavily_results.get("results", []), indent=2)}

MEMORY:

{json.dumps(memory, indent=2)}
"""

    # ====================================
    # LLM
    # ====================================

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    if not isinstance(data, dict):

        data = {
            "competitors": [],
            "market_trends": [],
            "market_gaps": [],
            "opportunities": []
        }

    data["sources"] = sources

    print("RESEARCH RESPONSE:")
    print(json.dumps(data, indent=2))

    return {
        "research": data
    }