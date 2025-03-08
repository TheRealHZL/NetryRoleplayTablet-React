import React, { useState } from "react";
import "./css/KnowledgeBase.css";

const KnowledgeBaseFire = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [articles, setArticles] = useState([
    { id: 1, title: "Reanimationsrichtlinien", category: "Notfälle", content: "Im Falle eines Herzstillstands ist die sofortige Herzdruckmassage erforderlich..." },
    { id: 2, title: "Medikament: Morphin", category: "Medikamente", content: "Morphin wird zur Schmerzlinderung eingesetzt. Maximale Dosis pro Stunde: 10mg." },
    { id: 3, title: "Schlaganfall erkennen", category: "Diagnosen", content: "Typische Symptome sind Gesichtslähmung, Sprachprobleme und Lähmung einer Körperseite." },
  ]);

  const [newArticle, setNewArticle] = useState({ title: "", category: "", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const addArticle = () => {
    if (newArticle.title && newArticle.category && newArticle.content) {
      setArticles([...articles, { ...newArticle, id: Date.now() }]);
      setNewArticle({ title: "", category: "", content: "" });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="knowledge-base-container">
      <header>
        <h1>Wissensdatenbank</h1>
        <p>Hier findest du wichtige Informationen zu Notfällen, Medikamenten und Diagnosen.</p>
      </header>

      {/* Such- und Filteroptionen */}
      <div className="search-filter">
        <input type="text" placeholder="Nach Artikel suchen..." value={searchQuery} onChange={handleSearch} />
        <select onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="Alle">Alle Kategorien</option>
          <option value="Notfälle">Notfälle</option>
          <option value="Medikamente">Medikamente</option>
          <option value="Diagnosen">Diagnosen</option>
        </select>
        <button onClick={() => setIsModalOpen(true)}>+ Neuer Artikel</button>
      </div>

      {/* Artikelübersicht */}
      <div className="articles-list">
        {articles
          .filter((article) =>
            (selectedCategory === "Alle" || article.category === selectedCategory) &&
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((article) => (
            <div key={article.id} className="article-card">
              <h3>{article.title}</h3>
              <span className="article-category">{article.category}</span>
              <p>{article.content.length > 100 ? article.content.substring(0, 100) + "..." : article.content}</p>
              <button onClick={() => alert(article.content)}>Lesen</button>
            </div>
          ))}
      </div>

      {/* Modal für neuen Artikel */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Neuen Artikel hinzufügen</h2>
            <input type="text" placeholder="Titel" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} />
            <select onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}>
              <option value="">Kategorie wählen</option>
              <option value="Notfälle">Notfälle</option>
              <option value="Medikamente">Medikamente</option>
              <option value="Diagnosen">Diagnosen</option>
            </select>
            <textarea placeholder="Inhalt" value={newArticle.content} onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} />
            <button onClick={addArticle}>Speichern</button>
            <button onClick={() => setIsModalOpen(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseFire;
