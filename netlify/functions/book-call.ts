import { handleBookCall } from '../../server/bookCall.ts';

export async function handler(event: {
  httpMethod: string;
  queryStringParameters: Record<string, string | undefined> | null;
  body: string | null;
}) {
  const result = await handleBookCall({
    method: event.httpMethod,
    query: event.queryStringParameters ?? {},
    body: event.body,
  });
  return {
    statusCode: result.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: result.status === 204 ? '' : JSON.stringify(result.body),
  };
}
