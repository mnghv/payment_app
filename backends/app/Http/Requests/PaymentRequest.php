<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_method_id' => 'required|string',
            'user_info.name' => 'required|string|max:255',
            'user_info.email' => 'required|email|max:255',
            'user_info.phone' => 'required|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method_id.required' => 'Payment method ID is required.',
            'payment_method_id.string' => 'Payment method ID must be a string.',
            'user_info.name.required' => 'Name is required.',
            'user_info.name.string' => 'Name must be a string.',
            'user_info.name.max' => 'Name cannot exceed 255 characters.',
            'user_info.email.required' => 'Email is required.',
            'user_info.email.email' => 'Please enter a valid email address.',
            'user_info.email.max' => 'Email cannot exceed 255 characters.',
            'user_info.phone.required' => 'Phone number is required.',
            'user_info.phone.string' => 'Phone number must be a string.',
            'user_info.phone.max' => 'Phone number cannot exceed 20 characters.',
        ];
    }
}
