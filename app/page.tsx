// app/page.tsx
// import ImageCompressor from "./components/image_compressor";
import { FeatureCard } from "./components/feature_card";

export default function HomePage() {
  return (
    <div className="space-y-16">

      {/* HERO */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Simple Image Tools <br />
          <span className="text-[#6E026F]">for Everyone</span>
        </h1>
        <div className="flex justify-center">
          <span className="h-1.5 w-24 bg-[#6E026F] rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-600 text-lg max-w-xl text-center">
            Compress and convert images{" "}
            <span className="text-[#6E026F] font-semibold">
              fast & securely
            </span>
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <span className="px-4 py-1 rounded-full bg-teal-100 text-teal-700 text-sm">
              No upload history
            </span>
            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
              Free & Fast
            </span>
          </div>
        </div>

      </section>

      {/* FEATURES */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Available Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FeatureCard
            title="Image Compressor"
            description="Reduce image size without losing quality."
            href="/compress"
          />

          <FeatureCard
            title="Image Converter"
            description="Convert JPG, PNG, WEBP easily."
            disabled
          />
        </div>
      </section>
    </div >
  );
}
