<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Famille;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        // Prix HT
        $prixHt = $this->faker->randomFloat(2, 1000, 10000);

        // Prix d'achat strictement inférieur au prix HT (entre 60% et 95% du HT)
        $prixAchat = round($prixHt * $this->faker->randomFloat(2, 0.60, 0.95), 2);

        return [
            'nom'        => ucfirst($this->faker->unique()->words(mt_rand(1, 3), true)),
            'prix_ht'    => $prixHt,
            'prix_achat' => $prixAchat,
            'taux_tgc'   => $this->faker->randomElement([3, 6, 11, 22]),
            // prend un id famille existante au hasard
            'famille_id' => fn () => Famille::query()->inRandomOrder()->value('id')
        ];
    }
}
