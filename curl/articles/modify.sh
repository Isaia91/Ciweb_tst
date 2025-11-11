curl -X PUT http://127.0.0.1:8000/api/articles/3 \
  -H "Content-Type: application/json" \
  --data-raw '{"nom":"Test MAJ","prix_ht":2222.22,"prix_achat":1500.00,"taux_tgc":22,"famille_id":4}'
