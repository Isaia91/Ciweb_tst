curl -X POST http://127.0.0.1:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"nom":"Clavier Pro","prix_ht":7500,"prix_achat":6400,"taux_tgc":11,"famille_id":1}'
