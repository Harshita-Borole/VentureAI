# agents/ceo_agent.py

import json

from utils.parser import parse_llm_json
from utils.score_calculator import calculate_viability_score
from config.llm_config import llm


def ceo_agent(state):

    # =====================================================
    # PROMPT
    # =====================================================

    prompt = f"""
You are the CEO of an AI startup accelerator.

Analyze all department reports and generate a final
startup execution roadmap.

Also calculate startup viability scores using reasoning.

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- All scores must be integers between 1 and 10.

JSON FORMAT:

{{
    "startup_vision": "",

    "product_strategy": [],

    "technical_roadmap": [],

    "financial_plan": [],

    "market_positioning": "",

    "launch_strategy": [],

    "risks": [],

    "success_probability": "",

    "viability_score": {{

        "overall_score": 0,

        "market_potential": 0,

        "revenue_score": 0,

        "competition_score": 0,

        "scalability_score": 0,

        "ai_innovation_score": 0,

        "competition_risk": "",

        "revenue_potential": "",

        "execution_difficulty": "",

        "investment_attractiveness": "",

        "reasoning": ""
    }}
}}


PARSED STARTUP:
{json.dumps(state.get("parsed_idea", {}), indent=2)}

RESEARCH REPORT:
{json.dumps(state["research"], indent=2)}

FINANCE REPORT:
{json.dumps(state["finance"], indent=2)}

DEVELOPER REPORT:
{json.dumps(state["developer"], indent=2)}

MARKETING REPORT:
{json.dumps(state["marketing"], indent=2)}
"""

    # =====================================================
    # LLM CALL
    # =====================================================

    response = llm.invoke(prompt)

    print("\n========== CEO RAW RESPONSE ==========")
    print(response)

    # =====================================================
    # PARSE JSON
    # =====================================================

    data = parse_llm_json(response)

    # =====================================================
    # SAFETY FALLBACK - FILL ALL MISSING FIELDS
    # =====================================================

    if not isinstance(data, dict):

        data = {}

    default_fields = {
        "startup_vision": "",
        "product_strategy": [],
        "technical_roadmap": [],
        "financial_plan": [],
        "market_positioning": "",
        "launch_strategy": [],
        "risks": [],
        "success_probability": ""
    }

    for key, value in default_fields.items():

        if key not in data:
            data[key] = value

    if "viability_score" not in data:

        data["viability_score"] = {

            "overall_score": 0,

            "market_potential": 0,

            "revenue_score": 0,

            "competition_score": 0,

            "scalability_score": 0,

            "ai_innovation_score": 0,

            "competition_risk": "Unknown",

            "revenue_potential": "Unknown",

            "execution_difficulty": "Unknown",

            "investment_attractiveness": "Unknown",

            "reasoning": "Could not calculate viability."
        }
    # =====================================================
    # CALCULATE REAL OVERALL SCORE
    # =====================================================

    try:

        viability = data["viability_score"]

        market_score = float(
            viability.get("market_potential", 0)
        )

        revenue_score = float(
            viability.get("revenue_score", 0)
        )

        competition_score = float(
            viability.get("competition_score", 0)
        )

        scalability_score = float(
            viability.get("scalability_score", 0)
        )

        innovation_score = float(
            viability.get("ai_innovation_score", 0)
        )

        overall_score = calculate_viability_score(
            market_score=market_score,
            revenue_score=revenue_score,
            competition_score=competition_score,
            scalability_score=scalability_score,
            innovation_score=innovation_score
        )

        viability["overall_score"] = overall_score

    except Exception as e:

        print("Viability Score Error:", e)

        data["viability_score"]["overall_score"] = 0

    # =====================================================
    # RETURN
    # =====================================================

    return {
        "final_report": data
    }