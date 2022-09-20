import type { Context } from "https://edge.netlify.com";

export default async (_req: Request, { next, log }: Context) => {
  const res = await next();

  let timer: number | undefined = undefined;
  let count = 0
  const body = new ReadableStream({
    start(controller) {
      timer = setInterval(() => {
        const message = `<p>It is ${new Date().toISOString()}</p>\n`;
        log(message)
        controller.enqueue(new TextEncoder().encode(message));

        if (count > 10) {
          clearInterval(timer);
          controller.close();
        }

        count++;
      }, 300);
    },
    cancel() {
      if (timer !== undefined) {
        clearInterval(timer);
      }
    },
  });

  return new Response(body, res);
};
