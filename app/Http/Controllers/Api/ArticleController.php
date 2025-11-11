<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class
ArticleController extends Controller
{

    // récupère tous les articles avec leur famille associée
    public function index()
    {
        $articles = Article::with('famille')->get();

        return response()->json($articles);
    }

    // charge aussi la famille liée
    public function show(Article $article)
    {
        $article->load('famille');

        return response()->json($article);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'        => ['required','string','max:255'],
            'prix_ht'    => ['required','numeric','min:1000','max:10000'],
            'prix_achat' => ['required','numeric','lt:prix_ht'],
            'taux_tgc'   => ['required', Rule::in([3,6,11,22])],
            'famille_id' => ['required','exists:familles,id'],
        ]);

        $article = Article::create($data)
            ->load('famille');

        return response()->json([
            'message' => 'Article créé',
            'data'    => $article,
        ], 201);
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'nom'        => ['sometimes','required','string','max:255'],
            'prix_ht'    => ['sometimes','required','numeric','min:1000','max:10000'],
            'prix_achat' => ['sometimes','required','numeric','lt:prix_ht'],
            'taux_tgc'   => ['sometimes','required', \Illuminate\Validation\Rule::in([3,6,11,22])],
            'famille_id' => ['sometimes','required','exists:familles,id'],
        ]);

        // Applique les valeurs reçues
        $article->fill($data);

        // S'il n'y a *aucun* changement, on le dit clairement
        if (! $article->isDirty()) {
            return response()->json([
                'message' => 'Aucune modification détectée dans la requête',
                'received' => $data,
                'data' => $article->fresh()->load('famille'),
            ], 422);
        }

        $article->save();

        $article->refresh()->load('famille');

        return response()->json([
            'message' => 'Article mis à jour',
            'data'    => $article,
        ]);
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return response()->json([
            'message' => 'Article supprimé'
        ]);
    }

    public function exportCsv(): StreamedResponse
    {
        $articles = \App\Models\Article::with('famille')->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="articles.csv"',
            'Cache-Control'       => 'no-store, no-cache',
        ];

        return response()->stream(function () use ($articles) {
            $out = fopen('php://output', 'w');

            // BOM UTF-8 pour Excel
            fputs($out, "\xEF\xBB\xBF");

            // En-têtes CSV (séparateur ;)
            fputcsv($out, [
                'id','nom','prix_ht','prix_achat','taux_tgc',
                'famille_id','famille','prix_ttc','marge'
            ], ';');

            foreach ($articles as $a) {
                $prixHt   = (float) $a->prix_ht;
                $prixAcht = (float) $a->prix_achat;
                $tgc      = (float) $a->taux_tgc;

                $prixTtc = $prixHt * (1 + $tgc / 100);     // TTC = HT * (1 + TGC/100)
                $marge   = $prixHt - $prixAcht;

                fputcsv($out, [
                    $a->id,
                    $a->nom,
                    number_format($prixHt,   2, '.', ''),   // 2 décimales
                    number_format($prixAcht, 2, '.', ''),
                    number_format($tgc,      2, '.', ''),
                    $a->famille_id,
                    optional($a->famille)->nom,
                    number_format($prixTtc,  2, '.', ''),
                    number_format($marge,    2, '.', ''),
                ], ';');
            }

            fclose($out);
        }, 200, $headers);
    }

}
