import chromadb
import uuid

# =====================================================
# INIT CHROMA DB
# =====================================================

client = chromadb.PersistentClient(path="memory_db")

collection = client.get_or_create_collection(
    name="startup_memory"
)

# =====================================================
# SAVE MEMORY
# =====================================================

def save_startup_memory(idea, report):

    doc_id = str(uuid.uuid4())

    text = f"""
    STARTUP IDEA:
    {idea}

    REPORT:
    {report}
    """

    collection.add(
        documents=[text],
        ids=[doc_id]
    )

# =====================================================
# GET RELEVANT MEMORY (FIXED NAME)
# =====================================================

def get_relevant_memory(query, k=3):

    results = collection.query(
        query_texts=[query],
        n_results=k
    )

    return results