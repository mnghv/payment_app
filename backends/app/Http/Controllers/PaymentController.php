<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subscription;
use App\Http\Requests\PaymentRequest;
use App\Http\Requests\SubscriptionRequest;
use App\Http\Requests\UserCheckRequest;
use App\Http\Requests\SubscriptionStatusRequest;
use Illuminate\Http\JsonResponse;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Subscription as StripeSubscription;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function savePaymentMethod(PaymentRequest $request): JsonResponse
    {

        try {
            $userInfo = $request->input('user_info');
            $paymentMethodId = $request->input('payment_method_id');

            $user = User::where('email', $userInfo['email'])->first();

            if (!$user) {
                $stripeCustomer = Customer::create([
                    'email' => $userInfo['email'],
                    'name' => $userInfo['name'],
                    'phone' => $userInfo['phone'],
                    'payment_method' => $paymentMethodId,
                    'invoice_settings' => [
                        'default_payment_method' => $paymentMethodId,
                    ],
                ]);

                $user = User::create([
                    'name' => $userInfo['name'],
                    'email' => $userInfo['email'],
                    'phone' => $userInfo['phone'],
                    'stripe_customer_id' => $stripeCustomer->id,
                    'password' => bcrypt(Str::random(16)),
                ]);
            } else {
                if ($user->stripe_customer_id) {
                    $stripeCustomer = Customer::update($user->stripe_customer_id, [
                        'payment_method' => $paymentMethodId,
                        'invoice_settings' => [
                            'default_payment_method' => $paymentMethodId,
                        ],
                    ]);
                } else {
                    $stripeCustomer = Customer::create([
                        'email' => $userInfo['email'],
                        'name' => $userInfo['name'],
                        'phone' => $userInfo['phone'],
                        'payment_method' => $paymentMethodId,
                        'invoice_settings' => [
                            'default_payment_method' => $paymentMethodId,
                        ],
                    ]);

                    $user->update(['stripe_customer_id' => $stripeCustomer->id]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment method saved successfully',
                'user_id' => $user->id,
                'stripe_customer_id' => $user->stripe_customer_id,
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe error: ' . $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function subscribe(SubscriptionRequest $request): JsonResponse
    {

        try {
            $userId = $request->input('user_id');
            $planName = $request->input('plan_name');
            $priceId = $request->input('price_id');

            $plans = [
                'Starter' => 299,
                'Growth' => 449,
                'Scaling' => 649,
                'Enterprise' => 899,
            ];

            $amount = $plans[$planName] ?? 0;

            $user = User::findOrFail($userId);

            if (!$user->stripe_customer_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'User has no saved payment method. Please save payment method first.',
                ], 400);
            }

            $stripeSubscription = StripeSubscription::create([
                'customer' => $user->stripe_customer_id,
                'items' => [
                    ['price' => $priceId],
                ],
                'payment_behavior' => 'default_incomplete',
                'payment_settings' => [
                    'save_default_payment_method' => 'on_subscription',
                ],
                'expand' => ['latest_invoice.payment_intent'],
            ]);

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'stripe_subscription_id' => $stripeSubscription->id,
                'stripe_price_id' => $priceId,
                'plan_name' => $planName,
                'amount' => $amount,
                'status' => $stripeSubscription->status,
                'current_period_start' => date('Y-m-d H:i:s', $stripeSubscription->current_period_start),
                'current_period_end' => date('Y-m-d H:i:s', $stripeSubscription->current_period_end),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Subscription created successfully',
                'subscription_id' => $subscription->id,
                'stripe_subscription_id' => $stripeSubscription->id,
                'status' => $stripeSubscription->status,
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe error: ' . $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function checkUserPaymentMethod(UserCheckRequest $request): JsonResponse
    {

        try {
            $user = User::where('email', $request->input('email'))->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'has_payment_method' => false,
                    'message' => 'User not found',
                ]);
            }

            return response()->json([
                'success' => true,
                'has_payment_method' => !empty($user->stripe_customer_id),
                'user_id' => $user->id,
                'user_info' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getSubscriptionStatus(SubscriptionStatusRequest $request): JsonResponse
    {

        try {
            $user = User::findOrFail($request->input('user_id'));
            $subscription = $user->subscriptions()->latest()->first();

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'No subscription found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'subscription' => [
                    'id' => $subscription->id,
                    'plan_name' => $subscription->plan_name,
                    'amount' => $subscription->amount,
                    'status' => $subscription->status,
                    'current_period_start' => $subscription->current_period_start,
                    'current_period_end' => $subscription->current_period_end,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
}
