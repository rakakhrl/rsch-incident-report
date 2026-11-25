import {
  Avatar,
  Box,
  Button,
  Center,
  getGradient,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDeviceInfo } from "../../../utils/useDeviceInfo";
import useAppRoute from "../../../config/appRoute";
import { useEffect, useRef, useState } from "react";
import classes from "./login.module.css";
import { useLogin } from "../api/login";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { decryptData, encryptData } from "../../../utils/encryptDecrypt";
import { AltchaWidget, type AltchaWidgetRef } from "../../../components/captcha";
import { verifyCaptcha } from "../../../services/captcha.service";

function Login() {
  const info = useDeviceInfo();
  const { go } = useAppRoute();
  const theme = useMantineTheme();

  // States
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const emailFloating = emailFocused || email.length > 0 || undefined;
  const [emailError, setEmailError] = useState<any>();
  const [password, setPassword] = useState("");
  const [pwFocused, setPwFocused] = useState(false);
  const pwFloating = pwFocused || password.length > 0 || undefined;
  const [pwError, setPwError] = useState<any>();
  const user = localStorage.getItem("userID-value");

  // State & Ref CAPTCHA
  const captchaRef = useRef<AltchaWidgetRef>(null);
  const [captchaPayload, setCaptchaPayload] = useState<string | null>(null);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);

  const login = useLogin({});

  const onLogin = async () => {
    let hasError = false;
    if (email === "") {
      setEmailError("User wajib diisi");
      hasError = true;
    }
    if (password === "") {
      setPwError("Password wajib diisi");
      hasError = true;
    }
    if (hasError) return;

    if (!captchaPayload) {
      showNotification({
        title: <Title order={5}>Verifikasi Diperlukan</Title>,
        message: (
          <Text c="dark">
            Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.
          </Text>
        ),
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
        styles: (theme) => ({
          root: {
            borderColor: theme.colors.red[5],
          },
        }),
      });
      return;
    }

    setIsVerifyingCaptcha(true);
    const captchaRes = await verifyCaptcha(captchaPayload);
    setIsVerifyingCaptcha(false);

    if (!captchaRes.verified) {
      showNotification({
        title: <Title order={5}>Verifikasi CAPTCHA Gagal</Title>,
        message: (
          <Text c="dark">
            {captchaRes.error ||
              "Tantangan keamanan kedaluwarsa atau tidak valid. Silakan ulangi."}
          </Text>
        ),
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
        styles: (theme) => ({
          root: {
            borderColor: theme.colors.red[5],
          },
        }),
      });
      setCaptchaPayload(null);
      captchaRef.current?.reset();
      return;
    }

    const payload = {
      UserID: email,
      Password: password,
    };
    login.mutateAsync({ payload: payload });
  };

  useEffect(() => {
    if (email !== "") setEmailError(undefined);

    if (password !== "") setPwError(undefined);
  }, [email, password]);

  useEffect(() => {
    if (login.isSuccess) {
      showNotification({
        title: <Title order={5}>Login Success</Title>,
        message: <Text c="dark">Welcome</Text>,
        icon: <FontAwesomeIcon icon={faCheckCircle} size="xl" />,
        color: "green",
        styles: (theme) => ({
          root: {
            borderColor: theme.colors.green[5],
          },
        }),
      });
    }

    if (login.isError) {
      const error = login.error.message;
      showNotification({
        title: <Title order={5}>Login Failed</Title>,
        message: <Text c="dark">{error}</Text>,
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
        styles: (theme) => ({
          root: {
            borderColor: theme.colors.red[5],
          },
        }),
      });
      // Reset CAPTCHA jika login gagal untuk keamanan
      setCaptchaPayload(null);
      captchaRef.current?.reset();
    }
  }, [login.isSuccess, login.isError]);

  useEffect(() => {
    if (login.data) {
      const res = login.data.data.data;
      if (res === "Success") {
        const userData = {
          UserID: email,
          expiredDate: dayjs().add(6, "day").toDate(),
        };

        const encrypted = encryptData(userData);

        localStorage.setItem("userID-value", encrypted);
        go("/home");
      }
    }
  }, [login.data]);

  useEffect(() => {
    if (user && user !== "") {
      const userData = decryptData(user);

      if (userData?.expiredDate < new Date()) {
        localStorage.removeItem("userID-value");
        go("/login");
      }

      go("/home");
    }
  }, [user]);

  return (
    <>
      <Stack justify="space-between" h={info.size.height} w={info.size.width}>
        <Stack>
          <Box
            bg={getGradient({ deg: 90, from: "green.9", to: "green.6" }, theme)}
            w="100%"
            h={info.size.height * 0.3}
            style={{
              WebkitClipPath: "polygon(0 0, 100% 0, 100% 66%, 0 100%)",
              position: "relative",
              top: 0,
              left: 0,
            }}
          ></Box>
          <Center>
            <Avatar
              variant="transparent"
              radius={84}
              size="xl"
              src="/rs-charitas.png"
              style={{
                position: "absolute",
                top: info.size.height * 0.2,
                left: info.size.width * 0.385,
              }}
            />
          </Center>

          <Stack align="center" pt="10%">
            <LoadingOverlay visible={false} />
            <TextInput
              label="User"
              labelProps={{ "data-floating": emailFloating }}
              classNames={{
                root: classes.root,
                input: classes.input,
                label: classes.label,
              }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              size="lg"
              h={70}
              w="70%"
              error={emailError}
            />
            <PasswordInput
              label="Password"
              labelProps={{ "data-floating": pwFloating }}
              classNames={{
                root: classes.root,
                input: classes.input,
                label: classes.label,
              }}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              size="lg"
              h={70}
              w="70%"
              error={pwError}
            />

            {/* Widget Verifikasi CAPTCHA ALTCHA */}
            <Box w="70%" my="xs">
              <AltchaWidget
                ref={captchaRef}
                onVerified={(p) => setCaptchaPayload(p)}
                onStateChange={(state) => {
                  if (state !== "verified") setCaptchaPayload(null);
                }}
              />
            </Box>

            <Button
              w="70%"
              onClick={() => {
                onLogin();
              }}
              loading={login.isPending || isVerifyingCaptcha}
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default Login;
