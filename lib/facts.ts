export async function loadFacts(src) {
 const raw = await fetch(`/data/${src}.json`);
 const facts = await raw.json();
 return facts;
}
