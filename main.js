document.documentElement.classList.add("js");

const menu = document.querySelector(".menu");
const navigation = document.querySelector("#navigation");

function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("open", open);
}

menu.addEventListener("click", () => {
  setMenu(menu.getAttribute("aria-expanded") === "false");
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menu.focus();
  }
});

const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-category]");
const status = document.querySelector("#filter-status");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
    const category = button.dataset.filter;
    let visible = 0;
    cards.forEach((card) => {
      card.hidden = category !== "all" && card.dataset.category !== category;
      if (!card.hidden) visible += 1;
    });
    status.textContent = visible === 1 ? "1 categoria exibida." : `${visible} categorias exibidas.`;
  });
});

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((section) => observer.observe(section));
}

const quoteDialog = document.querySelector("#orcamento");
const quoteTrigger = document.querySelector(".quote-trigger");
const quoteForm = quoteDialog.querySelector("form");

quoteTrigger.addEventListener("click", () => quoteDialog.showModal());
quoteDialog.querySelector(".quote-close").addEventListener("click", () => quoteDialog.close());
quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const service = data.get("servico");
  const details = data.get("detalhes").trim();
  const lines = [
    "Olá, Ateliê Sales Criativo! Gostaria de solicitar um orçamento.",
    "",
    `*Serviço:* ${service}`
  ];
  if (details) lines.push(`*Detalhes do pedido:* ${details}`);
  const whatsapp = new URL(document.querySelector(".whatsapp").href);
  whatsapp.searchParams.set("text", lines.join("\n"));
  window.open(whatsapp, "_blank", "noopener,noreferrer");
});
