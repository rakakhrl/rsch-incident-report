import * as React from "react";

type AltchaWidgetAttributes = React.HTMLAttributes<HTMLElement> & {
  challengeurl?: string;
  challengejson?: string;
  auto?: string;
  name?: string;
  hidefooter?: boolean | string;
  hidelogo?: boolean | string;
  strings?: string;
  test?: boolean | string;
  delay?: number | string;
  ref?: React.Ref<any>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": React.DetailedHTMLProps<
        AltchaWidgetAttributes,
        HTMLElement
      >;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": React.DetailedHTMLProps<
        AltchaWidgetAttributes,
        HTMLElement
      >;
    }
  }
}

export {};
