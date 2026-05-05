from app.database.database import SessionLocal
from app.models.topic_model import Topic

def seed_topics():
    db = SessionLocal()

    topics = [
        "Arrays", "Strings", "Linked List", "Stack",
        "Queue", "Hashing", "Recursion", "Backtracking",
        "Binary Search", "Sorting", "Two Pointers",
        "Sliding Window", "Greedy", "Heap / Priority Queue",
        "Trees", "Binary Trees", "Binary Search Trees",
        "Tries", "Graphs", "DFS", "BFS",
        "Dynamic Programming", "Bit Manipulation",
        "Math", "Matrix", "Segment Tree",
        "Disjoint Set (Union-Find)"
    ]

    for topic_name in topics:
        exists = db.query(Topic).filter(Topic.name.ilike(topic_name)).first()
        if not exists:
            db.add(Topic(name=topic_name))

    db.commit()
    db.close()