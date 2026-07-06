type PayPalPayoutItem = {
  email: string;
  amount: string;
  currency?: string;
  note?: string;
  payoutId: string;
};

type PayPalTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

function paypalBaseUrl() {
  return process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function paypalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
  }
  return Buffer.from(`${clientId}:${secret}`).toString("base64");
}

export async function getPayPalAccessToken() {
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${paypalCredentials()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`PayPal token request failed: ${response.status}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
}

export async function createPayPalPayoutBatch(items: PayPalPayoutItem[]) {
  if (items.length === 0) {
    throw new Error("Cannot create an empty PayPal payout batch");
  }

  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${paypalBaseUrl()}/v1/payments/payouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: `adlinkly_${Date.now()}`,
        email_subject: "Your Adlinkly creator payout is on the way",
        email_message: "Thanks for creating with Adlinkly. Your approved payout has been sent."
      },
      items: items.map((item) => ({
        recipient_type: "EMAIL",
        receiver: item.email,
        note: item.note || "Adlinkly creator payout",
        sender_item_id: item.payoutId,
        amount: {
          currency: item.currency || "EUR",
          value: item.amount
        }
      }))
    }),
    cache: "no-store"
  });

  const data = await response.json();
  if (!response.ok) {
    return { ok: false as const, status: response.status, data };
  }

  return { ok: true as const, status: response.status, data };
}
