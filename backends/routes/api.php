<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/save-payment-method', [PaymentController::class, 'savePaymentMethod']);
Route::post('/subscribe', [PaymentController::class, 'subscribe']);
Route::get('/subscription-status', [PaymentController::class, 'getSubscriptionStatus']);
Route::post('/check-user-payment-method', [PaymentController::class, 'checkUserPaymentMethod']);
