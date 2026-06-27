<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Comment;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::create(['name' => 'Acme Corp']);

        $admin = User::create([
            'organization_id' => $org->id,
            'name' => 'Admin User',
            'email' => 'admin@acme.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $agents = [];
        for ($i = 1; $i <= 2; $i++) {
            $agents[] = User::create([
                'organization_id' => $org->id,
                'name' => "Agent $i",
                'email' => "agent$i@acme.com",
                'password' => Hash::make('password'),
                'role' => 'agent',
            ]);
        }

        $customers = [];
        for ($i = 1; $i <= 2; $i++) {
            $customers[] = User::create([
                'organization_id' => $org->id,
                'name' => "Customer $i",
                'email' => "customer$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]);
        }

        // Create ~12 tickets
        $statuses = ['open', 'pending', 'resolved', 'closed'];
        $priorities = ['low', 'medium', 'high', 'urgent'];

        for ($i = 1; $i <= 12; $i++) {
            $ticket = Ticket::create([
                'organization_id' => $org->id,
                'requester_id' => $customers[array_rand($customers)]->id,
                'assignee_id' => rand(0, 1) ? $agents[array_rand($agents)]->id : null,
                'subject' => "Issue with service #$i",
                'description' => "This is a detailed description for issue $i. Please help.",
                'status' => $statuses[array_rand($statuses)],
                'priority' => $priorities[array_rand($priorities)],
            ]);

            // Add some comments
            Comment::create([
                'ticket_id' => $ticket->id,
                'user_id' => $ticket->requester_id,
                'body' => 'I am still facing this problem.',
                'is_internal' => false,
            ]);

            if ($ticket->assignee_id) {
                Comment::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $ticket->assignee_id,
                    'body' => 'Looking into it now.',
                    'is_internal' => false,
                ]);
            }
        }
    }
}
