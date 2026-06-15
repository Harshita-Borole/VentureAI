# VentureAI – AI Multi-Agent Startup Intelligence Platform

## Overview

VentureAI is an AI-powered startup intelligence platform that transforms startup ideas into investor-ready business blueprints using a multi-agent architecture built with LangGraph.

The platform performs deep startup analysis across market research, financial feasibility, technical architecture, go-to-market strategy, competitive positioning, SWOT analysis, and market sizing. Within seconds, it generates comprehensive business intelligence reports and investor-ready recommendations.

---

## Key Highlights

* 13 specialized AI agents orchestrated using LangGraph
* Parallel multi-agent execution for faster analysis
* Critic-reflection workflow for self-improving outputs
* Real-time market intelligence using Tavily Search
* Automated pitch deck generation
* Startup viability scoring engine
* Investor-ready executive summaries
* End-to-end full-stack implementation with Flask and React

---

### Key Features

- Multi-Agent AI Workflow powered by LangGraph
- Reflection-Based Critic and Revision System
- Real-Time Market Research using Tavily Search
- Startup Viability Scoring Engine
- Competitor Feature Comparison Matrix
- TAM/SAM/SOM Market Sizing
- Automated SWOT Analysis
- Investor Pitch Deck Generation
- Context-Aware Startup Chat Assistant

### Core Analysis Agents

* Idea Parser Agent
* Research Agent
* Finance Agent
* Developer Agent
* Marketing Agent
* CEO Agent

### Reflection & Quality Control Agents

* Critic Agent
* Finance Revision Agent
* Developer Revision Agent
* Marketing Revision Agent

### Strategic Intelligence Agents

* SWOT Analysis Agent
* TAM/SAM/SOM Market Sizing Agent
* Pitch Deck Agent
* Executive Summary Agent

---


## Technology Stack

### Backend

* Python
* Flask
* LangGraph
* LangChain

### AI & Multi-Agent Systems

* Google Gemini
* Prompt Engineering
* Reflection-Based Reasoning
* Multi-Agent Orchestration

### Search & Intelligence

* Tavily Search API
* Real-Time Market Research


### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Architecture

* REST APIs
* Modular Agent Design
* Stateful Workflow Graphs

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Harshita-Borole/VentureAI.git
cd VentureAI
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### Run Backend

```bash
cd backend
python app.py
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Future Enhancements

* PDF Export for Reports
* Startup Benchmarking Engine
* Multi-Startup Comparison
* Funding Opportunity Discovery
* Team Formation Recommendations
* Autonomous Planning Agents
* Analytics Dashboard



Built using LangGraph, LangChain, Google Gemini, Flask, React, ChromaDB, and Tavily Search.
