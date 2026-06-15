# agents/swot_agent.py

import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def swot_agent(state):

    prompt = f"""
You are a senior startup strategy consultant.

Perform a detailed SWOT analysis (Strengths, Weaknesses,
Opportunities, Threats) for this startup based on ALL the
information provided below — the original idea, parsed
details, market research, finance plan, technical plan,
and marketing plan.

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- Each list must contain 3 to 6 specific, concrete points
- Be specific to THIS startup, not generic advice

JSON FORMAT:

{{
    "strengths": [],
    "weaknesses": [],
    "opportunities": [],
    "threats": [],
    "summary": ""
}}

ORIGINAL IDEA:
{state.get("idea", "")}

PARSED STARTUP:
{json.dumps(state.get("parsed_idea", {}), indent=2)}

RESEARCH REPORT:
{json.dumps(state.get("research", {}), indent=2)}

FINANCE REPORT:
{json.dumps(state.get("finance", {}), indent=2)}

DEVELOPER REPORT:
{json.dumps(state.get("developer", {}), indent=2)}

MARKETING REPORT:
{json.dumps(state.get("marketing", {}), indent=2)}

CRITIC FEEDBACK:
{json.dumps(state.get("critic", {}), indent=2)}
"""

    response = llm.invoke(prompt)

    print("\n========== SWOT RAW RESPONSE ==========")
    print(response)

    data = parse_llm_json(response)

    if not isinstance(data, dict):
        data = {}

    defaults = {
        "strengths": [],
        "weaknesses": [],
        "opportunities": [],
        "threats": [],
        "summary": ""
    }

    for key, value in defaults.items():
        if key not in data:
            data[key] = value

    return {
        "swot": data
    }