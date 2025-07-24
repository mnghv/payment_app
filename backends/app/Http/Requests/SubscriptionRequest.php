<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'plan_name' => 'required|string|in:Starter,Growth,Scaling,Enterprise',
            'price_id' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required.',
            'user_id.integer' => 'User ID must be an integer.',
            'user_id.exists' => 'User not found.',
            'plan_name.required' => 'Plan name is required.',
            'plan_name.string' => 'Plan name must be a string.',
            'plan_name.in' => 'Invalid plan name selected.',
            'price_id.required' => 'Price ID is required.',
            'price_id.string' => 'Price ID must be a string.',
        ];
    }
}
