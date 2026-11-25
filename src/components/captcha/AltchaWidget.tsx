import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Box, Text } from "@mantine/core";
import { CAPTCHA_CHALLENGE_URL } from "../../services/captcha.service";

export interface AltchaWidgetRef {
  reset: () => void;
  getPayload: () => string | null;
  getState: () => string;
}

export interface AltchaWidgetProps {
  challengeUrl?: string;
  onVerified?: (payload: string) => void;
  onStateChange?: (state: string, payload: string | null) => void;
  hideFooter?: boolean;
  hideLogo?: boolean;
  auto?: "onload" | "onsubmit" | undefined;
  test?: boolean;
  className?: string;
}

const DEFAULT_INDONESIAN_STRINGS = JSON.stringify({
  label: "Verifikasi bahwa Anda bukan robot",
  verifying: "Memverifikasi...",
  verified: "Terverifikasi",
  error: "Verifikasi gagal, silakan coba lagi",
});

export const AltchaWidget = forwardRef<AltchaWidgetRef, AltchaWidgetProps>(
  (
    {
      challengeUrl = CAPTCHA_CHALLENGE_URL,
      onVerified,
      onStateChange,
      hideFooter = false,
      hideLogo = false,
      auto,
      test = false,
      className,
    },
    ref,
  ) => {
    const widgetRef = useRef<HTMLElement | null>(null);
    const [currentState, setCurrentState] = useState<string>("unverified");
    const [payload, setPayload] = useState<string | null>(null);
    const [widgetKey, setWidgetKey] = useState<number>(0);

    const reset = () => {
      setPayload(null);
      setCurrentState("unverified");
      if (widgetRef.current && (widgetRef.current as any).reset) {
        try {
          (widgetRef.current as any).reset();
        } catch {
          // Jika method reset tidak tersedia, picu re-mount komponen
          setWidgetKey((prev) => prev + 1);
        }
      } else {
        setWidgetKey((prev) => prev + 1);
      }
    };

    useImperativeHandle(ref, () => ({
      reset,
      getPayload: () => payload,
      getState: () => currentState,
    }));

    useEffect(() => {
      const el = widgetRef.current;
      if (!el) return;

      const handleStateChange = (event: Event) => {
        const customEvent = event as CustomEvent<{
          state: string;
          payload?: string;
        }>;
        const state = customEvent.detail?.state || "unverified";
        const newPayload =
          customEvent.detail?.payload || (el as any)?.value || null;

        setCurrentState(state);
        setPayload(newPayload);

        if (state === "verified" && newPayload) {
          onVerified?.(newPayload);
        }
        onStateChange?.(state, newPayload);
      };

      el.addEventListener("statechange", handleStateChange);

      return () => {
        el.removeEventListener("statechange", handleStateChange);
      };
    }, [onVerified, onStateChange, widgetKey]);

    return (
      <Box
        className={className}
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "8px 0",
        }}
      >
        <altcha-widget
          key={widgetKey}
          ref={widgetRef}
          challengeurl={challengeUrl}
          strings={DEFAULT_INDONESIAN_STRINGS}
          hidefooter={hideFooter ? "true" : undefined}
          hidelogo={hideLogo ? "true" : undefined}
          auto={auto}
          test={test ? "true" : undefined}
          style={
            {
              "--altcha-max-width": "100%",
              "--altcha-border-radius": "8px",
            } as any
          }
        />
        {currentState === "error" && (
          <Text size="xs" c="red" mt={4}>
            Verifikasi keamanan gagal. Silakan klik ulang untuk mencoba lagi.
          </Text>
        )}
      </Box>
    );
  },
);

AltchaWidget.displayName = "AltchaWidget";
