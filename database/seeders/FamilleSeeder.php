<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Famille;

class FamilleSeeder extends Seeder
{
    public function run(): void
    {
        Famille::factory()->count(5)->create();
    }
}
