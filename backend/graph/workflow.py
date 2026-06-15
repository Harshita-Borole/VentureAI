# graph/startup_graph.py
from agents.swot_agent import swot_agent
from agents.tam_sam_som_agent import tam_sam_som_agent
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, END

# =========================================================
# MAIN AGENTS
# =========================================================

from agents.idea_parser_agent import idea_parser_agent

from agents.research_agent import research_agent
from agents.finance_agent import finance_agent
from agents.developer_agent import developer_agent
from agents.marketing_agent import marketing_agent
from agents.ceo_agent import ceo_agent

# =========================================================
# REFLECTION / CRITIC AGENTS
# =========================================================

from agents.critic_agent import critic_agent
from agents.finance_revision_agent import finance_revision_agent
from agents.developer_revision_agent import developer_revision_agent
from agents.marketing_revision_agent import marketing_revision_agent

# =========================================================
# NEW FEATURE AGENTS
# =========================================================

from agents.pitch_deck_agent import pitch_deck_agent
from agents.executive_summary_agent import executive_summary_agent

# =========================================================
# GLOBAL STATE
# =========================================================

class StartupState(TypedDict):

    idea: str

    parsed_idea: dict

    research: dict

    finance: dict

    developer: dict

    marketing: dict

    critic: dict

    final_report: dict

    pitch_deck: dict

    executive_summary: str

    swot: dict

    tam_sam_som: dict


# =========================================================
# CREATE GRAPH
# =========================================================

workflow = StateGraph(StartupState)

# =========================================================
# ADD CORE NODES
# =========================================================

workflow.add_node(
    "idea_parser",
    idea_parser_agent
)

workflow.add_node(
    "research",
    research_agent
)

workflow.add_node(
    "finance",
    finance_agent
)

workflow.add_node(
    "developer",
    developer_agent
)

workflow.add_node(
    "marketing",
    marketing_agent
)

workflow.add_node(
    "critic",
    critic_agent
)

workflow.add_node(
    "finance_revision",
    finance_revision_agent
)

workflow.add_node(
    "developer_revision",
    developer_revision_agent
)

workflow.add_node(
    "marketing_revision",
    marketing_revision_agent
)

workflow.add_node(
    "ceo",
    ceo_agent
)

# =========================================================
# NEW INVESTOR / PITCH NODES
# =========================================================

workflow.add_node(
    "pitch_deck",
    pitch_deck_agent
)

workflow.add_node(
    "executive_summary",
    executive_summary_agent
)

# =========================================================
# ENTRY POINT
# =========================================================

workflow.set_entry_point("idea_parser")

# =========================================================
# IDEA PARSER -> RESEARCH
# =========================================================

workflow.add_edge(
    "idea_parser",
    "research"
)

# =========================================================
# RESEARCH -> PARALLEL AGENTS
# =========================================================

workflow.add_edge("research", "finance")

workflow.add_edge("research", "developer")

workflow.add_edge("research", "marketing")

# =========================================================
# FIRST PASS -> CRITIC
# =========================================================

workflow.add_edge("finance", "critic")

workflow.add_edge("developer", "critic")

workflow.add_edge("marketing", "critic")

# =========================================================
# CRITIC -> REVISION PHASE
# =========================================================

workflow.add_edge(
    "critic",
    "finance_revision"
)

workflow.add_edge(
    "critic",
    "developer_revision"
)

workflow.add_edge(
    "critic",
    "marketing_revision"
)

# =========================================================
# REVISIONS -> CEO
# =========================================================

workflow.add_edge(
    "finance_revision",
    "ceo"
)

workflow.add_edge(
    "developer_revision",
    "ceo"
)

workflow.add_edge(
    "marketing_revision",
    "ceo"
)

# =========================================================
# CEO -> INVESTOR MATERIALS
# =========================================================

workflow.add_node(
    "swot",
    swot_agent
)

workflow.add_node(
    "tam_sam_som",
    tam_sam_som_agent
)


workflow.add_edge(
    "ceo",
    "pitch_deck"
)

workflow.add_edge(
    "ceo",
    "swot"
)

workflow.add_edge(
    "ceo",
    "tam_sam_som"
)

workflow.add_edge(
    "pitch_deck",
    "executive_summary"
)

workflow.add_edge(
    "swot",
    "executive_summary"
)

workflow.add_edge(
    "tam_sam_som",
    "executive_summary"
)



# =========================================================
# END
# =========================================================

workflow.add_edge(
    "executive_summary",
    END
)

# =========================================================
# COMPILE GRAPH
# =========================================================

graph = workflow.compile()

print("🚀 Advanced Reflective Multi-Agent Startup Workflow Compiled")
print("✅ Idea Parser Agent")
print("✅ Research Agent")
print("✅ Finance Agent")
print("✅ Developer Agent")
print("✅ Marketing Agent")
print("✅ Critic Reflection System")
print("✅ Revision Agents")
print("✅ CEO Agent")
print("✅ Pitch Deck Generator")
print("✅ Executive Summary Generator")