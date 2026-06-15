# agents/marketing_agent.py

import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def marketing_agent(state):

    # =====================================================
    # GET IDEA
    # =====================================================
    idea = state.get("idea", "")
    parsed_idea = state.get("parsed_idea", {})

    # =====================================================
    # GET RESEARCH DATA
    # =====================================================

    research_data = state.get("research", {})

    competitors = research_data.get("competitors", [])
    market_trends = research_data.get("market_trends", [])
    opportunities = research_data.get("opportunities", [])

    # =====================================================
    # PROMPT
    # =====================================================

    prompt = f"""
You are an expert startup marketing strategist.

Your job is to create:
- marketing strategy
- launch strategy
- audience targeting
- branding
- influencer campaigns

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text

JSON FORMAT:

{{
    "target_audience": [],
    "go_to_market_strategy": [],
    "social_media_campaigns": [],
    "branding_strategy": "",
    "launch_plan": [],
    "influencer_strategy": [],
    "marketing_channels": [],
    "customer_acquisition_strategy": [],
    "growth_hacks": [],
    "estimated_cac": "",
    "estimated_ltv": "",
    "brand_positioning": "",
    "sources": []
}}

PARSED STARTUP:
{json.dumps(parsed_idea, indent=2)}

ORIGINAL IDEA:
{idea}

COMPETITORS:
{json.dumps(competitors, indent=2)}

MARKET TRENDS:
{json.dumps(market_trends, indent=2)}

OPPORTUNITIES:
{json.dumps(opportunities, indent=2)}

IMPORTANT:
Add real and relevant industry/research URLs in "sources".

Example:
"sources": [
    "https://www.statista.com/",
    "https://techcrunch.com/",
    "https://www.cbinsights.com/"
]
"""

    # =====================================================
    # LLM CALL
    # =====================================================

    response = llm.invoke(prompt)

    # =====================================================
    # PARSE JSON
    # =====================================================

    data = parse_llm_json(response)

    # =====================================================
    # FALLBACK SAFETY
    # =====================================================

    if not isinstance(data, dict):

        data = {

            "target_audience": [],
            "go_to_market_strategy": [],
            "social_media_campaigns": [],
            "branding_strategy": "",
            "launch_plan": [],
            "influencer_strategy": [],
            "marketing_channels": [],
            "customer_acquisition_strategy": [],
            "growth_hacks": [],
            "estimated_cac": "",
            "estimated_ltv": "",
            "brand_positioning": "",
            "sources": []
        }

    # =====================================================
    # RETURN
    # =====================================================

    return {
        "marketing": data
    }