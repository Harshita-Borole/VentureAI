import json

from utils.parser import parse_llm_json
from config.llm_config import llm


def marketing_revision_agent(state):

    prompt = f"""
    You are a startup growth strategist.

    Improve the marketing report using critic feedback.

    Return ONLY valid JSON.

    JSON FORMAT:

    {{
        "target_audience": [],
        "go_to_market_strategy": [],
        "social_media_campaigns": [],
        "branding_strategy": "",
        "launch_plan": [],
        "influencer_strategy": [],
        "sources": []
    }}

    CURRENT MARKETING REPORT:
    {json.dumps(state['marketing'], indent=2)}

    CRITIC FEEDBACK:
    {json.dumps(state['critic']['marketing_feedback'], indent=2)}
    """

    response = llm.invoke(prompt)

    data = parse_llm_json(response)

    return {
        "marketing": data
    }