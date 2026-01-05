import sharp from "sharp";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File | null;

        if (!file) {
            return new Response("No image uploaded", { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const compressed = await sharp(buffer)
            .jpeg({ quality: 60 })
            .toBuffer();

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
