import Link from "next/link";

export function FeatureCard({
  title,
  description,
  href = "#",
  disabled = false,
}: {
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
}) {
  const content = (
    <div
      className={`relative rounded-xl border p-6 transition
        ${
          disabled
            ? "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-white border-[#6E026F] text-[#6E026F] hover:bg-[#6E026F] hover:text-white"
        }
      `}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>

      {/* Overlay hanya muncul kalau disabled */}
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl opacity-0 hover:opacity-100 transition">
          <span className="text-sm font-semibold text-[#6E026F]">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );

  return disabled ? content : <Link href={href}>{content}</Link>;
}
