# agents/finance_agent.py
import json
import pandas as pd

from utils.parser import parse_llm_json
from config.llm_config import llm

salaries = pd.read_csv("datasets/salaries.csv")
cloud = pd.read_csv("datasets/cloud_costs.csv")


def calculate_runway(funding, monthly_burn):

    if monthly_burn == 0:
        return 0

    return round(funding / monthly_burn, 1)


def finance_agent(state):
    idea = state.get("idea", "")
    parsed_idea = state.get("parsed_idea", {})

    salary_data = salaries.head(20).to_string(index=False)

    cloud_data = cloud.head(20).to_string(index=False)

    estimated_funding = 500000

    prompt = f"""
    You are a startup CFO and SaaS finance strategist.

    Analyze:
    - MVP cost
    - runway
    - burn rate
    - SaaS metrics
    - monetization
    - CAC
    - LTV
    - scaling costs
    - every feature separately
    - revenue model
    - target audience
    - scaling requirements

    Return ONLY valid JSON.

    JSON FORMAT:

    {{
        "mvp_cost": 0,
        "monthly_team_cost": 0,
        "cloud_cost": 0,
        "marketing_budget": 0,
        "first_year_budget": 0,
        "revenue_projection": 0,
        "burn_rate": 0,
        "cac_estimate": 0,
        "ltv_estimate": 0,
        "pricing_model": "",
        "recommended_funding": 0
    }}

    PARSED STARTUP:
    {json.dumps(parsed_idea, indent=2)}

    ORIGINAL IDEA:
    {idea}

    SALARY DATA:
    {salary_data}

    CLOUD DATA:
    {cloud_data}
    """

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    if not isinstance(data, dict):
        data = {
            "mvp_cost": 0,
            "monthly_team_cost": 0,
            "cloud_cost": 0,
            "marketing_budget": 0,
            "first_year_budget": 0,
            "revenue_projection": 0,
            "burn_rate": 0,
            "cac_estimate": 0,
            "ltv_estimate": 0,
            "pricing_model": "",
            "recommended_funding": 0
        }

    monthly_burn = (
        data.get("monthly_team_cost", 0)
        + data.get("cloud_cost", 0)
        + data.get("marketing_budget", 0)
    )

    runway = calculate_runway(
        estimated_funding,
        monthly_burn
    )

    data["estimated_runway_months"] = runway

    return {
        "finance": data
    }