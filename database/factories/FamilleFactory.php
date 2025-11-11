<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FamilleFactory extends Factory
{
    public function definition(): array
    {

        return [
            'nom' => fake()->unique()->words(rand(1, 5), true),
        ];
    }
}
