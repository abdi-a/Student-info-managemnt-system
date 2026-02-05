<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);
        $notifications = DB::table('notifications')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
            
        return response()->json($notifications);
    }
    
    public function markAsRead(Request $request, $id)
    {
        DB::table('notifications')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->update(['is_read' => true]);
            
        return response()->json(['message' => 'Marked as read']);
    }
    
    public function markAllAsRead(Request $request)
    {
        DB::table('notifications')
            ->where('user_id', $request->user()->id)
            ->update(['is_read' => true]);
            
        return response()->json(['message' => 'All marked as read']);
    }

    // Helper to create functionality (optional, for demo)
    public function createDemoNotification(Request $request) 
    {
        DB::table('notifications')->insert([
            'user_id' => $request->user()->id,
            'title' => 'Welcome to SIMS',
            'message' => 'This is a test notification to verify the system works.',
            'type' => 'info',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        return response()->json(['message' => 'Notification created']);
    }
}
