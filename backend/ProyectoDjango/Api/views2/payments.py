from .common import *


from stripe.error import StripeError

@api_view(["POST"])
@transaction.atomic
def create_payment(request):
    try:
        amount = request.data.get("amount")
        currency = request.data.get("currency", "usd")
        description = request.data.get("description", "Payment description")
        email = request.data.get("email")
        payment_method_id = request.data.get("payment_method_id")

        if not all([amount, email, payment_method_id]):
            return Response(
                {"error": "Missing required fields: amount, email, payment_method_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        amount_in_cents = int(float(amount) * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency=currency,
            payment_method=payment_method_id,
            receipt_email=email,
            description=description,
            confirm=True,
        )

        return Response(
            {
                "message": "Payment successful",
                "payment_id": intent.id,
                "status": intent.status,
                "amount": intent.amount / 100,
            },
            status=status.HTTP_201_CREATED,
        )

    except StripeError as e:
        # Handle Stripe-specific errors
        return Response(
            {"error": f"Stripe error: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        # Handle other errors
        print(f"Error in create_payment: {str(e)}")
        return Response(
            {"error": "An error occurred while processing the payment."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )