import type { ComponentType, SVGProps } from "react";
import {
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaTelegramPlane,
  FaWhatsapp,
  FaRegEnvelope,
} from "react-icons/fa";
import { useAdmin, type ContactLinks } from "@/lib/admin-store";

export type SocialLink = {
  key: string;
  field: keyof ContactLinks;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const ICON_MAP = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
  telegram: FaTelegramPlane,
  whatsapp: FaWhatsapp,
  email: FaRegEnvelope,
} as const;

/** Hook that returns social links resolved from the admin store. */
export function useSocialLinks(): SocialLink[] {
  const { state } = useAdmin();
  const c = state.contacts;

  return [
    { key: "contact.instagram", field: "instagram", href: c.instagram, Icon: ICON_MAP.instagram },
    { key: "contact.tiktok", field: "tiktok", href: c.tiktok, Icon: ICON_MAP.tiktok },
    { key: "contact.facebook", field: "facebook", href: c.facebook, Icon: ICON_MAP.facebook },
    { key: "contact.telegram", field: "telegram", href: c.telegram, Icon: ICON_MAP.telegram },
    { key: "contact.whatsapp", field: "whatsapp", href: c.whatsapp, Icon: ICON_MAP.whatsapp },
    { key: "contact.email", field: "email", href: c.email.startsWith("http") ? c.email : `mailto:${c.email}`, Icon: ICON_MAP.email },
  ];
}
