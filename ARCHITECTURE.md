# PulseDesk Architecture

## Data Model
- **Organization**: `id`, `name`, `timestamps`
- **User**: `id`, `name`, `email`, `password`, `organization_id`, `role` (admin, agent, customer)
- **Ticket**: `id`, `subject`, `description`, `status` (open, pending, resolved, closed), `priority` (low, medium, high, urgent), `organization_id`, `requester_id`, `assignee_id`
- **Comment**: `id`, `ticket_id`, `user_id`, `body`, `is_internal` (boolean)

## Multi-tenancy Approach
- Tenancy is enforced at the query level by appending `where('organization_id', auth()->user()->organization_id)`.
- Global scopes on Models to auto-apply isolation.

## API Routes
- Auth: `POST /api/login`, `POST /api/register`, `POST /api/logout`
- Tickets: `GET /api/tickets`, `POST /api/tickets`, `GET /api/tickets/{id}`, `PUT /api/tickets/{id}`, `DELETE /api/tickets/{id}`
- Comments: `POST /api/tickets/{id}/comments`
