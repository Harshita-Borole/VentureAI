# agents/developer_agent.py

import json
import requests
import pandas as pd

from utils.parser import parse_llm_json
from config.llm_config import llm

# =====================================================
# LOAD DATASET
# =====================================================

techstack = pd.read_csv("datasets/techstack.csv")


# =====================================================
# GITHUB SEARCH
# =====================================================

def search_github(idea):

    try:

        url = "https://api.github.com/search/repositories"

        params = {
            "q": idea,
            "sort": "stars",
            "order": "desc",
            "per_page": 5
        }

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        repos = response.json()

        cleaned = []

        for repo in repos.get("items", []):

            cleaned.append({
                "name": repo.get("name", ""),
                "stars": repo.get("stargazers_count", 0),
                "url": repo.get("html_url", ""),
                "description": repo.get("description", "")
            })

        return cleaned

    except Exception as e:

        print("GitHub Search Error:", e)

        return []


# =====================================================
# DEVELOPER AGENT
# =====================================================

def developer_agent(state):

    try:

        idea = state.get("idea", "")
        parsed_idea = state.get("parsed_idea", {})

        features = parsed_idea.get("features", [])

        feature_query = " ".join(features)

        if not feature_query:
            feature_query = idea

        github_results = search_github(
            feature_query[:500]
        )

        tech_data = techstack.head(20).to_string(
            index=False
        )

        prompt = f"""
You are a senior AI startup architect.

Analyze:

- modern AI stack
- scalable architecture
- best frameworks
- GitHub ecosystem
- deployment strategy
- RAG systems
- AI agents
- memory systems

IMPORTANT:

Return ONLY valid JSON.
IMPORTANT:

Analyze EVERY feature individually.

For each feature provide:
- technical complexity
- architecture requirements
- scalability considerations
- implementation strategy

Do not ignore any feature.

JSON FORMAT:

{{
    "frontend": "",
    "backend": "",
    "database": "",
    "ai_stack": [],
    "deployment": "",
    "mvp_features": [],
    "development_steps": [],
    "recommended_architecture": [],
    "github_projects": [],
    "scalability_strategy": [],
    "security_recommendations": [],
    "feature_analysis": [
        {{
            "feature": "",
            "technical_complexity": "",
            "architecture_requirements": "",
            "scalability_considerations": "",
            "implementation_strategy": ""
        }}
    ]
}}

IMPORTANT:
"ai_stack" must contain ONLY short plain text strings naming
technologies, frameworks, or tools (e.g. "FastAPI", "pgvector",
"OpenAI GPT-4o for resume parsing").

Do NOT put JSON objects, dictionaries, or key:value pairs inside
"ai_stack".

Put the detailed per-feature breakdown (technical complexity,
architecture requirements, scalability considerations,
implementation strategy) ONLY inside "feature_analysis" — one
object per feature from PARSED STARTUP. Do not skip any feature.

PARSED STARTUP:

{json.dumps(parsed_idea, indent=2)}

ORIGINAL IDEA:

{idea}

TOP GITHUB PROJECTS:
{json.dumps(github_results, indent=2)}

TECH STACK DATA:
{tech_data}
"""

        # =====================================
        # LLM CALL
        # =====================================

        response = llm.invoke(prompt)

        print("\n========== DEVELOPER RESPONSE ==========")
        print(response)

        # =====================================
        # PARSE JSON
        # =====================================

        data = parse_llm_json(response)

        # =====================================
        # FALLBACK
        # =====================================

        if not isinstance(data, dict):

            data = {
                "frontend": "",
                "backend": "",
                "database": "",
                "ai_stack": [],
                "deployment": "",
                "mvp_features": [],
                "development_steps": [],
                "recommended_architecture": [],
                "github_projects": [],
                "scalability_strategy": [],
                "security_recommendations": [],
                "feature_analysis": []
            }

        return {
            "developer": data
        }

    except Exception as e:

        print("\n========== DEVELOPER AGENT ERROR ==========")
        print(str(e))

        return {
            "developer": {
                "frontend": "",
                "backend": "",
                "database": "",
                "ai_stack": [],
                "deployment": "",
                "mvp_features": [],
                "development_steps": [],
                "recommended_architecture": [],
                "github_projects": [],
                "scalability_strategy": [],
                "security_recommendations": []
            }
        }