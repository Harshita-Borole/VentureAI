# agents/executive_summary_agent.py

import json

from config.llm_config import llm
from utils.parser import parse_llm_json


def executive_summary_agent(state):

    idea = state["idea"]

    research = state.get("research", {})
    finance = state.get("finance", {})
    developer = state.get("developer", {})
    marketing = state.get("marketing", {})
    final_report = state.get("final_report", {})

    prompt = f"""
    You are an elite startup consultant.

    Create a concise executive summary
    for investors.

    Return ONLY valid JSON.

    JSON FORMAT:

    {{
        "summary": "",
        "problem": "",
        "solution": "",
        "market_size": "",
        "business_model": "",
        "competitive_advantage": "",
        "investment_potential": ""
    }}

    STARTUP IDEA:
    {idea}

    RESEARCH:
    {json.dumps(research, indent=2)}

    FINANCE:
    {json.dumps(finance, indent=2)}

    DEVELOPMENT:
    {json.dumps(developer, indent=2)}

    MARKETING:
    {json.dumps(marketing, indent=2)}

    FINAL REPORT:
    {json.dumps(final_report, indent=2)}
    """

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    if not isinstance(data, dict):

        data = {
            "summary": "",
            "problem": "",
            "solution": "",
            "market_size": "",
            "business_model": "",
            "competitive_advantage": "",
            "investment_potential": ""
        }

    return {
        "executive_summary": data
    }