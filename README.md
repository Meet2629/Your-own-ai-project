# 🚀 Vector Search + RAG Visualizer

An interactive full-stack application that demonstrates how modern AI systems work using **Vector Databases**, **Semantic Search**, and **RAG (Retrieval-Augmented Generation)** — with a visual canvas to understand it better.

---

## 🧠 Features

### 🔍 Semantic Search

* Converts text into embeddings using **Ollama**
* Searches similar data using:

  * HNSW (fast)
  * Brute Force (accurate)
  * KD-Tree (experimental)

### 📊 Vector Visualization

* Displays all stored documents as **dots**
* Query shown as a **⭐ star**
* Matching results are highlighted
* Helps understand how vector similarity works

### 🤖 RAG (Ask AI)

* Retrieves relevant context from database
* Sends it to LLM
* Generates accurate answers based on stored data

### 📄 Document Insertion

* Add custom documents
* Automatically converted into embeddings
* Stored in MongoDB + HNSW index

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Canvas API (for visualization)
* Custom CSS

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* HNSW Index (custom implementation)

### AI / ML

* Ollama (local LLM)

  * `nomic-embed-text` → embeddings
  * `llama3` → text generation

---

## ⚙️ Installation

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/vector-rag-app.git
cd vector-rag-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection
PORT=8080
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 4️⃣ Start Ollama

Make sure Ollama is running:

```bash
ollama run llama3
```

---

## 🔌 API Endpoints

### 📥 Insert Document

```
POST /api/vector/insert
```

### 🔍 Search

```
POST /api/vector/search
```

### 📚 Get All Docs

```
GET /api/vector/all
```

### 🤖 Ask AI (RAG)

```
POST /api/doc/ask
```

---

## 🎯 How It Works

1. Insert document → converted into embedding
2. Stored in MongoDB + indexed using HNSW
3. Query → converted into embedding
4. Similar vectors retrieved
5. (Optional) Sent to LLM for answer generation

---

## 🧪 Example

### Insert:

```json
{
  "text": "React is a frontend library"
}
```

### Query:

```
What is React?
```

### Output:

* Dot highlighted on canvas
* AI response generated using stored context

---

## 📸 UI Highlights

* ⭐ Query shown as star
* 🟢 Context documents shown as dots
* 🎯 Matching documents highlighted
* 🧠 Real-time vector search visualization

---

## 🚀 Future Improvements

* Smooth animation for query movement
* Real clustering (PCA / t-SNE)
* Tooltip on hover (show document text)
* Performance comparison between algorithms
* Streaming AI responses

---

## 👨‍💻 Author

**Meet Vaghasiya**
MERN Stack Developer | AI Enthusiast

---

## ⭐ Support

If you like this project:

* Give it a ⭐ on GitHub
* Share with others

---

## 📜 License

MIT License
