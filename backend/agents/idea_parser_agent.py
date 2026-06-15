import json
from config.llm_config import llm
from utils.parser import parse_llm_json

def idea_parser_agent(state):

    idea = state.get("idea", "")

    prompt = f"""
You are a startup requirements analyst.

Convert the startup description into structured JSON.

Return ONLY valid JSON.

FORMAT:
{{
    "startup_name": "",
    "problem": "",
    "target_audience": [],
    "features": [],
    "revenue_model": [],
    "unique_advantage": "",
    "tech_requirements": [],
    "additional_details": []
}}

STARTUP DESCRIPTION:

{idea}
"""

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    if not isinstance(data, dict):
        data = {
            "startup_name": "",
            "problem": "",
            "target_audience": [],
            "features": [],
            "revenue_model": [],
            "unique_advantage": "",
            "tech_requirements": [],
            "additional_details": []
        }

    return {
        "parsed_idea": data
    }