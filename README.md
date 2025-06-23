# Z-CV ✨

> 🎓 Z-CV is a Gen Z–friendly résumé builder powered by AI.  
> Just answer a few smart questions, and we'll help you turn your real experience into a polished, professional LaTeX résumé.  

![Built with Bolt.new](https://bolt.new/badge.svg)

---

## 🌟 What is Z-CV?

**Z-CV** helps students and early-career professionals generate competitive résumés without the stress. Unlike AI tools that hallucinate fake experiences, Z-CV walks you through a structured conversation to uncover your real accomplishments — then generates a clean LaTeX résumé you can use right away.

---

## 🧑‍💻 Who is it for?

- Gen Z job seekers  
- First-time résumé writers  
- Internships / New grad roles  
- Anyone tired of rewriting their résumé for every job

---

## 💡 Why we built it

Most AI résumé tools try to guess what you've done based on a job description.  
Z-CV flips that: it focuses on **you** — your projects, your experience, your story.

We guide you through a smart prompt-driven process to **extract your real highlights** and express them clearly, honestly, and effectively.

---

## ⚙️ Features

- ✍️ Interactive résumé questionnaire (no blank page anxiety)
- 💬 LLM-powered résumé bullets tailored to your answers
- 📄 Generates clean LaTeX résumé
- 🧠 Local-first, no login, no tracking

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/yourname/z-cv.git
cd z-cv
## 2. Set your OpenAI API key
cp backend/.env.example backend/.env
# Then edit backend/.env and add your API key:
OPENAI_API_KEY=sk-...
```

---

## 3. Run locally

### Option A: With Docker

```bash
docker compose up --build
```

### Option B: Manual

In one terminal:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open your browser to: [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```bash
z-cv/
├─ backend/         # Flask API
│  ├─ app.py        # API routes
│  ├─ prompts.py    # Prompt logic
│  ├─ generators/   # LaTeX rendering engine
│  └─ .env.example
├─ frontend/        # React + Vite UI
│  └─ src/
├─ docker-compose.yml
├─ README.md
```

---

## 🧪 How it works

1. Answer 5–6 simple questions (education, projects, skills...)
2. Z-CV builds a custom prompt for LLM
3. GPT generates bullet points describing your experience
4. Z-CV renders a full `.tex` résumé with our starter LaTeX template
5. You copy/download the LaTeX → compile in Overleaf or PDF

---

## 🧠 Built With

- 🧪 Flask (Python)
- ⚛️ React + Vite
- 📄 Jinja2 + LaTeX
- 🤖 OpenAI API (GPT-3.5 / GPT-4)
- 🐳 Docker (optional)

---

## 🧰 Future Plans

- ✅ Multi-role résumé templates (SWE, DS, PM...)
- ✅ JD-aware matching (paste a JD → tailor your CV)
- ✅ Real-time PDF preview
- ✅ Gen Z–style résumé layout
- ✅ Add Chinese / multilingual support
- ✅ Human reviewer marketplace (coming soon…)
