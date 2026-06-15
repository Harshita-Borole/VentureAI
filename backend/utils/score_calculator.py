def calculate_viability_score(
    market_score,
    revenue_score,
    competition_score,
    scalability_score,
    innovation_score
):

    overall = (
        0.30 * market_score +
        0.20 * revenue_score +
        0.20 * competition_score +
        0.15 * scalability_score +
        0.15 * innovation_score
    )

    return round(overall, 1)