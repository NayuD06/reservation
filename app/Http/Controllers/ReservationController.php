<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::query();

        if ($request->search) {
            $query->where('customer_name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Reservations/Index', [
            'reservations' => $query->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Reservations/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'phone' => ['required', 'regex:/^[+]?[0-9]{8,15}$/'],
            'party_size' => 'required|integer|min:1|max:50',
            'reserved_at' => 'required|date|after_or_equal:now',
            'status' => 'required|in:pending,confirmed,seated,canceled',
        ]);

        Reservation::create($validated);

        return redirect('/reservations')->with('success', 'Created successfully');
    }

    public function edit(Reservation $reservation)
    {
        return Inertia::render('Reservations/Form', [
            'reservation' => $reservation,
        ]);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'phone' => ['required', 'regex:/^[+]?[0-9]{8,15}$/'],
            'party_size' => 'required|integer|min:1|max:50',
            'reserved_at' => 'required|date|after_or_equal:now',
            'status' => 'required|in:pending,confirmed,seated,canceled',
        ]);

        $reservation->update($validated);

        return redirect('/reservations')->with('success', 'Updated successfully');
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return redirect('/reservations')->with('success', 'Deleted successfully');
    }
}