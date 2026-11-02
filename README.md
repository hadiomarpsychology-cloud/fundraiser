# LDT Sovereign Website — Interactive v2

Orange public identity; Asturian-inspired red and gold Sovereign Matrix portal.

## Run locally

```bash
cd ~/Downloads/LDT-Sovereign-Website-Interactive-v2
python3 -m http.server 8000
```
Open http://127.0.0.1:8000 .

## Working features
- Seven navigable responsive pages, original styling and site search.
- Reading-room outline with expandable sections and browser-local reading progress.
- Research reference drafting and copy (not verified citation formatting).
- Studio synthesizer and short note sequence playback.
- Ten-point governance cards, red-and-gold Sovereign Matrix section.
- Local AI chat API connection experiment, requiring an independently running local backend and browser permission.
- Payment integration section with disabled checkout until verified provider link.

## Not activated
No real payment processing, public hosted AI, private data uploads, user accounts, full manuscripts, or production security controls. Existing book content is editorial outline, not full supplied manuscript. Static site cannot provide server-side capabilities.

## Publishing
Review all claims and content before publishing. This ZIP is a preview build; it does not modify your live GitHub repository. Deploy to a separate test branch/repository first.


## Information Desk (v3)
The `ai.html` page is a deterministic, curated website Q&A desk, **not an AI system**. Its answers are defined in `assets/site.js` and linked to source pages. It performs no network requests, model inference, code execution, or uploads. Update the facts when site content changes. Unknown questions receive an explicit limitation. The simple keyword matcher can be ambiguous; it does not understand arbitrary natural-language questions.
