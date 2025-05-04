"use client";
import { useRouter, usePathname } from "next/navigation";

const locales = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ph", label: "Filipino" },
  { code: "th", label: "Thai" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (locale: string) => {
    const segments = (pathname ?? "").split("/");
    if (locales.some((l) => l.code === segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <select
      onChange={(e) => changeLocale(e.target.value)}
      defaultValue={locales[0].code}
      className="border border-gray-300 rounded p-1"
    >
      {locales.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.label}
        </option>
      ))}
    </select>
  );
}
