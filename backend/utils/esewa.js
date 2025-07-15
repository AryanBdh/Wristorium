import dotenv from "dotenv"
import crypto from "crypto" // Import crypto module for signature generation
dotenv.config()

// Function to get eSewa payment parameters for v2 API
export const getEsewaPaymentParams = ({ amount, transaction_uuid }) => {
  const total_amount = Math.round(amount) // eSewa expects whole numbers

  // Ensure secretKey is trimmed of any potential quotes or whitespace
  const secretKey = process.env.ESEWA_SECRET_KEY.replace(/"/g, "").trim()
  const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"

  const dataToHash = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${productCode}`

  // Generate signature using HMAC SHA256
  const signature = crypto.createHmac("sha256", secretKey).update(dataToHash).digest("base64")

  return {
    amount: total_amount,
    tax_amount: 0, // As per example
    total_amount: total_amount,
    transaction_uuid: transaction_uuid, // Unique ID for the transaction (e.g., order ID)
    product_code: productCode, // Merchant code
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: `http://localhost:5000/api/payments/esewa/success`, // Corrected: Points to backend
    failure_url: `http://localhost:5000/api/payments/esewa/failure`, // Corrected: Points to backend
    signed_field_names: "total_amount,transaction_uuid,product_code", // Fields used for signature
    signature: signature, // Generated signature
  }
}

// Function to verify eSewa payment from callback data
export async function verifyEsewaPayment(encodedData) {
  try {
    // Decoding base64 code received from esewa using Buffer for Node.js compatibility
    let decodedData = Buffer.from(encodedData, "base64").toString("utf8")
    decodedData = JSON.parse(decodedData)

    // Ensure secretKey is trimmed
    const secretKey = process.env.ESEWA_SECRET_KEY.replace(/"/g, "").trim()
    const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"

    const dataToHash = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${productCode},signed_field_names=${decodedData.signed_field_names}`
    const hash = crypto.createHmac("sha256", secretKey).update(dataToHash).digest("base64")

    console.log("Generated Hash for Verification:", hash)
    console.log("Received Signature from eSewa:", decodedData.signature)

    if (hash !== decodedData.signature) {
      throw { message: "Invalid signature", decodedData }
    }

    // Verify transaction status with eSewa API (as per example's esewa.js)
    const statusCheckUrl = `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${productCode}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`
    console.log("Verifying transaction status with eSewa:", statusCheckUrl)

    const response = await fetch(statusCheckUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`eSewa status check failed: ${response.status} - ${errorText}`)
    }

    const responseData = await response.json()
    console.log("eSewa Status Check Response:", responseData)

    if (
      responseData.status !== "COMPLETE" ||
      responseData.transaction_uuid !== decodedData.transaction_uuid ||
      Number(responseData.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw { message: "Transaction status mismatch or incomplete", responseData, decodedData }
    }

    return { response: responseData, decodedData }
  } catch (error) {
    console.error("Error in verifyEsewaPayment:", error)
    throw error
  }
}

// eSewa configuration with correct URLs
export const ESEWA_CONFIG = {
  // Use the correct eSewa v2 payment URL from the example
  PAYMENT_URL: process.env.ESEWA_GATEWAY_URL + "/api/epay/main/v2/form",
  MERCHANT_CODE: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST", // Renamed to PRODUCT_CODE
}
