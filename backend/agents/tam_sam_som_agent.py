# agents/tam_sam_som_agent.py

import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def tam_sam_som_agent(state):

    prompt = f"""
You are a senior venture capital market-sizing analyst.

Calculate a TAM, SAM, and SOM analysis for this startup
based on the original idea, parsed details, and market
research provided below.

DEFINITIONS:
- TAM (Total Addressable Market): total global revenue
  opportunity if this product captured 100% of the
  relevant market.
- SAM (Serviceable Addressable Market): the portion of
  TAM realistically reachable given the business model,
  geography, language, and target segment.
- SOM (Serviceable Obtainable Market): the realistic
  revenue this startup could capture in the next 1-3
  years given competition, budget, and execution.

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- All market size values must be numeric (USD), no symbols or commas
- Provide clear reasoning for each estimate
- Use top-down or bottom-up methodology and state which one you used

JSON FORMAT:

{{
    "tam": {{
        "value": 0,
        "label": "",
        "description": ""
    }},
    "sam": {{
        "value": 0,
        "label": "",
        "description": ""
    }},
    "som": {{
        "value": 0,
        "label": "",
        "description": ""
    }},
    "methodology": "",
    "growth_rate": "",
    "key_assumptions": []
}}

ORIGINAL IDEA:
{state.get("idea", "")}

PARSED STARTUP:
{json.dumps(state.get("parsed_idea", {}), indent=2)}

RESEARCH REPORT:
{json.dumps(state.get("research", {}), indent=2)}

FINANCE REPORT:
{json.dumps(state.get("finance", {}), indent=2)}

MARKETING REPORT:
{json.dumps(state.get("marketing", {}), indent=2)}
"""

    response = llm.invoke(prompt)

    print("\n========== TAM/SAM/SOM RAW RESPONSE ==========")
    print(response)

    data = parse_llm_json(response)

    if not isinstance(data, dict):
        data = {}

    defaults = {
        "tam": {"value": 0, "label": "TAM", "description": ""},
        "sam": {"value": 0, "label": "SAM", "description": ""},
        "som": {"value": 0, "label": "SOM", "description": ""},
        "methodology": "",
        "growth_rate": "",
        "key_assumptions": []
    }

    for key, value in defaults.items():
        if key not in data:
            data[key] = value

    return {
        "tam_sam_som": data
    }