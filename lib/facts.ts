export async function loadFacts(src) {
 const raw = await fetch(src);
 const facts = await raw.json();
 return facts;
}
