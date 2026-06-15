import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def finance_revision_agent(state):

    prompt = f"""
    You are a senior startup finance expert.

    Improve the finance report using critic feedback.

    Return ONLY valid JSON.

    JSON FORMAT:

    {{
        "mvp_cost": 0,
        "monthly_team_cost": 0,
        "cloud_cost": 0,
        "marketing_budget": 0,
        "first_year_budget": 0,
        "revenue_projection": 0
    }}

    CURRENT FINANCE REPORT:
    {json.dumps(state['finance'], indent=2)}

    CRITIC FEEDBACK:
    {json.dumps(state['critic']['finance_feedback'], indent=2)}
    """

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    return {
        "finance": data
    }