export interface CaptchaVerifyResponse {
  success: boolean;
  verified: boolean;
  version?: string;
  error?: string;
  details?: {
    time?: number;
    [key: string]: any;
  };
}

export const CAPTCHA_CHALLENGE_URL =
  import.meta.env.VITE_CAPTCHA_URL || "http://localhost:3000/challenge";

export const CAPTCHA_VERIFY_URL =
  import.meta.env.VITE_CAPTCHA_VERIFY_URL || "http://localhost:3000/verify";

/**
 * Memverifikasi payload Proof-of-Work ALTCHA ke captcha-server
 * @param payload String base64 payload yang dihasilkan oleh widget ALTCHA
 */
export async function verifyCaptcha(
  payload: string,
): Promise<CaptchaVerifyResponse> {
  if (!payload) {
    return {
      success: false,
      verified: false,
      error: "Payload CAPTCHA tidak boleh kosong.",
    };
  }

  try {
    const res = await fetch(CAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });

    const data: CaptchaVerifyResponse = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      verified: false,
      error:
        error?.message ||
        "Gagal terhubung ke server CAPTCHA. Pastikan captcha-server aktif.",
    };
  }
}
