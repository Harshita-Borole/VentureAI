# agents/pitch_deck_agent.py

import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def pitch_deck_agent(state):

    # =====================================================
    # PROMPT
    # =====================================================

    prompt = f"""
    You are an elite startup fundraising strategist.

    Your personality combines:

    - YC Partner
    - Sequoia Capital Investor
    - Andreessen Horowitz Partner
    - Startup Founder
    - Venture Capital Analyst

    Your job is to generate:

    - investor-ready pitch deck
    - executive summary
    - fundraising narrative
    - startup storytelling
    - investment thesis

    IMPORTANT:
    - Return ONLY valid JSON
    - No markdown
    - No explanations
    - No extra text

    The pitch deck should sound:
    - highly strategic
    - investor-focused
    - realistic
    - persuasive
    - startup specific

    JSON FORMAT:

    {{
        "executive_summary": "",

        "elevator_pitch": "",

        "funding_ask": "",
 
        "investment_thesis": "",

        "slides": [

            {{
                "slide_title": "",
                "slide_content": []
            }}
        ]
    }}

    PARSED STARTUP:
    {json.dumps(state.get("parsed_idea", {}), indent=2)}

    ORIGINAL IDEA:
    {state["idea"]}

    RESEARCH DATA:
    {json.dumps(state["research"], indent=2)}

    FINANCE DATA:
    {json.dumps(state["finance"], indent=2)}

    DEVELOPMENT DATA:
    {json.dumps(state["developer"], indent=2)}

    MARKETING DATA:
    {json.dumps(state["marketing"], indent=2)}

    FINAL REPORT:
    {json.dumps(state["final_report"], indent=2)}

    Generate slides for:

    - Problem
    - Solution
    - Product Features
    - Market Opportunity
    - AI Architecture
    - Business Model
    - Competitors
    - Go-To-Market
    - Financial Projection
    - Investment Ask
    - Vision

    IMPORTANT:

    The "Product Features" slide MUST list ALL features from PARSED STARTUP.

    For each feature include:
    - feature name
    - user benefit
    - business value

    Do not omit any feature.

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
    # FALLBACK
    # =====================================================

    if not isinstance(data, dict):

        data = {

            "executive_summary": "",

            "elevator_pitch": "",

            "funding_ask": "",

            "investment_thesis": "",

            "slides": []
        }

    # =====================================================
    # RETURN
    # =====================================================

    return {
        "pitch_deck": data
    }