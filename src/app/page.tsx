
"use client";

import { useState } from "react";
import rules from "./rules.json";

type FAQ = {
  intent: string;
  question: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const faqs = rules as FAQ[];

const suggestions = [
  "What are the OPD timings?",
  "How can I contact the hospital?",
  "Are CT scans and ultrasound available?",
  "How do I make an appointment?",
];

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function getReply(message: string) {
  const query = normalise(message);

  const ranked = faqs
    .map((faq) => {
      const phrases = [faq.question, ...faq.keywords].map(normalise);

      const score = phrases.reduce((total, phrase) => {
        if (!phrase) return total;
        if (query === phrase) return total + 5;
        if (query.includes(phrase)) return total + 3;
        if (phrase.includes(query) && query.length > 4) return total + 1;
        return total;
      }, 0);

      return { faq, score };
    })
    .sort((a, b) => b.score - a.score);

  if (ranked[0]?.score > 0) return ranked[0].faq.reply;

  return "Sorry, I could not match your question to my available hospital FAQs. Please try asking about OPD timings, doctor availability, appointments, contact details, scans, blood-unit information or required documents. You can also contact the hospital at 048-9230829 to confirm information.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm the DHQ Sargodha Patient Information Assistant. What hospital information can I help you find today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const [typing, setTyping] = useState(false);

  function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    const answer = getReply(trimmed);

    setMessages((previous) => [
      ...previous,
      userMessage,
      {
        id: Date.now() + 1,
        sender: "bot",
        text: answer,
      },
    ]);

    setInput("");
    setTyping(true);
    window.setTimeout(() => setTyping(false), 350);
  }

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">+</span>
          <span>
            <strong>DHQ Sargodha</strong>
            <small>Patient Information Assistant</small>
          </span>
        </a>

        <a className="nav-contact" href="tel:0489230829">
          <span className="status-dot" />
          Hospital contact: 048-9230829
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="hero-photo" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" />
            HOSPITAL INFORMATION • SARGODHA
          </div>

          <h1>
            The right information.
            <br />
            <span>Before your visit.</span>
          </h1>

          <p>
            Find guidance on hospital contact details, OPD timings,
            appointments, diagnostic services and patient preparation.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => {
                setChatOpen(true);
                document.getElementById("assistant")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
            >
              Ask the assistant <span>↗</span>
            </button>

            <a className="secondary-button" href="tel:0489230829">
              <span>☎</span> Call hospital
            </a>
          </div>

          <div className="hero-note">
            Independent student project · Not an official hospital service
          </div>
        </div>

        <div className="hero-stat">
          <span className="stat-icon">✚</span>
          <div>
            <strong>Patient information</strong>
            <small>Simple answers to common questions</small>
          </div>
        </div>
      </section>

      <section className="information-section">
        <div className="section-heading">
          <span className="eyebrow dark-eyebrow">HOW WE CAN HELP</span>
          <h2>Find the information you need</h2>
          <p>
            Select a topic to start a conversation with the assistant.
          </p>
        </div>

        <div className="service-grid">
          {[
            {
              icon: "◷",
              title: "OPD & doctors",
              description: "Ask about outpatient timings and doctor availability.",
              question: "What are the OPD timings?",
            },
            {
              icon: "⌖",
              title: "Contact & location",
              description: "Find the listed phone number and location information.",
              question: "How can I contact DHQ Hospital Sargodha?",
            },
            {
              icon: "✚",
              title: "Diagnostic services",
              description: "Ask what is known about CT scans and ultrasound.",
              question: "Are CT scans and ultrasound available?",
            },
            {
              icon: "▤",
              title: "Visit preparation",
              description: "Learn what documents are useful to bring.",
              question: "What documents should I bring?",
            },
          ].map((item) => (
            <button
              key={item.title}
              className="service-card"
              onClick={() => {
                setChatOpen(true);
                sendMessage(item.question);
                document.getElementById("assistant")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
            >
              <span className="service-icon">{item.icon}</span>
              <strong>{item.title}</strong>
              <span className="service-description">{item.description}</span>
              <span className="card-arrow">Ask a question ↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="chat-section" id="assistant">
        <div className="chat-intro">
          <span className="eyebrow dark-eyebrow">YOUR INFORMATION ASSISTANT</span>
          <h2>What would you like to know?</h2>
          <p>
            Choose a suggested question or type your own. The assistant uses
            predefined FAQ answers and does not diagnose or prescribe.
          </p>
        </div>

        <div className="chat-layout">
          <div className="chat-side">
            <div className="side-icon">✳</div>
            <h3>Let's find your answer.</h3>
            <p>
              Ask about contact details, appointments, OPD, diagnostic services
              or preparing for your visit.
            </p>
            <div className="side-line" />
            <p className="side-small">
              If information is not verified, the assistant will tell you to
              confirm it with the hospital.
            </p>
          </div>

          <div className="chat-card">
            <div className="chat-header">
              <div className="chat-avatar">✚</div>
              <div className="chat-header-text">
                <strong>DHQ Information Assistant</strong>
                <span><span className="status-dot" /> Ready to help</span>
              </div>
              <button
                className="minimise-button"
                aria-label="Toggle conversation"
                onClick={() => setChatOpen(!chatOpen)}
              >
                {chatOpen ? "−" : "+"}
              </button>
            </div>

            {chatOpen && (
              <>
                <div className="chat-messages" aria-live="polite">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-row ${message.sender}`}
                    >
                      {message.sender === "bot" && (
                        <span className="message-avatar">✚</span>
                      )}
                      <div className="message-bubble">{message.text}</div>
                    </div>
                  ))}

                  {typing && (
                    <div className="message-row bot">
                      <span className="message-avatar">✚</span>
                      <div className="message-bubble typing">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                  )}
                </div>

                {messages.length === 1 && (
                  <div className="suggestions">
                    <span>TRY ASKING</span>
                    {suggestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => sendMessage(question)}
                      >
                        {question} <span>↗</span>
                      </button>
                    ))}
                  </div>
                )}

                <form
                  className="chat-input"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                >
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Type your hospital question..."
                    aria-label="Type your hospital question"
                  />
                  <button type="submit" disabled={!input.trim() || typing}>
                    Send <span>↑</span>
                  </button>
                </form>

                <div className="chat-footnote">
                  Do not enter personal medical details or identification numbers.
                </div>
              </>
            )}

            {!chatOpen && (
              <button
                className="reopen-chat"
                onClick={() => setChatOpen(true)}
              >
                Open conversation
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">+</span>
          <span>
            <strong>DHQ Sargodha Assistant</strong>
            <small>Patient information demo</small>
          </span>
        </a>

        <div className="footer-disclaimer">
          This is an independent educational project, not an official hospital
          service. Information may change. Verify current services, schedules
          and availability directly with the hospital. This assistant does not
          provide diagnosis, treatment or emergency assessment.
        </div>

        <a className="footer-phone" href="tel:0489230829">
          048-9230829 ↗
        </a>
      </footer>
    </main>
  );
}
