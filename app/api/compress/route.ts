import sharp from "sharp";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File | null;

        // 1️⃣ File wajib ada
        if (!file) {
            return new Response("No image uploaded", { status: 400 });
        }

        // 2️⃣ Validasi tipe file
        if (!ALLOWED_TYPES.includes(file.type)) {
            return new Response("Format file tidak didukung", { status: 400 });
        }

        // 3️⃣ Validasi ukuran
        if (file.size > MAX_SIZE) {
            return new Response("Ukuran file melebihi 5MB", { status: 400 });
        }

        // 4️⃣ Convert ke buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Validasi apakah file benar-benar gambar
        try {
            const metadata = await sharp(buffer).metadata();

            if (!metadata.format) {
                return new Response("File bukan gambar valid", { status: 400 });
            }
        } catch {
            return new Response("File bukan gambar valid", { status: 400 });
        }

        // 5️⃣ Compress
        const compressed = await sharp(buffer)
            .jpeg({ quality: 60 })
            .toBuffer();

        // 6️⃣ Return hasil
        return new Response(
            new Uint8Array(compressed),
            {
                headers: {
                    "Content-Type": "image/jpeg",
                    "Content-Disposition": 'attachment; filename="compressed.jpg"',
                },
            }
        );


    } catch (error) {
        return new Response("Compression failed", { status: 500 });
    }
}
