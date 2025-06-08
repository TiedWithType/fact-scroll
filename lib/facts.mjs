import { getCookie } from "../agreements.mjs";

export async function loadFacts() {
  const hasConsent = !!getCookie("userAgreement_v2");

  if (hasConsent) {
    const storedFacts = localStorage.getItem("facts");
    if (storedFacts) {
      console.log("Pobieram fakty z localStorage");
      try {
        return JSON.parse(storedFacts);
      } catch {
        console.warn("Niepoprawny format facts w localStorage, usuwam");
        localStorage.removeItem("facts");
      }
    }
    console.log("Fetchuję fakty i zapisuję do localStorage");
    const raw = await fetch('/data/facts.json');
    const facts = await raw.json();
    localStorage.setItem("facts", JSON.stringify(facts));
    return facts;
  } else {
    console.log("Brak zgody - usuwam facts z localStorage jeśli istnieją");
    localStorage.removeItem("facts");

    const raw = await fetch('/data/facts.json');
    const facts = await raw.json();
    return facts;
  }
}