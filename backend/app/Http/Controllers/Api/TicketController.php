<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['requester', 'assignee']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }
        
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('subject', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'in:low,medium,high,urgent',
        ]);

        $ticket = Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority ?? 'low',
            'requester_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
        ]);

        return response()->json($ticket, 201);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['requester', 'assignee', 'comments.user']);
        
        // Hide internal notes for customers
        if (auth()->user()->role === 'customer') {
            $ticket->setRelation('comments', $ticket->comments->where('is_internal', false)->values());
        }

        return response()->json($ticket);
    }

    public function update(Request $request, Ticket $ticket)
    {
        if (auth()->user()->role === 'customer' && $ticket->requester_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ticket->update($request->only(['status', 'priority', 'assignee_id']));

        return response()->json($ticket);
    }

    public function addComment(Request $request, Ticket $ticket)
    {
        $request->validate([
            'body' => 'required|string',
            'is_internal' => 'boolean'
        ]);

        $isInternal = $request->input('is_internal', false);
        if (auth()->user()->role === 'customer' && $isInternal) {
            $isInternal = false;
        }

        $comment = $ticket->comments()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
            'is_internal' => $isInternal
        ]);

        return response()->json($comment->load('user'), 201);
    }
}
