import type { Context } from "https://edge.netlify.com";

export default async (_req: Request, { geo, next }: Context) => {
  const res = await next();
  const stream = res.body
    ?.pipeThrough(new TextDecoderStream())
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(
            chunk.replaceAll(
              "Original Content",
              `Streamed Content from ${geo.city}, ${geo.subdivision?.name}, ${geo.country?.name}`,
            ),
          );
        },
      }),
    )
    .pipeThrough(new TextEncoderStream());

  res.headers.delete("content-length");

  return new Response(stream, res);
};
