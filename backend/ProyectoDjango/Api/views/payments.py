from .common import *
from stripe.error import StripeError

@api_view(["POST"])
@transaction.atomic
def create_payment(request):
    try:
        amount = request.data.get("amount")
        currency = request.data.get("currency", "crc")
        description = request.data.get("description", "Payment description")
        email = request.data.get("email")
        card_data = request.data.get("card_data")

        if not all([amount, email, card_data]):
            return Response(
                {"error": "Missing required fields: amount, email, card_data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        card_number = card_data.get("number")
        exp_month = card_data.get("exp_month")
        exp_year = card_data.get("exp_year")
        cvc = card_data.get("cvc")
        name = card_data.get("name")
        address = card_data.get("address", {})
        
        if not all([card_number, exp_month, exp_year, cvc, name]):
            return Response(
                {"error": "Missing or invalid card details"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_method = stripe.PaymentMethod.create(
            type="card",
            card={
                "number": card_number,
                "exp_month": exp_month,
                "exp_year": exp_year,
                "cvc": cvc,
            },
            billing_details={
                "name": name,
                "address": {
                    "line1": address.get("line1", ""),
                    "city": address.get("city", ""),
                    "postal_code": address.get("postal_code", ""),
                    "country": address.get("country", "US"),
                },
            },
        )

        if not payment_method or payment_method.get("id") is None:
            return Response(
                {"error": "Failed to create payment method"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        amount_fixed = int(float(amount) * 100)
        intent = stripe.PaymentIntent.create(
            amount=amount_fixed,
            currency=currency,
            payment_method=payment_method.id,
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
        print(str(e))
        return Response(
            {"error": f"Stripe error: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        print(f"Error in create_payment: {str(e)}")
        return Response(
            {"error": "An error occurred while processing the payment."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
