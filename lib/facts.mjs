export async function loadFacts() {
 if (sessionStorage.facts) {
  return JSON.parse(sessionStorage.facts);
 } else {
  const raw = await fetch('/data/facts.json');
  const facts = await raw.json();

  sessionStorage.facts = JSON.stringify(facts);

  return facts;
 }
}